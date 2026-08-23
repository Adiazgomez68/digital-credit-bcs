import { ApplicationStore } from "@/types/store";
import { createStore } from "zustand";
import { persist } from "zustand/middleware";

export const createApplicationStore = () =>
  createStore<ApplicationStore>()(
    persist(
      (set) => ({
        id: null,
        channel: null,
        advisorId: undefined,
        step: "channel",
        setChannel: (channel, advisorId) => set({ channel, advisorId }),
        setApplicationId: (id) => set({ id }),
        goToStep: (step) => set({ step }),
        reset: () => set({ id: null, channel: null, step: "channel" }),
      }),
      {
        name: "bcs-application-draft",
        partialize: (state) => ({
          id: state.id,
          channel: state.channel,
          step: state.step,
        }),
      },
    ),
  );

export type ApplicationStoreApi = ReturnType<typeof createApplicationStore>;
