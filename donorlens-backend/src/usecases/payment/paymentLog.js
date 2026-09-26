import PaymentLog from "../../models/payment/PaymentLog.js";
import loggerService from "../../services/logger.service.js";

export class PaymentLogUsecase {
  async createLog(logData) {
    try {
      const log = new PaymentLog({
        donor: logData.donor || null,
        campaign: logData.campaign || null,
        amount: logData.amount || null,
        currency: logData.currency || "LKR",
        paymentMethod: logData.paymentMethod || null,
        status: logData.status,
        failureReason: logData.failureReason || null,
        failureCategory: logData.failureCategory || null,
        requestBody: logData.requestBody || null,
        ipAddress: logData.ipAddress || null,
        payment: logData.payment || null,
      });

      await log.save();
    } catch (error) {
      loggerService.error("PaymentLog write failed:", error);
    }
  }

  async getAllLogs() {
    try {
      const logs = await PaymentLog.find();
      return logs;
    } catch (error) {
      loggerService.error("PaymentLog read failed:", error);
      throw error;
    }
  }
}
