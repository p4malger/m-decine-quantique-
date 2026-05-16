import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/* ─── GET /api/submissions — List all submissions ─── */
export async function GET() {
  try {
    const submissions = await db.submission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("GET /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

/* ─── POST /api/submissions — Create a new submission ─── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, profession, email, phone, message } = body;

    if (!name || !profession || !phone) {
      return NextResponse.json(
        { error: "Name, profession and phone are required" },
        { status: 400 }
      );
    }

    const submission = await db.submission.create({
      data: {
        name,
        profession,
        email: email || "",
        phone,
        message: message || "",
      },
    });

    // ─── Send WhatsApp notification to organizer (non-blocking) ───
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
      fetch(`${baseUrl}/api/notify-organizer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, profession, email, phone, message }),
      }).catch((err) => {
        console.error("[Submissions] WhatsApp notification failed:", err);
      });
    } catch (notifyErr) {
      // Non-critical — don't block the submission
      console.error("[Submissions] WhatsApp notification error:", notifyErr);
    }

    // ─── Send confirmation email to participant (non-blocking) ───
    if (email) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
        fetch(`${baseUrl}/api/send-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, profession }),
        }).catch((err) => {
          console.error("[Submissions] Confirmation email failed:", err);
        });
      } catch (emailErr) {
        console.error("[Submissions] Confirmation email error:", emailErr);
      }
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("POST /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}

/* ─── DELETE /api/submissions — Delete by id or clear all ─── */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await db.submission.delete({ where: { id } });
      return NextResponse.json({ success: true, deleted: id });
    } else {
      await db.submission.deleteMany();
      return NextResponse.json({ success: true, deletedAll: true });
    }
  } catch (error) {
    console.error("DELETE /api/submissions error:", error);
    return NextResponse.json(
      { error: "Failed to delete submission(s)" },
      { status: 500 }
    );
  }
}
