import type { Application, ApplicationEvent } from "@/types/application";
import { describe, expect, it } from "vitest";
import { db } from "./db";

function buildEvent(
  overrides: Partial<ApplicationEvent> = {},
): ApplicationEvent {
  return {
    id: crypto.randomUUID(),
    applicationId: crypto.randomUUID(),
    type: "application_created",
    actor: "client",
    timestamp: new Date().toISOString(),
    correlationId: crypto.randomUUID(),
    ...overrides,
  };
}

function buildApplication(overrides: Partial<Application> = {}): Application {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    status: "draft",
    channel: "unassisted",
    document: { type: "CC", number: crypto.randomUUID() },
    names: "Ana Test",
    phone: "3000000000",
    email: "ana@test.com",
    resumeRoute: "/credit/basic-user-data",
    correlationId: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("db.insertApplication", () => {
  it("stores the application and makes it findable by id", () => {
    const application = buildApplication();

    const result = db.insertApplication(application);

    expect(result).toEqual(application);
    expect(db.findApplicationById(application.id)).toEqual(application);
  });
});

describe("db.insertEvent", () => {
  it("stores the event and returns it", () => {
    const event = buildEvent();

    const result = db.insertEvent(event);

    expect(result).toEqual(event);
    expect(db.listEventsByApplicationId(event.applicationId)).toContainEqual(
      event,
    );
  });
});

describe("db.findDraftByDocument", () => {
  it("finds an existing draft for the same document", () => {
    const document = { type: "CC", number: crypto.randomUUID() };
    const application = buildApplication({ document });

    db.insertApplication(application);

    expect(db.findDraftByDocument(document)).toEqual(application);
  });

  it("returns undefined when there is no draft for that document", () => {
    const document = { type: "CC", number: crypto.randomUUID() };

    expect(db.findDraftByDocument(document)).toBeUndefined();
  });

  it("ignores applications that are not in draft status", () => {
    const document = { type: "CC", number: crypto.randomUUID() };
    db.insertApplication(buildApplication({ document, status: "finalized" }));

    expect(db.findDraftByDocument(document)).toBeUndefined();
  });
});

describe("db.listApplications", () => {
  it("filters by status", () => {
    const marker = crypto.randomUUID();
    db.insertApplication(buildApplication({ names: marker, status: "draft" }));
    db.insertApplication(
      buildApplication({ names: marker, status: "finalized" }),
    );

    const results = db
      .listApplications({ status: "draft" })
      .filter((application) => application.names === marker);

    expect(results).toHaveLength(1);
    expect(results[0].status).toBe("draft");
  });

  it("filters by a free-text search across the document number and the name", () => {
    const marker = crypto.randomUUID();
    db.insertApplication(buildApplication({ names: `Carlos ${marker}` }));

    const results = db.listApplications({ search: marker });

    expect(results).toHaveLength(1);
    expect(results[0].names).toContain(marker);
  });

  it("filters by channel", () => {
    const marker = crypto.randomUUID();
    db.insertApplication(
      buildApplication({ names: marker, channel: "assisted" }),
    );
    db.insertApplication(
      buildApplication({ names: marker, channel: "unassisted" }),
    );

    const results = db
      .listApplications({ channel: "assisted" })
      .filter((application) => application.names === marker);

    expect(results).toHaveLength(1);
    expect(results[0].channel).toBe("assisted");
  });

  it("combines status, channel and search together (AND, not OR)", () => {
    const marker = crypto.randomUUID();
    const matching = buildApplication({
      names: `Carlos ${marker}`,
      status: "draft",
      channel: "assisted",
    });
    // Same marker, but wrong status: must NOT match the combined filter.
    const wrongStatus = buildApplication({
      names: `Carlos ${marker}`,
      status: "finalized",
      channel: "assisted",
    });
    db.insertApplication(matching);
    db.insertApplication(wrongStatus);

    const results = db.listApplications({
      status: "draft",
      channel: "assisted",
      search: marker,
    });

    expect(results.map((application) => application.id)).toEqual([matching.id]);
  });
});

describe("db.findApplicationById", () => {
  it("finds an application by its id", () => {
    const application = buildApplication();
    db.insertApplication(application);

    expect(db.findApplicationById(application.id)).toEqual(application);
  });

  it("returns undefined for an unknown id", () => {
    expect(db.findApplicationById(crypto.randomUUID())).toBeUndefined();
  });
});

describe("db.updateApplication", () => {
  it("update application by id with given values", () => {
    const application = buildApplication();
    db.insertApplication(application);

    const result = db.updateApplication(application.id, {
      status: "finalized",
      resumeRoute: "/credit/basic-user-data",
    });

    expect(result?.status).toEqual("finalized");
    expect(result?.resumeRoute).toEqual("/credit/basic-user-data");
  });

  it("merges changes instead of replacing the whole record", () => {
    const application = buildApplication({ names: "Original Name" });
    db.insertApplication(application);

    const result = db.updateApplication(application.id, {
      status: "finalized",
    });

    expect(result?.status).toEqual("finalized");
    // Untouched fields must survive the update.
    expect(result?.names).toEqual("Original Name");
    expect(result?.document).toEqual(application.document);
  });

  it("returns undefined when the id does not exist", () => {
    const result = db.updateApplication(crypto.randomUUID(), {
      status: "finalized",
    });

    expect(result).toBeUndefined();
  });
});

describe("db.listEventsByApplicationId", () => {
  it("returns only that application's events, in chronological order", () => {
    const applicationId = crypto.randomUUID();
    const otherApplicationId = crypto.randomUUID();

    db.insertEvent(
      buildEvent({
        applicationId,
        type: "application_finalized",
        timestamp: "2026-01-01T00:00:02.000Z",
      }),
    );
    db.insertEvent(
      buildEvent({
        applicationId,
        type: "application_created",
        timestamp: "2026-01-01T00:00:01.000Z",
      }),
    );
    db.insertEvent(buildEvent({ applicationId: otherApplicationId }));

    const events = db.listEventsByApplicationId(applicationId);

    expect(events.map((event) => event.type)).toEqual([
      "application_created",
      "application_finalized",
    ]);
  });

  it("returns an empty array when there are no events for that application", () => {
    expect(db.listEventsByApplicationId(crypto.randomUUID())).toEqual([]);
  });
});
