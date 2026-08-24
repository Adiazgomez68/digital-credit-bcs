import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.mts"],
    env: {
      NEXT_PUBLIC_API_URL: "/api",
      NEXT_PUBLIC_API_MOCKING: "disabled",
      NEXT_PUBLIC_EMAIL_AUTH: "asesor.financiero@groupbcs.com",
      NEXT_PUBLIC_PASSWORD_AUTH: "digitalcredit2026",
    },
  },
});
