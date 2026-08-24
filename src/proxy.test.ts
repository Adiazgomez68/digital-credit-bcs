import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

function buildRequest(pathname: string, cookie?: string) {
  return new NextRequest(new URL(pathname, "http://localhost:3000"), {
    headers: cookie ? { cookie } : undefined,
  });
}

describe("proxy", () => {
  it("redirects to the login page when there is no session cookie", () => {
    const response = proxy(buildRequest("/advisor-portal/applications"));

    expect(response?.status).toBe(307);
    expect(response?.headers.get("location")).toContain("/advisor-portal/auth");
  });

  it("lets the login page itself through even without a cookie", () => {
    const response = proxy(buildRequest("/advisor-portal/auth"));

    expect(response?.headers.get("location")).toBeNull();
  });

  it("lets the request through when a session cookie is present", () => {
    const response = proxy(
      buildRequest(
        "/advisor-portal/applications",
        "bcs_advisor_session=abc123",
      ),
    );

    expect(response).toBeUndefined();
  });
});
