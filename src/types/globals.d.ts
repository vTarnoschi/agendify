export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "client" | "provider";
    };
  }
}
