import { AuthResponse } from "../types/auth.response";

export async function refreshTokens(
  refreshToken: string,
): Promise<AuthResponse> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/auth/refresh-token`,
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
