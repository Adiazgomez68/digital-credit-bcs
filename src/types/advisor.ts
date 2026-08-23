export interface AdvisorSessionPayload {
  email: string;
  password: string;
}

export interface AdvisorSessionResponse {
  token: string;
  refreshToken: string;
}
