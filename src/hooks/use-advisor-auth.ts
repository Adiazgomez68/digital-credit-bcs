import { login, logout, refresh } from "@/services/advisor-auth-service";
import { useMutation } from "@tanstack/react-query";

export function useAdvisorLogin() {
  return useMutation({
    mutationKey: ["advisor-login"],
    mutationFn: login,
  });
}

export function useAdvisorRefresh() {
  return useMutation({
    mutationKey: ["advisor-refresh"],
    mutationFn: refresh,
  });
}

export function useAdvisorLogout() {
  return useMutation({
    mutationKey: ["advisor-logout"],
    mutationFn: logout,
  });
}
