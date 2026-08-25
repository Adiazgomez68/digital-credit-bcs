import { db } from "@/mocks/db";
import {
  AbandonApplicationPayload,
  Actor,
  AlternativeOffer,
  Application,
  ApplicationEvent,
  ApplicationEventType,
  ApplicationStatus,
  Channel,
  CreateApplicationPayload,
  OfferSimulated,
  UpdateApplicationPayload,
} from "@/types/application";
import { HttpResponse } from "msw";

// Mock capacity-of-payment rule: only 35% of free income can go to the new fee.
const DEBT_TO_INCOME_THRESHOLD = 0.35;
const MONTHLY_RATE = 0.018;
// Reproducible technical-error hook.
const TECHNICAL_ERROR_TRIGGER_AMOUNT = 999_999_999;
// Below this, an alternative offer wouldn't be a meaningful amount to offer.
const MIN_ALTERNATIVE_AMOUNT = 1_000_000;

function buildEvent(
  applicationId: string,
  type: ApplicationEventType,
  actor: Actor,
  correlationId: string,
  reason?: string,
): ApplicationEvent {
  return {
    id: crypto.randomUUID(),
    applicationId,
    type,
    actor,
    timestamp: new Date().toISOString(),
    correlationId,
    reason,
  };
}

// Reads the caller's role from the mock actor header (set by the http-client).
function getActor(request: Request): Actor | null {
  const actor = request.headers.get("X-Actor");
  return actor === "client" || actor === "advisor" ? actor : null;
}

// Falls back to the application's own correlationId when the request doesn't carry one.
function getCorrelationId(request: Request, application: Application): string {
  return request.headers.get("X-Correlation-Id") ?? application.correlationId;
}

function estimateMonthlyFee(
  amountRequested: number,
  termMonths: number,
): number {
  const rate = MONTHLY_RATE;
  return (amountRequested * rate) / (1 - Math.pow(1 + rate, -termMonths));
}

// When a simulation isn't viable, offers the largest amount (same term) that
// would fit the client's payment capacity, rounded down to a clean figure.
function computeAlternativeOffer(
  paymentCapacity: number,
  termMonths: number,
): AlternativeOffer | undefined {
  const rate = MONTHLY_RATE;
  const maxAmount =
    (paymentCapacity * (1 - Math.pow(1 + rate, -termMonths))) / rate;
  const amountRequested = Math.floor(maxAmount / 100_000) * 100_000;

  if (amountRequested < MIN_ALTERNATIVE_AMOUNT) return undefined;

  return {
    amountRequested,
    termMonths,
    estimatedFee: estimateMonthlyFee(amountRequested, termMonths),
  };
}

export async function createApplicationResolver({
  request,
}: {
  request: Request;
}) {
  const payload = (await request.json()) as Partial<CreateApplicationPayload>;

  if (
    !payload.channel ||
    !payload.document?.type ||
    !payload.document?.number ||
    !payload.names ||
    !payload.phone ||
    !payload.email
  ) {
    return HttpResponse.json(
      { message: "Faltan datos obligatorios para crear la solicitud" },
      { status: 400 },
    );
  }

  const existingDraft = db.findDraftByDocument(payload.document);
  if (existingDraft) {
    return HttpResponse.json(existingDraft, { status: 200 });
  }

  const correlationId =
    request.headers.get("X-Correlation-Id") ?? crypto.randomUUID();
  const now = new Date().toISOString();

  const application: Application = {
    id: crypto.randomUUID(),
    status: "draft",
    channel: payload.channel,
    advisorId: payload.advisorId,
    document: payload.document,
    names: payload.names,
    phone: payload.phone,
    email: payload.email,
    city: payload.city,
    resumeRoute: "/credit/supplementary-user-data",
    correlationId,
    createdAt: now,
    updatedAt: now,
  };

  db.insertApplication(application);
  db.insertEvent(
    buildEvent(application.id, "application_created", "client", correlationId),
  );

  return HttpResponse.json(application, { status: 201 });
}

export async function getApplicationsResolver({
  request,
}: {
  request: Request;
}) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const channel = url.searchParams.get("channel") || undefined;

  const applications = db.listApplications({
    search,
    status: status as ApplicationStatus,
    channel: channel as Channel,
  });

  return HttpResponse.json(applications, { status: 200 });
}

export async function getApplicationByIdResolver({
  params,
}: {
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);

  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  return HttpResponse.json(application, { status: 200 });
}

export async function updateApplicationResolver({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);
  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  const actor = getActor(request);
  const correlationId = getCorrelationId(request, application);
  const dataChanges = (await request.json()) as UpdateApplicationPayload;

  if (Object.keys(dataChanges).length === 0) {
    return HttpResponse.json(
      { message: "No hay datos para actualizar" },
      { status: 400 },
    );
  }

  // Gated by current status + who's calling.
  const canEdit =
    (application.status === "draft" && actor === "client") ||
    (application.status === "pending_validation" && actor === "advisor");

  if (!canEdit) {
    return HttpResponse.json(
      { message: "La solicitud no puede editarse en su estado actual" },
      { status: 409 },
    );
  }

  const updated = db.updateApplication(application.id, dataChanges);
  db.insertEvent(
    buildEvent(
      application.id,
      "application_data_updated",
      actor,
      correlationId,
    ),
  );

  return HttpResponse.json(updated, { status: 200 });
}

export async function submitApplicationForReviewResolver({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);
  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  const actor = getActor(request);
  const isValidTransition =
    application.status === "simulation_realized" &&
    application.channel === "assisted" &&
    actor === "client";

  if (!isValidTransition) {
    return HttpResponse.json(
      {
        message:
          "La solicitud no puede enviarse a validación en su estado actual",
      },
      { status: 409 },
    );
  }

  const correlationId = getCorrelationId(request, application);
  const updated = db.updateApplication(application.id, {
    status: "pending_validation",
    resumeRoute: "/credit/confirmation",
  });
  db.insertEvent(
    buildEvent(
      application.id,
      "application_submitted_for_review",
      "client",
      correlationId,
    ),
  );

  return HttpResponse.json(updated, { status: 200 });
}

export async function simulateOfferResolver({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);

  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  if (application.status !== "draft") {
    return HttpResponse.json(
      { message: "La solicitud no está en un estado válido para simular" },
      { status: 409 },
    );
  }

  const { income, expenses, amountRequested, termMonths } = application;

  if (
    income == null ||
    expenses == null ||
    amountRequested == null ||
    termMonths == null
  ) {
    return HttpResponse.json(
      { message: "Faltan datos complementarios para simular la oferta" },
      { status: 400 },
    );
  }

  const correlationId = getCorrelationId(request, application);

  if (amountRequested === TECHNICAL_ERROR_TRIGGER_AMOUNT) {
    db.insertEvent(
      buildEvent(
        application.id,
        "offer_simulated_technical_error",
        "system",
        correlationId,
      ),
    );
    return HttpResponse.json(
      { message: "Error técnico simulando la oferta, intenta de nuevo" },
      { status: 503 },
    );
  }

  const estimatedFee = estimateMonthlyFee(amountRequested, termMonths);
  const paymentCapacity = (income - expenses) * DEBT_TO_INCOME_THRESHOLD;
  const isViable = estimatedFee <= paymentCapacity;

  const offer: OfferSimulated = isViable
    ? { result: "success", estimatedFee, monthlyRate: MONTHLY_RATE }
    : {
        result: "not_viable",
        reasonNoViable: "La cuota estimada supera tu capacidad de pago",
        alternativeOffer: computeAlternativeOffer(paymentCapacity, termMonths),
      };

  const nextStatus: ApplicationStatus = isViable
    ? "simulation_realized"
    : "simulation_rejected";

  const updated = db.updateApplication(application.id, {
    status: nextStatus,
    offer,
    resumeRoute: isViable ? "/credit/summary" : application.resumeRoute,
  });

  db.insertEvent(
    buildEvent(
      application.id,
      isViable ? "offer_simulated_success" : "offer_simulated_not_viable",
      "client",
      correlationId,
    ),
  );

  return HttpResponse.json(updated, { status: 200 });
}

export async function returnToDraftResolver({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);
  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  const actor = getActor(request);
  const isValidated =
    (application.status === "simulation_rejected" ||
      application.status === "simulation_realized") &&
    actor === "client";

  if (!isValidated) {
    return HttpResponse.json(
      {
        message:
          "No se pudo actualizar el estado de la solicitud a borrador (draft)",
      },
      { status: 409 },
    );
  }

  const correlationId = getCorrelationId(request, application);

  const updated = db.updateApplication(application.id, {
    status: "draft",
    resumeRoute: "/credit/simulation",
  });

  db.insertEvent(
    buildEvent(
      application.id,
      "application_returned_to_draft",
      "client",
      correlationId,
    ),
  );

  return HttpResponse.json(updated, { status: 200 });
}

export async function acceptAlternativeOfferResolver({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);
  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  const actor = getActor(request);
  const alternativeOffer = application.offer?.alternativeOffer;

  const canAccept =
    application.status === "simulation_rejected" &&
    actor === "client" &&
    alternativeOffer != null;

  if (!canAccept) {
    return HttpResponse.json(
      { message: "No hay una oferta alternativa disponible para aceptar" },
      { status: 409 },
    );
  }

  const correlationId = getCorrelationId(request, application);
  const updated = db.updateApplication(application.id, {
    status: "simulation_realized",
    amountRequested: alternativeOffer.amountRequested,
    termMonths: alternativeOffer.termMonths,
    offer: {
      result: "success",
      estimatedFee: alternativeOffer.estimatedFee,
      monthlyRate: MONTHLY_RATE,
    },
    resumeRoute: "/credit/summary",
  });

  db.insertEvent(
    buildEvent(
      application.id,
      "alternative_offer_accepted",
      "client",
      correlationId,
    ),
  );

  return HttpResponse.json(updated, { status: 200 });
}

export async function finalizeApplicationResolver({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);
  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  const actor = getActor(request);

  const isDirectClose =
    application.status === "simulation_realized" &&
    application.channel === "unassisted" &&
    actor === "client";
  const isAdvisorApproval =
    application.status === "pending_validation" && actor === "advisor";

  if (!isDirectClose && !isAdvisorApproval) {
    return HttpResponse.json(
      { message: "La solicitud no puede finalizarse en su estado actual" },
      { status: 409 },
    );
  }

  const correlationId = getCorrelationId(request, application);
  const updated = db.updateApplication(application.id, {
    status: "finalized",
    resumeRoute: "/credit/confirmation",
  });
  db.insertEvent(
    buildEvent(
      application.id,
      "application_finalized",
      actor as Actor,
      correlationId,
    ),
  );

  return HttpResponse.json(updated, { status: 200 });
}

export async function abandonApplicationResolver({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);
  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  const payload = (await request.json()) as Partial<AbandonApplicationPayload>;
  if (!payload.reason?.trim()) {
    return HttpResponse.json(
      { message: "Debes indicar un motivo de abandono" },
      { status: 400 },
    );
  }

  const terminalStatuses: ApplicationStatus[] = ["finalized", "abandoned"];
  if (terminalStatuses.includes(application.status)) {
    return HttpResponse.json(
      { message: "La solicitud ya se encuentra en un estado terminal" },
      { status: 409 },
    );
  }

  const actor = getActor(request) ?? "client";
  const correlationId = getCorrelationId(request, application);
  const updated = db.updateApplication(application.id, { status: "abandoned" });

  db.insertEvent(
    buildEvent(
      application.id,
      "application_abandoned",
      actor,
      correlationId,
      payload.reason,
    ),
  );

  return HttpResponse.json(updated, { status: 200 });
}

export async function getApplicationEventsResolver({
  params,
}: {
  params: { id: string };
}) {
  const application = db.findApplicationById(params.id);
  if (!application) {
    return HttpResponse.json(
      { message: "Solicitud no encontrada" },
      { status: 404 },
    );
  }

  const events = db.listEventsByApplicationId(params.id);
  return HttpResponse.json(events, { status: 200 });
}
