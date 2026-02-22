import transporter from "../config/email.config.js";

/**
 * Email Service - Handles all email sending operations
 * This service provides methods to send different types of emails
 * to users, NGO admins, and system administrators
 */

class EmailService {
  /**
   * Generic email sending method
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} options.subject - Email subject
   * @param {string} options.template - Template name (without .hbs extension)
   * @param {Object} options.context - Dynamic data to pass to the template
   * @returns {Promise<Object>} - Email sending result
   */
  async sendEmail({ to, subject, template, context }) {
    try {
      const mailOptions = {
        from:
          process.env.EMAIL_FROM || `"DonorLens" <${process.env.SMTP_USER}>`,
        to,
        subject,
        template,
        context: {
          ...context,
          logoUrl: process.env.EMAIL_LOGO_URL,
          currentYear: new Date().getFullYear(),
          frontendUrl: process.env.CLIENT_URL || "http://localhost:5173",
        },
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("Email sending failed:", error);
      throw error;
    }
  }

  /**
   * Send email when NGO registration request is received
   * @param {Object} ngoData - NGO registration data
   * @param {string} ngoData.email - NGO admin email
   * @param {string} ngoData.ngoName - Name of the organization
   * @param {string} ngoData.fullName - Admin's full name
   */
  async sendNgoRegistrationReceived(ngoData) {
    return this.sendEmail({
      to: ngoData.email,
      subject: "NGO Registration Request Received - DonorLens",
      template: "ngo-registration-received",
      context: {
        adminName: ngoData.fullName,
        ngoName: ngoData.ngoName,
        email: ngoData.email,
        submissionDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    });
  }

  /**
   * Send email when NGO registration is approved
   * @param {Object} ngoData - NGO data
   * @param {string} ngoData.email - NGO admin email
   * @param {string} ngoData.ngoName - Name of the organization
   * @param {string} ngoData.fullName - Admin's full name
   */
  async sendNgoRegistrationApproved(ngoData) {
    return this.sendEmail({
      to: ngoData.email,
      subject: "🎉 NGO Registration Approved - DonorLens",
      template: "ngo-registration-approved",
      context: {
        adminName: ngoData.fullName,
        ngoName: ngoData.ngoName,
        loginUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/login`,
        dashboardUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`,
      },
    });
  }

  /**
   * Send email when NGO registration is rejected
   * @param {Object} ngoData - NGO data
   * @param {string} ngoData.email - NGO admin email
   * @param {string} ngoData.ngoName - Name of the organization
   * @param {string} ngoData.fullName - Admin's full name
   * @param {string} reason - Reason for rejection
   */
  async sendNgoRegistrationRejected(ngoData, reason) {
    return this.sendEmail({
      to: ngoData.email,
      subject: "NGO Registration Update - DonorLens",
      template: "ngo-registration-rejected",
      context: {
        adminName: ngoData.fullName,
        ngoName: ngoData.ngoName,
        reason:
          reason || "The submitted information does not meet our requirements.",
        supportEmail: process.env.SUPPORT_EMAIL || "support@donorlens.com",
        reapplyUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/register-ngo`,
      },
    });
  }

  /**
   * Send email when a new campaign is created
   * @param {Object} campaignData - Campaign data
   * @param {string} campaignData.adminEmail - NGO admin email
   * @param {string} campaignData.adminName - Admin's name
   * @param {string} campaignData.campaignTitle - Campaign title
   * @param {string} campaignData.campaignId - Campaign ID
   */
  async sendCampaignCreated(campaignData) {
    return this.sendEmail({
      to: campaignData.adminEmail,
      subject: "✨ Campaign Successfully Created - DonorLens",
      template: "campaign-created",
      context: {
        adminName: campaignData.adminName,
        campaignTitle: campaignData.campaignTitle,
        campaignUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/campaigns/${campaignData.campaignId}`,
        dashboardUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard`,
      },
    });
  }

  /**
   * Send email when a donation is received
   * @param {Object} donationData - Donation data
   * @param {string} donationData.donorEmail - Donor's email
   * @param {string} donationData.donorName - Donor's name
   * @param {number} donationData.amount - Donation amount
   * @param {string} donationData.campaignTitle - Campaign title
   * @param {string} donationData.ngoName - NGO name
   */
  async sendDonationReceived(donationData) {
    return this.sendEmail({
      to: donationData.donorEmail,
      subject: "❤️ Thank You for Your Donation - DonorLens",
      template: "donation-received",
      context: {
        donorName: donationData.donorName,
        amount: donationData.amount,
        campaignTitle: donationData.campaignTitle,
        ngoName: donationData.ngoName,
        donationDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        trackingUrl: `${process.env.CLIENT_URL || "http://localhost:5173"}/profile/donations`,
      },
    });
  }
}

export default new EmailService();
