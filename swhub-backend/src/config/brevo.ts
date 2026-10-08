import { BrevoClient } from "@getbrevo/brevo";

export const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY as string,
});

// ========================================
// OTP EMAIL
// ========================================

export async function sendOtpEmail(
  email: string,
  name: string,
  otp: string
) {
  try {
    console.log("📧 Sending OTP email...");
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("OTP:", otp);

    const result =
      await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: "SW Hub",
          email: process.env.BREVO_SENDER_EMAIL as string,
        },

        to: [
          {
            email,
            name,
          },
        ],

        subject: "SW Hub Email Verification OTP",

        htmlContent: `
          <html>
            <body>

              <h2>Welcome to SW Hub</h2>

              <p>Hello ${name},</p>

              <p>Your verification OTP is:</p>

              <h1>${otp}</h1>

              <p>This OTP is valid for 10 minutes.</p>

              <p>
                If you did not request this verification,
                please ignore this email.
              </p>

              <p>SW Hub Team</p>

            </body>
          </html>
        `,
      });

    console.log("✅ OTP email sent successfully");
    console.log("Message ID:", result.messageId);

    return result;

  } catch (error: any) {
    console.error("❌ BREVO ERROR:");
    console.error("Message:", error?.message);
    console.error("Status:", error?.statusCode);
    console.error("Body:", error?.body);
    console.error("Full Error:", error);

    throw new Error(
      error?.message ||
        "Unable to send verification email"
    );
  }
}

export async function sendFranchiseEnquiryEmail(
  enquiry: any
) {
  try {
    console.log("📧 Sending Franchise Enquiry email...");

    const result =
      await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          name: "SW Hub",
          email:
            process.env.BREVO_SENDER_EMAIL as string,
        },

        // Your business/admin email
        to: [
          {
            email:
              process.env.BREVO_SENDER_EMAIL as string,
            name: "SW Hub Admin",
          },
        ],

        // Customer gets a confirmation copy
        replyTo: {
          email: enquiry.email,
          name: enquiry.fullName,
        },

        subject: `New Franchise Enquiry - ${enquiry.fullName}`,

        htmlContent: `
          <!DOCTYPE html>
          <html>
            <body
              style="
                margin:0;
                padding:0;
                background:#f7f5f1;
                font-family:Arial,sans-serif;
                color:#111827;
              "
            >

              <div
                style="
                  max-width:700px;
                  margin:30px auto;
                  background:#ffffff;
                  border-radius:16px;
                  overflow:hidden;
                  border:1px solid #eee;
                "
              >

                <div
                  style="
                    background:#c67c2e;
                    padding:24px;
                    color:white;
                  "
                >
                  <h1 style="margin:0;">
                    New Franchise Enquiry
                  </h1>

                  <p style="margin:8px 0 0;">
                    SW Hub Franchise Application
                  </p>
                </div>

                <div style="padding:30px;">

                  <h2>
                    Applicant Information
                  </h2>

                  <table
                    width="100%"
                    cellpadding="8"
                    cellspacing="0"
                  >

                    <tr>
                      <td><strong>Name</strong></td>
                      <td>${enquiry.fullName}</td>
                    </tr>

                    <tr>
                      <td><strong>Mobile</strong></td>
                      <td>${enquiry.mobile}</td>
                    </tr>

                    <tr>
                      <td><strong>Email</strong></td>
                      <td>${enquiry.email}</td>
                    </tr>

                    <tr>
                      <td><strong>City</strong></td>
                      <td>${enquiry.city}</td>
                    </tr>

                    <tr>
                      <td><strong>State</strong></td>
                      <td>${enquiry.state}</td>
                    </tr>

                  </table>

                  <hr style="margin:25px 0;border:none;border-top:1px solid #eee;" />

                  <h2>
                    Business Information
                  </h2>

                  <table
                    width="100%"
                    cellpadding="8"
                    cellspacing="0"
                  >

                    <tr>
                      <td><strong>Existing Business</strong></td>
                      <td>
                        ${enquiry.ownsBusiness ? "Yes" : "No"}
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Business Name</strong></td>
                      <td>
                        ${enquiry.currentBusinessName || "N/A"}
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Business Type</strong></td>
                      <td>
                        ${enquiry.currentBusinessType || "N/A"}
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Experience</strong></td>
                      <td>
                        ${enquiry.businessExperience || "N/A"}
                      </td>
                    </tr>

                  </table>

                  <hr style="margin:25px 0;border:none;border-top:1px solid #eee;" />

                  <h2>
                    Franchise Requirements
                  </h2>

                  <table
                    width="100%"
                    cellpadding="8"
                    cellspacing="0"
                  >

                    <tr>
                      <td><strong>Preferred Location</strong></td>
                      <td>
                        ${enquiry.preferredLocation}
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Preferred City</strong></td>
                      <td>
                        ${enquiry.preferredCity}
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Preferred Area</strong></td>
                      <td>
                        ${enquiry.preferredArea || "N/A"}
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Investment Capacity</strong></td>
                      <td>
                        ${enquiry.investmentCapacity}
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Store Type</strong></td>
                      <td>
                        ${enquiry.storeType}
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Start Timeline</strong></td>
                      <td>
                        ${enquiry.startTimeline}
                      </td>
                    </tr>

                  </table>

                  ${
                    enquiry.message
                      ? `
                        <hr
                          style="
                            margin:25px 0;
                            border:none;
                            border-top:1px solid #eee;
                          "
                        />

                        <h2>Additional Message</h2>

                        <p
                          style="
                            background:#f7f5f1;
                            padding:16px;
                            border-radius:10px;
                          "
                        >
                          ${enquiry.message}
                        </p>
                      `
                      : ""
                  }

                  <div
                    style="
                      margin-top:30px;
                      padding:16px;
                      background:#fff7ed;
                      border-radius:10px;
                    "
                  >
                    <strong>
                      Action Required
                    </strong>

                    <p style="margin-bottom:0;">
                      Please contact the applicant and
                      follow up regarding the franchise
                      opportunity.
                    </p>
                  </div>

                </div>

                <div
                  style="
                    padding:20px;
                    text-align:center;
                    background:#fafafa;
                    color:#777;
                    font-size:13px;
                  "
                >
                  SW Hub Franchise Enquiry System
                </div>

              </div>

            </body>
          </html>
        `,
      });

    console.log(
      "✅ Franchise enquiry email sent successfully"
    );

    console.log(
      "Message ID:",
      result.messageId
    );

    return result;

  } catch (error: any) {
    console.error(
      "❌ FRANCHISE BREVO ERROR:"
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Status:",
      error?.statusCode
    );

    console.error(
      "Body:",
      error?.body
    );

    throw new Error(
      error?.message ||
        "Unable to send franchise enquiry email"
    );
  }
}