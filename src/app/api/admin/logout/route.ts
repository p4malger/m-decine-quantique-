import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/admin-auth";

/**
 * POST /api/admin/logout
 *
 * Clears the admin auth cookie.
 */
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  return clearAdminCookie(response);
}
