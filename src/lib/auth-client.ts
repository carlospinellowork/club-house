import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      hasOnboarded: {
        type: "boolean",
      },
      favoriteTeamName: {
        type: "string",
      },
      bio: {
        type: "string",
      },
      location: {
        type: "string",
      },
      outlet: {
        type: "string",
      },
    },
  },
});