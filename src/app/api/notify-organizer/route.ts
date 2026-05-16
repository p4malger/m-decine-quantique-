import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/notify-organizer
 *
 * Sends a WhatsApp notification to the organizer about a new registration.
 * - If Twilio credentials are configured, sends via Twilio WhatsApp API.
 * - Otherwise, logs the notification to console (graceful fallback).
 */
export async function POST(request: NextRequest) {
  try {
    const { name, profession, email, phone, message } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Format the WhatsApp message
    const organizerNumber = "213657867444"; // Default organizer WhatsApp number
    const timestamp = new Date().toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const whatsappMessage = [
      `🆕 *Nouvelle inscription — Go Healthy Academy*`,
      ``,
      `👤 *Nom:* ${name}`,
      `💼 *Profession:* ${profession || "Non précisé"}`,
      `📧 *Email:* ${email || "Non précisé"}`,
      `📱 *Téléphone:* ${phone || "Non précisé"}`,
      `💬 *Message:* ${message || "Aucun"}`,
      ``,
      `📅 *Date d'inscription:* ${timestamp}`,
    ].join("\n");

    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_WHATSAPP_FROM;

    // If Twilio credentials are configured, send via Twilio WhatsApp API
    if (twilioSid && twilioAuth && twilioFrom) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;

        const params = new URLSearchParams();
        params.append("From", `whatsapp:${twilioFrom}`);
        params.append("To", `whatsapp:+${organizerNumber}`);
        params.append("Body", whatsappMessage);

        const twilioResponse = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        });

        if (!twilioResponse.ok) {
          const errText = await twilioResponse.text();
          console.error("[WhatsApp Notification] Twilio API error:", errText);
          // Fall through to log
        } else {
          console.log("[WhatsApp Notification] Sent via Twilio to:", `+${organizerNumber}`);
          return NextResponse.json({
            success: true,
            method: "twilio",
            message: "WhatsApp notification sent via Twilio",
          });
        }
      } catch (twilioErr) {
        console.error("[WhatsApp Notification] Twilio request failed:", twilioErr);
        // Fall through to log
      }
    }

    // Check WhatsApp Business API credentials
    const whatsappToken = process.env.WHATSAPP_API_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID;

    if (whatsappToken && whatsappPhoneId) {
      try {
        const waResponse = await fetch(
          `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${whatsappToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: `+${organizerNumber}`,
              type: "text",
              text: { body: whatsappMessage },
            }),
          }
        );

        if (!waResponse.ok) {
          const errText = await waResponse.text();
          console.error("[WhatsApp Notification] WA Business API error:", errText);
          // Fall through to log
        } else {
          console.log("[WhatsApp Notification] Sent via WA Business API to:", `+${organizerNumber}`);
          return NextResponse.json({
            success: true,
            method: "whatsapp_business_api",
            message: "WhatsApp notification sent via Business API",
          });
        }
      } catch (waErr) {
        console.error("[WhatsApp Notification] WA Business API request failed:", waErr);
        // Fall through to log
      }
    }

    // Fallback: log to console
    console.log("═══════════════════════════════════════════");
    console.log("[WhatsApp Notification] No API configured — logging to console");
    console.log(`  To: +${organizerNumber}`);
    console.log(whatsappMessage);
    console.log("═══════════════════════════════════════════");

    return NextResponse.json({
      success: true,
      method: "console_log",
      message: "WhatsApp notification logged to console (no API configured)",
    });
  } catch (error) {
    console.error("[WhatsApp Notification] Error:", error);
    return NextResponse.json(
      { error: "Failed to send WhatsApp notification" },
      { status: 500 }
    );
  }
}
