import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, profession } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    // If SMTP is not configured, log and return success gracefully
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log(
        `[Email Confirmation] SMTP not configured. Would send to: ${email}`
      );
      console.log(`  Name: ${name}, Profession: ${profession}, Phone: ${phone}`);
      return NextResponse.json({
        success: true,
        message: "SMTP not configured — email logged to console only",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const htmlBody = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation d'inscription — Go Healthy Academy</title>
</head>
<body style="margin:0;padding:0;background-color:#02120D;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#02120D;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">

          <!-- Header with gold accent -->
          <tr>
            <td style="background:linear-gradient(135deg,#D4A017,#F5C842);padding:32px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <h1 style="margin:0;color:#000;font-size:24px;font-weight:700;letter-spacing:2px;">GO HEALTHY ACADEMY</h1>
              <p style="margin:8px 0 0;color:#000;font-size:14px;opacity:0.8;">Formation Internationale en Algérie</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#0A1F1A;padding:40px;border-left:1px solid rgba(212,160,23,0.15);border-right:1px solid rgba(212,160,23,0.15);">
              <h2 style="margin:0 0 8px;color:#F5C842;font-size:22px;font-weight:400;">Confirmation d'inscription</h2>
              <p style="margin:0 0 24px;color:#94A3B8;font-size:14px;">Merci pour votre inscription, ${name} !</p>

              <p style="color:#CBD5E1;font-size:15px;line-height:1.7;margin:0 0 20px;">
                Nous avons bien reçu votre demande d'inscription à la conférence
                <strong style="color:#F5C842;">Go Healthy Academy</strong>.
                Votre place est désormais réservée. Vous recevrez bientôt plus de détails par WhatsApp.
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

              <!-- Registration Summary -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:24px;">
                    <h3 style="margin:0 0 16px;color:#F5C842;font-size:16px;letter-spacing:1px;">VOTRE INSCRIPTION</h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;width:120px;">👤 Nom</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">${name}</td>
                      </tr>
                      ${profession ? `<tr><td style="padding:6px 0;color:#94A3B8;font-size:13px;">💼 Profession</td><td style="padding:6px 0;color:#E2E8F0;font-size:14px;">${profession}</td></tr>` : ""}
                      <tr>
                        <td style="padding:6px 0;color:#94A3B8;font-size:13px;">📧 Email</td>
                        <td style="padding:6px 0;color:#E2E8F0;font-size:14px;">${email}</td>
                      </tr>
                      ${phone ? `<tr><td style="padding:6px 0;color:#94A3B8;font-size:13px;">📱 Téléphone</td><td style="padding:6px 0;color:#E2E8F0;font-size:14px;">${phone}</td></tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <p style="color:#CBD5E1;font-size:14px;line-height:1.7;margin:24px 0 0;">
                Pour toute question, n'hésitez pas à nous contacter via WhatsApp ou par email à
                <a href="mailto:contact@gohealthyacademy.com" style="color:#F5C842;text-decoration:none;">contact@gohealthyacademy.com</a>.
              </p>

              <p style="color:#CBD5E1;font-size:14px;line-height:1.7;margin:16px 0 0;">
                Nous nous réjouissons de vous accueillir à Alger !
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

    await transporter.sendMail({
      from: `"Go Healthy Academy" <${smtpUser}>`,
      to: email,
      subject: "✅ Confirmation d'inscription — Go Healthy Academy",
      html: htmlBody,
    });

    return NextResponse.json({ success: true, message: "Confirmation email sent" });
  } catch (error) {
    console.error("[Email Confirmation] Error:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}
