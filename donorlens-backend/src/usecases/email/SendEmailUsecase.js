import emailService from "../../services/email.service.js";

/**
 * Send Email Usecase - Business logic for sending emails
 * This usecase centralizes email sending logic and adds additional
 * validation, logging, or business rules if needed
 *
 * @param {Object} emailData - Email data
 * @param {string} emailData.type - Type of email to send
 * @param {Object} emailData.data - Data for the email template
 * @returns {Object} Result object with success status
 */
export default async function SendEmailUsecase({ type, data }) {
  try {
    let result;

    switch (type) {
      case "NGO_REGISTRATION_RECEIVED":
        result = await emailService.sendNgoRegistrationReceived(data);
        break;

      case "NGO_REGISTRATION_APPROVED":
        result = await emailService.sendNgoRegistrationApproved(data);
        break;

      case "NGO_REGISTRATION_REJECTED":
        result = await emailService.sendNgoRegistrationRejected(
          data,
          data.reason,
        );
        break;

      case "CAMPAIGN_CREATED":
        result = await emailService.sendCampaignCreated(data);
        break;

      case "DONATION_RECEIVED":
        result = await emailService.sendDonationReceived(data);
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    return {
      success: true,
      message: "Email sent successfully",
      data: result,
    };
  } catch (error) {
    console.error("SendEmailUsecase error:", error);
    // Don't throw error - email failures shouldn't break the main flow
    return {
      success: false,
      message: "Failed to send email",
      error: error.message,
    };
  }
}
