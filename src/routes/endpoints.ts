export const ENDPOINTS = {
  APPLICATIONS: {
    LIST: "/applications",
    CREATE: "/applications",
    DETAIL: (id: string) => `/applications/${id}`,
    UPDATE: (id: string) => `/applications/${id}`,
    SUBMIT_FOR_REVIEW: (id: string) => `/applications/${id}/submit-for-review`,
    SIMULATE_OFFER: (id: string) => `/applications/${id}/simulate-offer`,
    ACCEPT_ALTERNATIVE_OFFER: (id: string) =>
      `/applications/${id}/accept-alternative-offer`,
    FINALIZE: (id: string) => `/applications/${id}/finalize`,
    ABANDON: (id: string) => `/applications/${id}/abandon`,
    EVENTS: (id: string) => `/applications/${id}/events`,
  },

  ADVISOR_AUTH: {
    LOGIN: "/advisor-auth/login",
    REFRESH: "/advisor-auth/refresh",
    LOGOUT: "/advisor-auth/logout",
  },
} as const;
