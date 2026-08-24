import { http } from "msw";
import {
  abandonApplicationResolver,
  acceptAlternativeOfferResolver,
  createApplicationResolver,
  finalizeApplicationResolver,
  getApplicationByIdResolver,
  getApplicationEventsResolver,
  getApplicationsResolver,
  simulateOfferResolver,
  submitApplicationForReviewResolver,
  updateApplicationResolver,
} from "./resolvers";

export const applicationsHandlers = [
  http.post("/api/applications", createApplicationResolver),
  http.get("/api/applications", getApplicationsResolver),
  http.get("/api/applications/:id", getApplicationByIdResolver),
  http.patch<{ id: string }>(
    "/api/applications/:id",
    updateApplicationResolver,
  ),
  http.post<{ id: string }>(
    "/api/applications/:id/submit-for-review",
    submitApplicationForReviewResolver,
  ),
  http.post<{ id: string }>(
    "/api/applications/:id/simulate-offer",
    simulateOfferResolver,
  ),
  http.post<{ id: string }>(
    "/api/applications/:id/accept-alternative-offer",
    acceptAlternativeOfferResolver,
  ),
  http.post<{ id: string }>(
    "/api/applications/:id/finalize",
    finalizeApplicationResolver,
  ),
  http.post<{ id: string }>(
    "/api/applications/:id/abandon",
    abandonApplicationResolver,
  ),
  http.get("/api/applications/:id/events", getApplicationEventsResolver),
];
