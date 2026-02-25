import Payment from "../../models/payment/Payment.js";
import Campaign from "../../models/campaigns/Campaign.js";

export class PaymentUsecase {
  /**
   * Get all payments (admin use)
   * @returns {Promise<Object>} All payments with donor and campaign populated
   */
  async getAllPayments() {
    const payments = await Payment.find()
      .populate("donor", "fullName email profile")
      .populate("campaign", "title status raisedAmount totalPlannedCost")
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: "Payments fetched successfully",
      count: payments.length,
      data: payments,
    };
  }

  /**
   * Get payments for a specific user
   * @param {string} userId - The user's ID from req.user
   * @returns {Promise<Object>} User's payment history
   */
  async getUserPayments(userId) {
    const payments = await Payment.find({ donor: userId })
      .populate("campaign", "title status raisedAmount totalPlannedCost coverImage")
      .sort({ createdAt: -1 });

    return {
      success: true,
      message: "Payment history fetched successfully",
      count: payments.length,
      data: payments,
    };
  }

  /**
   * Create a new payment and update campaign's raised amount
   * @param {Object} paymentData
   * @param {string} paymentData.donorId - User making the payment
   * @param {string} paymentData.campaignId - Target campaign
   * @param {number} paymentData.amount - Amount to donate
   * @param {string} paymentData.currency - Currency code (default: LKR)
   * @param {string} paymentData.paymentMethod - Payment method
   * @returns {Promise<Object>} Created payment document
   */
  async createPayment({ donorId, campaignId, amount, currency, paymentMethod }) {
    // Validate campaign exists and is ongoing
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    if (campaign.status !== "ONGOING") {
      throw new Error("Cannot donate to a completed campaign");
    }

    // Create the payment
    const payment = new Payment({
      donor: donorId,
      campaign: campaignId,
      amount,
      currency: currency || "LKR",
      paymentMethod: paymentMethod || "CARD",
      status: "COMPLETED",
    });

    await payment.save();

    // Update campaign's raised amount and recalculate progress
    campaign.raisedAmount += amount;
    if (campaign.totalPlannedCost > 0) {
      campaign.progressPercentage = Math.min(
        100,
        Math.round((campaign.raisedAmount / campaign.totalPlannedCost) * 100),
      );
    }
    await campaign.save();

    // Return populated payment
    const populatedPayment = await Payment.findById(payment._id)
      .populate("donor", "fullName email")
      .populate("campaign", "title status raisedAmount totalPlannedCost");

    return {
      success: true,
      message: "Payment created successfully",
      data: populatedPayment,
    };
  }
}