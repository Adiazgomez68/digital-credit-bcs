import { ApiError } from "@/lib/http-client";
import { login, logout, refresh } from "@/services/advisor-auth-service";
import { describe, expect, it } from "vitest";

describe("login", () => {
  it("returns a session with a token, refreshToken and expiresIn on valid credentials", async () => {
    const result = await login({
      email: "asesor.financiero@groupbcs.com",
      password: "digitalcredit2026",
    });

    expect(result.token).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.expiresIn).toBeGreaterThan(0);
  });

  it("rejects with a 401 ApiError on invalid credentials", async () => {
    const promise = login({
      email: "asesor.financiero@groupbcs.com",
      password: "wrong-password",
    });

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({ status: 401 });
  });
});

describe("refresh", () => {
  it("issues a new token and rotates the refresh token", async () => {
    const session = await login({
      email: "asesor.financiero@groupbcs.com",
      password: "digitalcredit2026",
    });

    const refreshed = await refresh(session.refreshToken);

    expect(refreshed.token).toBeTruthy();
    expect(refreshed.refreshToken).not.toBe(session.refreshToken);
  });

  it("rejects a refresh token that was already used (rotation)", async () => {
    const session = await login({
      email: "asesor.financiero@groupbcs.com",
      password: "digitalcredit2026",
    });
    await refresh(session.refreshToken);

    await expect(refresh(session.refreshToken)).rejects.toMatchObject({
      status: 401,
    });
  });

  it("rejects a refresh token that never existed", async () => {
    await expect(refresh("not-a-real-token")).rejects.toMatchObject({
      status: 401,
    });
  });
});

describe("logout", () => {
  it("clears the session", async () => {
    const result = await logout();

    expect(result.message).toBeTruthy();
  });
});
