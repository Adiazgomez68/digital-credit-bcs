import { HttpResponse } from "msw";
import { sessionStore } from "./session-store";

const SESSION_COOKIE = "bcs_advisor_session";
const COOKIE_ATTRIBUTES = "Path=/admin-portal; HttpOnly; Secure; SameSite=Lax";

function buildSessionCookieHeader(token: string): Headers {
  const headers = new Headers();
  headers.set("Set-Cookie", `${SESSION_COOKIE}=${token}; ${COOKIE_ATTRIBUTES}`);
  return headers;
}

export async function loginResolver({ request }: { request: Request }) {
  const payload = (await request.json()) as { email: string; password: string };

  if (
    payload.email === process.env.NEXT_PUBLIC_EMAIL_AUTH &&
    payload.password === process.env.NEXT_PUBLIC_PASSWORD_AUTH
  ) {
    const token = crypto.randomUUID();
    const refreshToken = sessionStore.issueRefreshToken();

    return HttpResponse.json(
      { token, refreshToken },
      { status: 200, headers: buildSessionCookieHeader(token) },
    );
  }

  return HttpResponse.json(
    { message: "Usuario o contraseña incorrectos" },
    { status: 401 },
  );
}

export async function refreshResolver({ request }: { request: Request }) {
  const payload = (await request.json()) as { refreshToken: string };

  if (
    payload.refreshToken &&
    sessionStore.consumeRefreshToken(payload.refreshToken)
  ) {
    const token = crypto.randomUUID();
    const refreshToken = sessionStore.issueRefreshToken();

    return HttpResponse.json(
      { token, refreshToken },
      { status: 200, headers: buildSessionCookieHeader(token) },
    );
  }

  return HttpResponse.json(
    { message: "Refresh token inválido" },
    { status: 401 },
  );
}

export async function logoutResolver() {
  const headers = new Headers();
  headers.set(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/admin-portal; Max-Age=0; HttpOnly; Secure; SameSite=Lax`,
  );

  return HttpResponse.json(
    { message: "Logout exitoso" },
    { status: 200, headers },
  );
}
