import { PaymentUsecase } from "../../usecases/payment/payment.js";

const paymentUsecase = new PaymentUsecase();

/**
 * GET /api/payment/
 * Get all payments — ADMIN only
 */
export const getAllPayments = async (req, res, next) => {
  try {
    const result = await paymentUsecase.getAllPayments();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/payment/my
 * Get the current logged-in user's payment history
 */
export const getUserPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const result = await paymentUsecase.getUserPayments(userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payment/
 * Create a new payment — any authenticated USER
 */
export const createPayment = async (req, res, next) => {
  try {
    const donorId = req.user.userId;
    const { campaignId, amount, currency, paymentMethod } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({
        success: false,
        message: "campaignId and amount are required",
      });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "amount must be a positive number",
      });
    }

    const result = await paymentUsecase.createPayment({
      donorId,
      campaignId,
      amount,
      currency,
      paymentMethod,
    });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};