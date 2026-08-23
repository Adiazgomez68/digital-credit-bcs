export type ApplicationStatus =
  | "draft"
  | "simulation_realized"
  | "simulation_rejected"
  | "pending_validation"
  | "finalized"
  | "abandoned";

export type Channel = "assisted" | "unassisted";

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

export interface OfferSimulated {
  result: "success" | "not_viable" | "technical_error";
  estimatedFee?: number;
  monthlyRate?: number;
  reasonNoViable?: string;
}

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  type: string;
  actor: "client" | "advisor" | "system";
  timestamp: string;
  correlationId: string;
}
