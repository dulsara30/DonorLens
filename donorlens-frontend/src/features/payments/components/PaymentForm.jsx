import { useRef, useEffect } from "react";
import { generatePayHereHash } from "../helpers";

const PAYHERE_CHECKOUT_URL = "https://sandbox.payhere.lk/pay/checkout";

export default function PaymentForm({
  orderId,
  items,
  amount,
  currency = "LKR",
  firstName,
  lastName,
  email,
  phone,
  address,
  city,
  autoSubmit = false,
}) {
  const formRef = useRef(null);
  const merchantId = import.meta.env.VITE_PAYHERE_MERCHANT_ID;

  const returnUrl = `${window.location.origin}/payment/return`;
  const cancelUrl = `${window.location.origin}/payment/cancel`;
  const notifyUrl = `${import.meta.env.VITE_API_URL}/payments/notify`;

  const hash = generatePayHereHash(orderId, amount, currency);

  useEffect(() => {
    if (autoSubmit && formRef.current) {
      formRef.current.submit();
    }
  }, [autoSubmit]);

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return {
    formRef,
    merchantId,
    returnUrl,
    cancelUrl,
    notifyUrl,
    hash,
    handleSubmit,
  };
}

export function PayHereHiddenForm({
  orderId,
  items,
  amount,
  currency = "LKR",
  firstName,
  lastName,
  email,
  phone,
  address,
  city,
  formRef,
}) {
  const merchantId = import.meta.env.VITE_PAYHERE_MERCHANT_ID;
  const returnUrl = `${window.location.origin}/payment/return`;
  const cancelUrl = `${window.location.origin}/payment/cancel`;
  const notifyUrl = `${import.meta.env.VITE_API_URL}/payments/notify`;
  const hash = generatePayHereHash(orderId, amount, currency);

  return (
    <form
      ref={formRef}
      method="post"
      action={PAYHERE_CHECKOUT_URL}
      style={{ display: "none" }}
    >
      <input type="hidden" name="merchant_id" value={merchantId} />
      <input type="hidden" name="return_url" value={returnUrl} />
      <input type="hidden" name="cancel_url" value={cancelUrl} />
      <input type="hidden" name="notify_url" value={notifyUrl} />
      <input type="hidden" name="order_id" value={orderId} />
      <input type="hidden" name="items" value={items} />
      <input type="hidden" name="currency" value={currency} />
      <input
        type="hidden"
        name="amount"
        value={parseFloat(amount).toFixed(2)}
      />
      <input type="hidden" name="first_name" value={firstName} />
      <input type="hidden" name="last_name" value={lastName} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="phone" value={phone} />
      <input type="hidden" name="address" value={address} />
      <input type="hidden" name="city" value={city} />
      <input type="hidden" name="country" value="Sri Lanka" />
      <input type="hidden" name="hash" value={hash} />
    </form>
  );
}
