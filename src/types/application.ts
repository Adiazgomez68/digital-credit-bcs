export type ApplicationStatus =
  | "draft"
  | "simulation_realized"
  | "simulation_rejected"
  | "pending_validation"
  | "finalized"
  | "abandoned";

export type Channel = "assisted" | "unassisted";

export type Actor = "client" | "advisor" | "system";
export type HttpActor = Exclude<Actor, "system">;

export interface Application {
  id: string;
  status: ApplicationStatus;
  channel: Channel;
  advisorId?: string;
  document: { type: string; number: string };
  names: string;
  phone: string;
  email: string;
  city?: string;
  income?: number;
  expenses?: number;
  amountRequested?: number;
  termMonths?: number;
  loanPurpose?: string;
  privacyPolicy?: boolean;
  offer?: OfferSimulated;
  lastRoute: string;
  correlationId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateApplicationPayload = Pick<
  Application,
  "channel" | "document" | "names" | "phone" | "email"
> &
  Partial<Pick<Application, "city" | "advisorId">>;

export interface ApplicationListFilters {
  status?: ApplicationStatus;
  channel?: Channel;
  search?: string;
}

export type UpdateApplicationPayload = Partial<
  Pick<
    Application,
    | "names"
    | "phone"
    | "email"
    | "city"
    | "income"
    | "expenses"
    | "amountRequested"
    | "termMonths"
    | "loanPurpose"
    | "privacyPolicy"
    | "lastRoute"
  >
>;

export interface AbandonApplicationPayload {
  reason: string;
}

export interface AlternativeOffer {
  amountRequested: number;
  termMonths: number;
  estimatedFee: number;
}

export interface OfferSimulated {
  result: "success" | "not_viable" | "technical_error";
  estimatedFee?: number;
  monthlyRate?: number;
  reasonNoViable?: string;
  alternativeOffer?: AlternativeOffer;
}

export type ApplicationEventType =
  | "application_created"
  | "application_data_updated"
  | "application_submitted_for_review"
  | "offer_simulated_success"
  | "offer_simulated_not_viable"
  | "offer_simulated_technical_error"
  | "alternative_offer_accepted"
  | "application_finalized"
  | "application_abandoned";

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  type: ApplicationEventType;
  actor: Actor;
  timestamp: string;
  correlationId: string;
  /** Only set for application_abandoned. */
  reason?: string;
}
