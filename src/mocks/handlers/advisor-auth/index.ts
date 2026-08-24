import { http } from "msw";
import { loginResolver, logoutResolver, refreshResolver } from "./resolvers";

export const advisorAuthHandlers = [
  http.post("/api/advisor-auth/login", loginResolver),
  http.post("/api/advisor-auth/refresh", refreshResolver),
  http.post("/api/advisor-auth/logout", logoutResolver),
];
