export const paymentService = {
  createOrder: async (bookingId) => {
    return {
      success: true,
      order: { id: 'order_' + Math.random().toString(36).substr(2, 9), amount: 500000, currency: 'INR' },
      booking: { bookingId: bookingId || 'BK-MOCK' },
      razorpayKeyId: 'rzp_test_mockkey123'
    };
  },

  openCheckout: async (options) => {
    console.log('Opening mock Razorpay checkout with options:', options);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          razorpay_order_id: options.order_id,
          razorpay_payment_id: 'pay_' + Math.random().toString(36).substr(2, 9),
          razorpay_signature: 'mock_signature_123'
        });
      }, 500);
    });
  },

  verifyPayment: async (data) => {
    return { success: true, message: 'Payment verified (Mock)' };
  }
};

export default paymentService;
