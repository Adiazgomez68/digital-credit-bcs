// In-memory store of valid refresh tokens for the simulated advisor session.
const validRefreshTokens = new Set<string>();

// Issues a new refresh token and remembers it as valid.
function issueRefreshToken(): string {
  const refreshToken = crypto.randomUUID();
  validRefreshTokens.add(refreshToken);
  return refreshToken;
}

// Consumes a refresh token: valid only once (rotates on use).
function consumeRefreshToken(refreshToken: string): boolean {
  const isValid = validRefreshTokens.has(refreshToken);
  if (isValid) validRefreshTokens.delete(refreshToken);
  return isValid;
}

export const sessionStore = {
  issueRefreshToken,
  consumeRefreshToken,
};
