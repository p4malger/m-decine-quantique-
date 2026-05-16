import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, profession, email, phone, message } = body;

    if (!name || !profession || !phone) {
      return NextResponse.json(
        { error: "Les champs nom, profession et téléphone sont obligatoires." },
        { status: 400 }
      );
    }

    console.log("[SUBMISSION] Attempting to save:", { name, profession, email, phone });

    const submission = await db.submission.create({
      data: {
        name,
        profession,
        email: email || null,
        phone,
        message: message || null,
      },
    });

    console.log("[SUBMISSION] Saved successfully:", submission.id);

    // Try to send confirmation email and notify organizer (non-blocking)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
      if (baseUrl) {
        fetch(`${baseUrl}/api/send-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        }).catch(() => {});

        fetch(`${baseUrl}/api/notify-organizer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submission),
        }).catch(() => {});
      }
    } catch {
      // Non-blocking: don't fail the registration if notifications fail
    }

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error) {
    console.error("[SUBMISSION] Error creating submission:", error);
    const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'inscription.";
    return NextResponse.json(
      { error: "Erreur lors de l'inscription. Veuillez réessayer.", details: errorMessage },
      { status: 500 }
    );
  }
}
