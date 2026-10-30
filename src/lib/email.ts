import { Resend } from "resend";

export interface SendReceiptEmailInput {
  to: string;
  ticketId: string;
  title: string;
  category: string;
  priority: string;
  priorityScore: number;
  status: string;
  street?: string;
  address?: string;
  summary?: string;
  citizenName?: string;
}

export interface SendEmailResult {
  success: boolean;
  delivered: boolean;
  simulated: boolean;
  messageId?: string;
  message: string;
  error?: string;
}

/**
 * Dispatches an email receipt to the citizen containing their ticket details.
 * Falls back gracefully if RESEND_API_KEY is unset so form submissions never fail.
 */
export async function sendReportReceiptEmail(
  input: SendReceiptEmailInput
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  // 1. Graceful fallback when API key is missing or placeholder
  if (!apiKey || apiKey.trim() === "" || apiKey === "placeholder_key") {
    console.info(
      `[CivicPulse Email] RESEND_API_KEY is not configured. Simulating email receipt dispatch to ${input.to} for ticket ${input.ticketId}.`
    );
    return {
      success: true,
      delivered: false,
      simulated: true,
      message: `Email receipt simulated successfully for ticket ${input.ticketId} (RESEND_API_KEY omitted).`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "CivicPulse <onboarding@resend.dev>";

    const priorityBadgeColor =
      input.priority === "Critical"
        ? "#f43f5e"
        : input.priority === "High"
        ? "#f59e0b"
        : input.priority === "Medium"
        ? "#38bdf8"
        : "#10b981";

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>CivicPulse Incident Receipt - ${input.ticketId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080c14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #080c14; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background: #0f172a; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);" cellpadding="0" cellspacing="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #0284c7 0%, #4338ca 100%);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">CivicPulse</h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #e0f2fe;">Autonomous AI Civic Complaint &amp; Action Platform</p>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 4px 10px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 9999px; font-size: 11px; font-family: monospace; font-weight: bold; color: #38bdf8;">
                      ${input.ticketId}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #cbd5e1; line-height: 1.5;">
                Hello${input.citizenName ? ` <strong>${input.citizenName}</strong>` : ""},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                Thank you for contributing to safer, more responsive civic infrastructure. Your incident complaint has been logged and triaged by the <strong>CivicPulse AI Emergency Engine</strong>.
              </p>

              <!-- Ticket Card Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #1e293b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #38bdf8; margin-bottom: 6px;">
                      ${input.category}
                    </div>
                    <h2 style="margin: 0 0 12px 0; font-size: 17px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                      ${input.title}
                    </h2>
                    ${input.address ? `<p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8;">📍 ${input.address}</p>` : ""}

                    <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 14px; margin-top: 10px;">
                      <tr>
                        <td width="50%">
                          <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">AI Threat Assessment</div>
                          <div style="font-size: 14px; font-weight: 800; color: ${priorityBadgeColor};">
                            ${input.priority} (${input.priorityScore}/100)
                          </div>
                        </td>
                        <td width="50%">
                          <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">Current Status</div>
                          <div style="font-size: 14px; font-weight: 700; color: #38bdf8;">
                            ${input.status}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${
                input.summary
                  ? `
              <div style="padding: 16px; background: rgba(56, 189, 248, 0.05); border-left: 3px solid #38bdf8; border-radius: 4px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #38bdf8; margin-bottom: 4px;">AI Triage Summary</div>
                <div style="font-size: 13px; color: #e2e8f0; line-height: 1.5;">${input.summary}</div>
              </div>`
                  : ""
              }

              <p style="margin: 0 0 20px 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                You can track live dispatch updates, crew assignments, and resolution photos in real time using your unique ticket ID.
              </p>

              <div style="text-align: center; margin: 28px 0 10px 0;">
                <span style="display: inline-block; padding: 12px 28px; background: #0284c7; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: bold; letter-spacing: 0.2px;">
                  Tracking ID: ${input.ticketId}
                </span>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background: #0b1120; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                Automated notification from CivicPulse Municipal Command Grid.<br>
                PromptWars × ASTRA Hackathon • Next.js &amp; Resend Integration
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

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [input.to],
      subject: `[CivicPulse] Incident Logged: ${input.ticketId} - ${input.title}`,
      html: htmlContent,
    });

    if (error) {
      console.warn("[CivicPulse Email] Resend delivery notice:", error.message);
      return {
        success: true,
        delivered: false,
        simulated: true,
        message: `Email delivery queued/simulated: ${error.message}`,
        error: error.message,
      };
    }

    return {
      success: true,
      delivered: true,
      simulated: false,
      messageId: data?.id,
      message: `Email receipt dispatched to ${input.to} via Resend.`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to dispatch email.";
    console.warn("[CivicPulse Email] Dispatch caught error (falling back gracefully):", errorMsg);
    // Never fail the caller
    return {
      success: true,
      delivered: false,
      simulated: true,
      message: "Email dispatch gracefully bypassed without error.",
      error: errorMsg,
    };
  }
}
