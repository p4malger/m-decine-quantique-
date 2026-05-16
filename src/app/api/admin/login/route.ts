import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin-auth";

/**
 * POST /api/admin/login
 *
 * Authenticates the admin with a password and sets an HTTP-only cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const adminPassword = process.env.ADMIN_PASSWORD || "GoHealthy2026!";

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
    });

    return setAdminCookie(response);
  } catch (error) {
    console.error("[Admin Login] Error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
