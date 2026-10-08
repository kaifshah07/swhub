import { prisma } from "../../config/database";
import { brevo } from "../../config/brevo";
import { env } from "../../config/env";

export class VendorEnquiryService {
  static async create(data: {
    name: string;
    mobile: string;
    email?: string;
    city: string;
    state: string;
    currentBusiness?: string;
    investmentCapacity?: string;
    preferredLocation?: string;
    message?: string;
  }) {
    // =========================
    // SAVE TO DATABASE
    // =========================

    const enquiry = await prisma.vendorEnquiry.create({
      data: {
        name: data.name.trim(),
        mobile: data.mobile.trim(),
        email: data.email?.trim() || null,
        city: data.city.trim(),
        state: data.state.trim(),
        currentBusiness:
          data.currentBusiness?.trim() || null,
        investmentCapacity:
          data.investmentCapacity?.trim() || null,
        preferredLocation:
          data.preferredLocation?.trim() || null,
        message:
          data.message?.trim() || null,
      },
    });

    // =========================
    // SEND EMAIL
    // =========================

    try {
      await brevo.transactionalEmails.sendTransacEmail({
        sender: {
          email: env.BREVO_SENDER_EMAIL,
          name: env.BREVO_SENDER_NAME,
        },

        to: [
          {
            email:
              env.VENDOR_ENQUIRY_RECEIVER_EMAIL,
            name: "SW Hub Admin",
          },
        ],

        ...(data.email
          ? {
              replyTo: {
                email: data.email,
                name: data.name,
              },
            }
          : {}),

        subject:
          `New Vendor Enquiry - ${data.name}`,

        htmlContent: `
          <!DOCTYPE html>
          <html>
            <body style="
              margin: 0;
              padding: 0;
              background: #f7f5f1;
              font-family: Arial, sans-serif;
            ">

              <div style="
                max-width: 700px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #e5e5e5;
              ">

                <div style="
                  background: #c67c2e;
                  padding: 24px;
                  color: white;
                ">
                  <h1 style="
                    margin: 0;
                    font-size: 24px;
                  ">
                    New Vendor Enquiry
                  </h1>

                  <p style="
                    margin: 8px 0 0;
                    opacity: 0.9;
                  ">
                    A new vendor application has been submitted.
                  </p>
                </div>

                <div style="padding: 30px;">

                  <h2 style="
                    color: #0b1220;
                    margin-top: 0;
                  ">
                    Applicant Information
                  </h2>

                  <table style="
                    width: 100%;
                    border-collapse: collapse;
                  ">

                    <tr>
                      <td style="padding: 10px 0; font-weight: bold;">
                        Name
                      </td>
                      <td style="padding: 10px 0;">
                        ${escapeHtml(data.name)}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; font-weight: bold;">
                        Mobile
                      </td>
                      <td style="padding: 10px 0;">
                        ${escapeHtml(data.mobile)}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; font-weight: bold;">
                        Email
                      </td>
                      <td style="padding: 10px 0;">
                        ${escapeHtml(data.email || "Not provided")}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; font-weight: bold;">
                        City
                      </td>
                      <td style="padding: 10px 0;">
                        ${escapeHtml(data.city)}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; font-weight: bold;">
                        State
                      </td>
                      <td style="padding: 10px 0;">
                        ${escapeHtml(data.state)}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; font-weight: bold;">
                        Current Business
                      </td>
                      <td style="padding: 10px 0;">
                        ${escapeHtml(
                          data.currentBusiness ||
                            "Not provided"
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; font-weight: bold;">
                        Investment Capacity
                      </td>
                      <td style="padding: 10px 0;">
                        ${escapeHtml(
                          data.investmentCapacity ||
                            "Not provided"
                        )}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; font-weight: bold;">
                        Preferred Location
                      </td>
                      <td style="padding: 10px 0;">
                        ${escapeHtml(
                          data.preferredLocation ||
                            "Not provided"
                        )}
                      </td>
                    </tr>

                  </table>

                  <hr style="
                    border: none;
                    border-top: 1px solid #eeeeee;
                    margin: 25px 0;
                  " />

                  <h2 style="
                    color: #0b1220;
                  ">
                    Message
                  </h2>

                  <div style="
                    background: #f7f5f1;
                    padding: 18px;
                    border-radius: 8px;
                    color: #444444;
                    line-height: 1.6;
                  ">
                    ${escapeHtml(
                      data.message ||
                        "No message provided"
                    )}
                  </div>

                  <p style="
                    margin-top: 30px;
                    color: #888888;
                    font-size: 13px;
                  ">
                    Enquiry ID: #${enquiry.id}
                  </p>

                </div>

              </div>

            </body>
          </html>
        `,

        textContent: `
New Vendor Enquiry

Name: ${data.name}
Mobile: ${data.mobile}
Email: ${data.email || "Not provided"}
City: ${data.city}
State: ${data.state}
Current Business: ${
          data.currentBusiness || "Not provided"
        }
Investment Capacity: ${
          data.investmentCapacity || "Not provided"
        }
Preferred Location: ${
          data.preferredLocation || "Not provided"
        }

Message:
${data.message || "No message provided"}

Enquiry ID: #${enquiry.id}
        `,
      });

      console.log(
        `✅ Vendor enquiry email sent for #${enquiry.id}`
      );
    } catch (emailError) {
      // Important:
      // Database submission should remain successful
      // even if Brevo temporarily fails.
      console.error(
        "❌ Vendor enquiry email failed:",
        emailError
      );
    }

    return enquiry;
  }

  static async getAll() {
    return prisma.vendorEnquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getById(id: number) {
    return prisma.vendorEnquiry.findUnique({
      where: {
        id,
      },
    });
  }

  static async updateStatus(
    id: number,
    status:
      | "PENDING"
      | "CONTACTED"
      | "APPROVED"
      | "REJECTED"
  ) {
    return prisma.vendorEnquiry.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  static async delete(id: number) {
    return prisma.vendorEnquiry.delete({
      where: {
        id,
      },
    });
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}