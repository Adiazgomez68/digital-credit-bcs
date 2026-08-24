import { Channel } from "./application";

export type ApplicationState = {
  id: string | null;
  channel: Channel | null;
  advisorId?: string;
  step:
    "channel" | "basic_data" | "supplementary_data" | "simulation" | "summary";
};

export type ApplicationActions = {
  setChannel: (channel: Channel, advisorId?: string) => void;
  setApplicationId: (id: string) => void;
  goToStep: (step: ApplicationState["step"]) => void;
  reset: () => void;
};

export type ApplicationStore = ApplicationState & ApplicationActions;
