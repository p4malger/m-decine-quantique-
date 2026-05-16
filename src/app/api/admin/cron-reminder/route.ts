import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

/**
 * GET /api/admin/cron-reminder
 *
 * Called by an external cron service to auto-send reminder emails.
 * Uses a secret key for security instead of admin cookie.
 * Supports ?key=CRON_SECRET query parameter.
 *
 * Sends reminders based on days before the event:
 * - 7 days before (May 28, 2026)
 * - 3 days before (June 1, 2026)
 * - 1 day before (June 3, 2026)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const cronSecret = process.env.CRON_SECRET || "gha_cron_2026";

    if (key !== cronSecret) {
      return NextResponse.json({ error: "Invalid cron key" }, { status: 401 });
    }

    // Event date: June 4, 2026
    const eventDate = new Date("2026-06-04T09:00:00");
    const now = new Date();
    const daysUntilEvent = Math.ceil(
      (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Only send on specific days before the event
    const shouldSend = [7, 3, 1].includes(daysUntilEvent);

    if (!shouldSend) {
      return NextResponse.json({
        success: true,
        sent: false,
        daysUntilEvent,
        message: `No reminder scheduled today (${daysUntilEvent} days until event). Reminders are sent at 7, 3, and 1 day(s) before.`,
      });
    }

    const submissions = await db.submission.findMany({
      where: { email: { not: "" } },
    });

    if (submissions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: false,
        daysUntilEvent,
        message: "No participants with email addresses",
      });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log(
        `[Cron Reminder] SMTP not configured. Would send ${submissions.length} reminders (${daysUntilEvent} days before event)`
      );
      return NextResponse.json({
        success: true,
        sent: false,
        daysUntilEvent,
        total: submissions.length,
        method: "console_log",
        message: `SMTP not configured — ${submissions.length} reminders logged (${daysUntilEvent} days before)`,
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    const urgencyLabel =
      daysUntilEvent === 1
        ? "DERNIER JOUR"
        : daysUntilEvent === 3
          ? "3 JOURS RESTANTS"
          : "7 JOURS RESTANTS";

    let sent = 0;
    let failed = 0;

    for (const submission of submissions) {
      try {
        const htmlBody = buildCronReminderHtml(
          submission.name,
          daysUntilEvent,
          urgencyLabel
        );

        await transporter.sendMail({
          from: `"Go Healthy Academy" <${smtpUser}>`,
          to: submission.email,
          subject: `🔔 Rappel J-${daysUntilEvent} — Go Healthy Academy, 4-6 Juin 2026`,
          html: htmlBody,
        });
        sent++;
      } catch (emailErr) {
        console.error(
          `[Cron Reminder] Failed for ${submission.email}:`,
          emailErr
        );
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent: true,
      daysUntilEvent,
      urgencyLabel,
      sentCount: sent,
      failedCount: failed,
      total: submissions.length,
      message: `J-${daysUntilEvent} reminders sent: ${sent}/${submissions.length}`,
    });
  } catch (error) {
    console.error("[Cron Reminder] Error:", error);
    return NextResponse.json(
      { error: "Cron reminder failed" },
      { status: 500 }
    );
  }
}

/**
 * Build the HTML email body for the cron-based reminder email
 */
function buildCronReminderHtml(
  name: string,
  daysUntilEvent: number,
  urgencyLabel: string
): string {
  const urgencyColor =
    daysUntilEvent === 1
      ? "#EF4444"
      : daysUntilEvent === 3
        ? "#F59E0B"
        : "#10B981";

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rappel J-${daysUntilEvent} — Go Healthy Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#02120D;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#02120D;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">

          <!-- Header with urgency -->
          <tr>
            <td style="background:linear-gradient(135deg,#D4A017,#F5C842);padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <h1 style="margin:0;color:#000;font-size:24px;font-weight:700;letter-spacing:2px;">GO HEALTHY ACADEMY</h1>
              <p style="margin:8px 0 0;color:#000;font-size:16px;font-weight:600;">⏰ ${urgencyLabel}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#0A1F1A;padding:40px;border-left:1px solid rgba(212,160,23,0.15);border-right:1px solid rgba(212,160,23,0.15);">
              <h2 style="margin:0 0 8px;color:#F5C842;font-size:22px;font-weight:400;">Plus que ${daysUntilEvent} jour${daysUntilEvent > 1 ? "s" : ""} !</h2>
              <p style="margin:0 0 24px;color:#94A3B8;font-size:14px;">Bonjour ${name},</p>

              <p style="color:#CBD5E1;font-size:15px;line-height:1.7;margin:0 0 20px;">
                La conférence <strong style="color:#F5C842;">Go Healthy Academy</strong> est dans
                <span style="color:${urgencyColor};font-weight:600;">${daysUntilEvent} jour${daysUntilEvent > 1 ? "s" : ""}</span> !
                Voici un dernier rappel avec tous les détails nécessaires.
              </p>

              <!-- Urgency Banner -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,${urgencyColor}22,${urgencyColor}08);border:1px solid ${urgencyColor}44;border-radius:12px;padding:20px;text-align:center;">
                    <p style="margin:0;color:${urgencyColor};font-size:28px;font-weight:700;">J-${daysUntilEvent}</p>
                    <p style="margin:4px 0 0;color:#94A3B8;font-size:13px;">avant la conférence</p>
                  </td>
                </tr>
              </table>

              <!-- Event Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(212,160,23,0.1),rgba(212,160,23,0.03));border:1px solid rgba(212,160,23,0.2);border-radius:12px;padding:24px;">
                    <h3 style="margin:0 0 16px;color:#F5C842;font-size:16px;letter-spacing:1px;">DÉTAILS DE L'ÉVÉNEMENT</h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;width:120px;">📅 Dates</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">4, 5 &amp; 6 Juin 2026</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;">📍 Lieu</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">Hôtel Le Lido, Alger, Algérie</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;">🕘 Horaires</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">08:30 — 18:30</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#CBD5E1;font-size:14px;line-height:1.7;margin:0;">
                Pour toute question, contactez-nous via WhatsApp ou par email à
                <a href="mailto:contact@gohealthyacademy.com" style="color:#F5C842;text-decoration:none;">contact@gohealthyacademy.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#050F0C;padding:24px 40px;border-radius:0 0 16px 16px;border-left:1px solid rgba(212,160,23,0.15);border-right:1px solid rgba(212,160,23,0.15);border-bottom:1px solid rgba(212,160,23,0.15);text-align:center;">
              <p style="margin:0;color:#64748B;font-size:12px;">&copy; ${new Date().getFullYear()} Go Healthy Academy. Tous droits réservés.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
