import md5 from 'crypto-js/md5';

export function generatePayHereHash(orderId, amount, currency = 'LKR') {
  const merchantId = import.meta.env.VITE_PAYHERE_MERCHANT_ID;
  const merchantSecret = import.meta.env.VITE_PAYHERE_MERCHANT_SECRET;

  const hashedSecret = md5(merchantSecret).toString().toUpperCase();
  const amountFormatted = parseFloat(amount)
    .toLocaleString('en-us', { minimumFractionDigits: 2 })
    .replaceAll(',', '');

  const hash = md5(
    merchantId + orderId + amountFormatted + currency + hashedSecret
  ).toString().toUpperCase();

  return hash;
}

export function formatCurrency(amount, currency = 'LKR') {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}