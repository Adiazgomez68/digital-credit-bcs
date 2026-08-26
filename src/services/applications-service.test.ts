import { apiClient, ApiError, generateCorrelationId } from "@/lib/http-client";
import { ENDPOINTS } from "@/routes/endpoints";
import {
  abandonApplication,
  createApplication,
  finalizeApplication,
  getApplication,
  getApplicationEvents,
  listApplications,
  returnToDraft,
  simulateOffer,
  submitApplicationForReview,
  updateApplication,
} from "@/services/applications-service";
import type {
  Application,
  CreateApplicationPayload,
} from "@/types/application";
import { describe, expect, it } from "vitest";

function buildPayload(
  overrides: Partial<CreateApplicationPayload> = {},
): CreateApplicationPayload {
  return {
    channel: "unassisted",
    document: { type: "CC", number: crypto.randomUUID() },
    names: "Ana Test",
    phone: "3000000000",
    email: "ana@test.com",
    ...overrides,
  };
}

const VIABLE_FINANCIALS = {
  income: 5_000_000,
  expenses: 1_000_000,
  amountRequested: 2_000_000,
  termMonths: 12,
};

describe("createApplication", () => {
  it("creates a new draft when the document has none yet", async () => {
    const { application, isExistingDraft } =
      await createApplication(buildPayload());

    expect(application.status).toBe("draft");
    expect(isExistingDraft).toBe(false);
  });

  it("returns the existing draft instead of creating a duplicate", async () => {
    const document = { type: "CC", number: crypto.randomUUID() };

    const first = await createApplication(buildPayload({ document }));
    const second = await createApplication(buildPayload({ document }));

    expect(second.application.id).toBe(first.application.id);
    expect(second.isExistingDraft).toBe(true);
  });
});

describe("simulateOffer", () => {
  it("returns a viable offer when the fee fits the payment capacity", async () => {
    const { application } = await createApplication(buildPayload());
    await updateApplication(
      application.id,
      {
        income: 5_000_000,
        expenses: 1_000_000,
        amountRequested: 2_000_000,
        termMonths: 12,
      },
      "client",
    );

    const result = await simulateOffer(application.id);

    expect(result.status).toBe("simulation_realized");
    expect(result.offer?.result).toBe("success");
  });

  it("marks the offer as not viable when the fee exceeds the payment capacity", async () => {
    const { application } = await createApplication(buildPayload());
    await updateApplication(
      application.id,
      {
        income: 1_000_000,
        expenses: 900_000,
        amountRequested: 50_000_000,
        termMonths: 12,
      },
      "client",
    );

    const result = await simulateOffer(application.id);

    expect(result.status).toBe("simulation_rejected");
    expect(result.offer?.result).toBe("not_viable");
  });

  it("triggers the reproducible technical-error scenario", async () => {
    const { application } = await createApplication(buildPayload());
    await updateApplication(
      application.id,
      {
        income: 5_000_000,
        expenses: 1_000_000,
        amountRequested: 999_999_999,
        termMonths: 12,
      },
      "client",
    );

    await expect(simulateOffer(application.id)).rejects.toMatchObject({
      status: 503,
    });
  });
});

describe("returnToDraft", () => {
  it("returns a viable simulation back to draft, clearing the offer", async () => {
    const { application } = await createApplication(buildPayload());
    await updateApplication(application.id, VIABLE_FINANCIALS, "client");
    await simulateOffer(application.id);

    const result = await returnToDraft(application.id);

    expect(result.status).toBe("draft");
    expect(result.resumeRoute).toBe("/credit/simulation");
    expect(result.offer).toBeUndefined();
  });

  it("returns a not-viable simulation back to draft", async () => {
    const { application } = await createApplication(buildPayload());
    await updateApplication(
      application.id,
      {
        income: 1_000_000,
        expenses: 900_000,
        amountRequested: 50_000_000,
        termMonths: 12,
      },
      "client",
    );
    await simulateOffer(application.id);

    const result = await returnToDraft(application.id);

    expect(result.status).toBe("draft");
    expect(result.offer).toBeUndefined();
  });

  it("is a no-op when the application never left draft (eg. after a technical-error simulation)", async () => {
    const { application } = await createApplication(buildPayload());
    await updateApplication(
      application.id,
      { ...VIABLE_FINANCIALS, amountRequested: 999_999_999 },
      "client",
    );
    await expect(simulateOffer(application.id)).rejects.toMatchObject({
      status: 503,
    });

    const result = await returnToDraft(application.id);

    expect(result.status).toBe("draft");
  });

  it("rejects returning to draft from a status other than draft/simulated", async () => {
    const { application } = await createApplication(buildPayload());
    await abandonApplication(
      application.id,
      { reason: "El cliente ya no está interesado" },
      "client",
    );

    await expect(returnToDraft(application.id)).rejects.toMatchObject({
      status: 409,
    });
  });

  it("rejects when the caller isn't the client (advisor gate)", async () => {
    const { application } = await createApplication(
      buildPayload({ channel: "assisted" }),
    );
    await updateApplication(application.id, VIABLE_FINANCIALS, "client");
    await simulateOffer(application.id);

    const promise = apiClient.post<Application>(
      ENDPOINTS.APPLICATIONS.RETURN_TO_DRAFT(application.id),
      undefined,
      { correlationId: generateCorrelationId(), actor: "advisor" },
    );

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({ status: 409 });
  });
});

describe("updateApplication", () => {
  it("lets the client edit a draft", async () => {
    const { application } = await createApplication(buildPayload());

    const result = await updateApplication(
      application.id,
      { names: "Nombre Actualizado" },
      "client",
    );

    expect(result.names).toBe("Nombre Actualizado");
  });

  it("rejects an advisor editing a draft (only the client can)", async () => {
    const { application } = await createApplication(buildPayload());

    const promise = updateApplication(
      application.id,
      { names: "Otro nombre" },
      "advisor",
    );

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({ status: 409 });
  });
});

describe("listApplications (service, over MSW)", () => {
  it("filters through the real endpoint's query params", async () => {
    const marker = crypto.randomUUID();
    await createApplication(
      buildPayload({ names: marker, channel: "assisted" }),
    );
    await createApplication(
      buildPayload({ names: marker, channel: "unassisted" }),
    );

    const results = (await listApplications({ channel: "assisted" })).filter(
      (application) => application.names === marker,
    );

    expect(results).toHaveLength(1);
    expect(results[0].channel).toBe("assisted");
  });
});

describe("getApplication", () => {
  it("returns the application by id", async () => {
    const { application } = await createApplication(buildPayload());

    const result = await getApplication(application.id);

    expect(result.id).toBe(application.id);
  });

  it("rejects with a 404 for an unknown id", async () => {
    await expect(getApplication(crypto.randomUUID())).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("getApplicationEvents", () => {
  it("returns the traceability events for that application", async () => {
    const { application } = await createApplication(buildPayload());

    const events = await getApplicationEvents(application.id);

    expect(events.some((event) => event.type === "application_created")).toBe(
      true,
    );
  });

  it("rejects with a 404 for an unknown id", async () => {
    await expect(
      getApplicationEvents(crypto.randomUUID()),
    ).rejects.toMatchObject({ status: 404 });
  });
});

describe("submitApplicationForReview", () => {
  it("moves an assisted, simulated application to pending_validation", async () => {
    const { application } = await createApplication(
      buildPayload({ channel: "assisted" }),
    );
    await updateApplication(application.id, VIABLE_FINANCIALS, "client");
    await simulateOffer(application.id);

    const result = await submitApplicationForReview(application.id);

    expect(result.status).toBe("pending_validation");
  });

  it("rejects a draft that hasn't been simulated yet", async () => {
    const { application } = await createApplication(
      buildPayload({ channel: "assisted" }),
    );

    await expect(
      submitApplicationForReview(application.id),
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe("finalizeApplication", () => {
  it("closes directly when unassisted and simulated (client)", async () => {
    const { application } = await createApplication(
      buildPayload({ channel: "unassisted" }),
    );
    await updateApplication(application.id, VIABLE_FINANCIALS, "client");
    await simulateOffer(application.id);

    const result = await finalizeApplication(application.id, "client");

    expect(result.status).toBe("finalized");
  });

  it("finalizes on advisor approval when pending_validation", async () => {
    const { application } = await createApplication(
      buildPayload({ channel: "assisted" }),
    );
    await updateApplication(application.id, VIABLE_FINANCIALS, "client");
    await simulateOffer(application.id);
    await submitApplicationForReview(application.id);

    const result = await finalizeApplication(application.id, "advisor");

    expect(result.status).toBe("finalized");
  });

  it("rejects finalizing a plain draft", async () => {
    const { application } = await createApplication(buildPayload());

    await expect(
      finalizeApplication(application.id, "client"),
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe("abandonApplication", () => {
  it("abandons an application with a reason", async () => {
    const { application } = await createApplication(buildPayload());

    const result = await abandonApplication(
      application.id,
      { reason: "El cliente ya no está interesado" },
      "client",
    );

    expect(result.status).toBe("abandoned");
  });

  it("rejects an empty reason", async () => {
    const { application } = await createApplication(buildPayload());

    await expect(
      abandonApplication(application.id, { reason: "   " }, "client"),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("rejects abandoning an already-terminal application", async () => {
    const { application } = await createApplication(buildPayload());
    await abandonApplication(application.id, { reason: "primero" }, "client");

    await expect(
      abandonApplication(application.id, { reason: "otra vez" }, "client"),
    ).rejects.toMatchObject({ status: 409 });
  });
});
