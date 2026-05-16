import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

/**
 * GET /api/admin/submissions
 *
 * Returns all submissions (admin-only).
 * Supports search query parameter for filtering.
 */
export async function GET(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const submissions = await db.submission.findMany({
      orderBy: { createdAt: "desc" },
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { profession: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
            ],
          }
        : undefined,
    });

    // Compute stats
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const total = submissions.length;
    const today = submissions.filter(
      (s) => new Date(s.createdAt) >= startOfToday
    ).length;
    const thisWeek = submissions.filter(
      (s) => new Date(s.createdAt) >= startOfWeek
    ).length;

    return NextResponse.json({
      submissions,
      stats: { total, today, thisWeek },
    });
  } catch (error) {
    console.error("[Admin Submissions] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/submissions
 *
 * Deletes a single submission by id (admin-only).
 */
export async function DELETE(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Submission id is required" },
        { status: 400 }
      );
    }

    await db.submission.delete({ where: { id } });
    return NextResponse.json({ success: true, deleted: id });
  } catch (error) {
    console.error("[Admin Submissions DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
