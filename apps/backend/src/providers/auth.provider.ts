import { createClerkClient } from "@clerk/backend";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

const permittedOrigins = [
  "http://localhost:5137",
  "https://food-swipe.app",
  "http://admin.food-swipe.app",
]; // Replace with your permitted origins

export const verifyClerkToken = async (req: Request) => {
  return await clerkClient.authenticateRequest(req, {
    jwtKey: process.env.CLERK_JWT_KEY,
    authorizedParties: permittedOrigins,
  });
};

export default clerkClient;
