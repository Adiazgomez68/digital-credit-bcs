import type {
  Application,
  ApplicationEvent,
  ApplicationListFilters,
} from "@/types/application";

const applications = new Map<string, Application>();
const events = [] as ApplicationEvent[];

// Enforces the "one active draft per document" business rule.
function findDraftByDocument(
  document: Application["document"],
): Application | undefined {
  return [...applications.values()].find(
    (application) =>
      application.status === "draft" &&
      application.document.type === document.type &&
      application.document.number === document.number,
  );
}

// Creates a new application record, or overwrites it if the id already exists.
function insertApplication(application: Application): Application {
  applications.set(application.id, application);
  return application;
}

// Filters by exact status/channel match plus a free-text search across id, document number, and name.
function listApplications(filters: ApplicationListFilters = {}): Application[] {
  const { status, channel, search } = filters;
  const normalizedSearch = search?.trim().toLowerCase();

  return [...applications.values()].filter((application) => {
    if (status && application.status !== status) return false;
    if (channel && application.channel !== channel) return false;

    if (normalizedSearch) {
      const haystack = [
        application.id,
        application.document.number,
        application.names,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(normalizedSearch)) return false;
    }

    return true;
  });
}

// Looks up a single application by its id.
function findApplicationById(id: string): Application | undefined {
  return applications.get(id);
}

// Merges partial changes into an existing application and bumps updatedAt.
function updateApplication(
  id: string,
  changes: Partial<Application>,
): Application | undefined {
  const application = applications.get(id);

  if (!application) return undefined;

  const updated: Application = {
    ...application,
    ...changes,
    updatedAt: new Date().toISOString(),
  };

  applications.set(id, updated);
  return updated;
}

// Appends a traceability event
function insertEvent(event: ApplicationEvent): ApplicationEvent {
  events.push(event);
  return event;
}

// Returns an application's events in chronological order.
function listEventsByApplicationId(applicationId: string): ApplicationEvent[] {
  return events
    .filter((event) => event.applicationId === applicationId)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export const db = {
  findDraftByDocument,
  insertApplication,
  listApplications,
  findApplicationById,
  updateApplication,
  insertEvent,
  listEventsByApplicationId,
};
