import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_COOKIE_NAME = "gha_admin_token";
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || "GoHealthy2026!";

/**
 * Generate a signed token from the admin password
 */
function generateToken(): string {
  const hash = crypto.createHash("sha256").update(TOKEN_SECRET).digest("hex");
  return hash;
}

/**
 * Verify that the request has a valid admin cookie
 */
export async function verifyAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return token === generateToken();
}

/**
 * Set the admin auth cookie on a response
 */
export function setAdminCookie(response: Response): Response {
  const token = generateToken();
  response.headers.append(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
  );
  return response;
}

/**
 * Clear the admin auth cookie on a response
 */
export function clearAdminCookie(response: Response): Response {
  response.headers.append(
    "Set-Cookie",
    `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
  );
  return response;
}
