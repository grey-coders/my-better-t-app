import { createAuthClient } from "better-auth/react";

// Get environment variable with fallback
const baseURL = (import.meta as any).env.VITE_SERVER_URL || 
                "http://localhost:3000"; 

export const authClient = createAuthClient({
  baseURL,
});

