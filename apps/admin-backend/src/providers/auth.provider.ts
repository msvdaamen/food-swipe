import { createClerkClient } from "@clerk/backend";



export class AuthProvider {
  private clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
  permittedOrigins = [
    "http://localhost:5137",
    "http://admin.food-swipe.app",
  ];

  async verifyToken(req: Request): Promise<boolean> {
    try {
      const response = await this.clerkClient.authenticateRequest(req);
      return response.isAuthenticated;
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  }
}

export const authProvider = new AuthProvider();
