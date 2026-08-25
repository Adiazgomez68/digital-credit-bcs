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
        setChannel: (channel, advisorId) => set({ channel, advisorId }),
        setApplicationId: (id) => set({ id }),
        reset: () => set({ id: null, channel: null }),
      }),
      {
        name: "bcs-application-draft",
        partialize: (state) => ({
          id: state.id,
          channel: state.channel,
        }),
      },
    ),
  );

export type ApplicationStoreApi = ReturnType<typeof createApplicationStore>;
