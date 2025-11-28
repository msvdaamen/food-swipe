import { api } from "@/lib/api-client";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export async function refreshTokens(refreshToken: string): Promise<AuthResponse> {
  const response = await api.fetch(`/auth/refresh-tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Refresh failed');
  }

  return response.json();
}
