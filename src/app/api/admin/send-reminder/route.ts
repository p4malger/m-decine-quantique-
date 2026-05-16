import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

/**
 * POST /api/admin/send-reminder
 *
 * Sends a reminder email to ALL registered participants who have an email.
 * Admin-only endpoint.
 */
export async function POST() {
  try {
    const isAuthorized = await verifyAdmin();
    if (!isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissions = await db.submission.findMany({
      where: { email: { not: "" } },
    });

    if (submissions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "No participants with email addresses found",
      });
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // If SMTP is not configured, log and return gracefully
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log(
        `[Reminder Email] SMTP not configured. Would send to ${submissions.length} participants:`
      );
      submissions.forEach((s) => {
        console.log(`  - ${s.name} <${s.email}>`);
      });

      return NextResponse.json({
        success: true,
        sent: 0,
        total: submissions.length,
        method: "console_log",
        message: `SMTP not configured — ${submissions.length} reminder emails logged to console`,
      });
    }

    // Send emails via SMTP
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    let sent = 0;
    let failed = 0;

    for (const submission of submissions) {
      try {
        const htmlBody = buildReminderEmailHtml(submission.name);

        await transporter.sendMail({
          from: `"Go Healthy Academy" <${smtpUser}>`,
          to: submission.email,
          subject: "🔔 Rappel — Go Healthy Academy, 4-6 Juin 2026",
          html: htmlBody,
        });
        sent++;
      } catch (emailErr) {
        console.error(
          `[Reminder Email] Failed to send to ${submission.email}:`,
          emailErr
        );
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: submissions.length,
      message: `Reminder emails sent: ${sent}/${submissions.length}`,
    });
  } catch (error) {
    console.error("[Reminder Email] Error:", error);
    return NextResponse.json(
      { error: "Failed to send reminder emails" },
      { status: 500 }
    );
  }
}

/**
 * Build the HTML email body for the reminder email
 */
function buildReminderEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rappel — Go Healthy Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#02120D;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#02120D;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#D4A017,#F5C842);padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <h1 style="margin:0;color:#000;font-size:24px;font-weight:700;letter-spacing:2px;">GO HEALTHY ACADEMY</h1>
              <p style="margin:8px 0 0;color:#000;font-size:14px;opacity:0.8;">Rappel — Conférence Internationale</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#0A1F1A;padding:40px;border-left:1px solid rgba(212,160,23,0.15);border-right:1px solid rgba(212,160,23,0.15);">
              <h2 style="margin:0 0 8px;color:#F5C842;font-size:22px;font-weight:400;">🔔 Rappel important</h2>
              <p style="margin:0 0 24px;color:#94A3B8;font-size:14px;">Bonjour ${name},</p>

              <p style="color:#CBD5E1;font-size:15px;line-height:1.7;margin:0 0 20px;">
                La conférence <strong style="color:#F5C842;">Go Healthy Academy</strong> approche à grands pas !
                Nous vous rappelons les détails de l'événement et vous recommandons de préparer votre venue.
              </p>

              <!-- Event Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td style="background:linear-gradient(135deg,rgba(212,160,23,0.1),rgba(212,160,23,0.03));border:1px solid rgba(212,160,23,0.2);border-radius:12px;padding:24px;">
                    <h3 style="margin:0 0 16px;color:#F5C842;font-size:16px;letter-spacing:1px;">DÉTAILS DE L'ÉVÉNEMENT</h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;width:120px;vertical-align:top;">📅 Dates</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">4, 5 &amp; 6 Juin 2026</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;vertical-align:top;">📍 Lieu</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">Hôtel Le Lido, Alger, Algérie</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;vertical-align:top;">🕘 Horaires</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">08:30 — 18:30 (3 jours)</td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;vertical-align:top;">🎓 Certificat</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">Attestation de participation officielle</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Checklist -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;">
                    <h3 style="margin:0 0 16px;color:#F5C842;font-size:16px;letter-spacing:1px;">PRÉPAREZ VOTRE VENUE</h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr><td style="padding:5px 0;color:#E2E8F0;font-size:14px;">✅ Confirmez votre présence à l'accueil dès 08:30</td></tr>
                      <tr><td style="padding:5px 0;color:#E2E8F0;font-size:14px;">✅ Apportez votre pièce d'identité</td></tr>
                      <tr><td style="padding:5px 0;color:#E2E8F0;font-size:14px;">✅ Préparez vos questions pour les sessions Q&amp;R</td></tr>
                      <tr><td style="padding:5px 0;color:#E2E8F0;font-size:14px;">✅ Rejoignez le groupe WhatsApp pour les mises à jour</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#CBD5E1;font-size:14px;line-height:1.7;margin:24px 0 0;">
                Pour toute question, contactez-nous via WhatsApp ou par email à
                <a href="mailto:contact@gohealthyacademy.com" style="color:#F5C842;text-decoration:none;">contact@gohealthyacademy.com</a>.
              </p>

              <p style="color:#CBD5E1;font-size:14px;line-height:1.7;margin:16px 0 0;">
                Au plaisir de vous retrouver à Alger !
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#050F0C;padding:24px 40px;border-radius:0 0 16px 16px;border-left:1px solid rgba(212,160,23,0.15);border-right:1px solid rgba(212,160,23,0.15);border-bottom:1px solid rgba(212,160,23,0.15);text-align:center;">
              <p style="margin:0;color:#64748B;font-size:12px;">
                &copy; ${new Date().getFullYear()} Go Healthy Academy. Tous droits réservés.
              </p>
              <p style="margin:8px 0 0;color:#475569;font-size:11px;">
                Application pratique de la médecine quantique et nano médecine
              </p>
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
