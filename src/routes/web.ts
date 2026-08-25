export const WEB_ROUTES = {
  ADVISOR: {
    HOME: "/advisor-portal",
    AUTH: "/advisor-portal/auth",
    APPLICATIONS: "/advisor-portal/applications",
  },

  CLIENT: {
    HOME: "/",
    CREDIT: {
      CHANNEL: "/credit/channel",
      BASIC_DATA: "/credit/basic-user-data",
      SUPPLEMENTARY_DATA: "/credit/supplementary-user-data",
      SIMULATION: "/credit/simulation",
      SUMMARY: "/credit/summary",
      CONFIRMATION: "/credit/confirmation",
    },
  },
} as const;

export type WizardStep =
  "channel" | "basic_data" | "supplementary_data" | "simulation" | "summary";

// Maps a wizard step to the route that renders it.
export const STEP_ROUTES: Record<WizardStep, string> = {
  channel: WEB_ROUTES.CLIENT.CREDIT.CHANNEL,
  basic_data: WEB_ROUTES.CLIENT.CREDIT.BASIC_DATA,
  supplementary_data: WEB_ROUTES.CLIENT.CREDIT.SUPPLEMENTARY_DATA,
  simulation: WEB_ROUTES.CLIENT.CREDIT.SIMULATION,
  summary: WEB_ROUTES.CLIENT.CREDIT.SUMMARY,
};
