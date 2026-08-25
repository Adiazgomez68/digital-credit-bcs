import { Channel } from "./application";

export type ApplicationState = {
  id: string | null;
  channel: Channel | null;
  advisorId?: string;
};

export type ApplicationActions = {
  setChannel: (channel: Channel, advisorId?: string) => void;
  setApplicationId: (id: string) => void;
  reset: () => void;
};

export type ApplicationStore = ApplicationState & ApplicationActions;
