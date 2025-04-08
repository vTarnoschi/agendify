import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import jsonwebtoken from "jsonwebtoken";

import { JWTPayload } from "~/types/auth";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function generateToken(payload: object) {
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return null;
  }
}

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
