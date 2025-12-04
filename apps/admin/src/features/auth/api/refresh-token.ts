import { RefreshTokenResponse } from "../types/refresh-token.response";

export async function refreshTokens(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/v1/auth/refresh-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    },
  );

  if (!response.ok) {
    throw new Error("Refresh failed");
  }

  return response.json();
}
