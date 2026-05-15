// Central API configuration — all endpoints in one place.
// Values are pulled from .env (prefixed with VITE_ for Vite to expose them).

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export const API = {
  // Auth
  login:      `${API_BASE}/login/`,
  signup:     `${API_BASE}/signup/`,
  logout:     (userId) => `${API_BASE}/logout/${userId}/`,

  // Food / Cart
  food:                   `${API_BASE}/`,
  updateQuantity:         (foodId) => `${API_BASE}/update-quantity/${foodId}/`,
  sessionCart:            `${API_BASE}/session-cart/`,
  clearSessionCart:       (sessionId) => `${API_BASE}/session-cart/clear/${sessionId}/`,

  // Orders
  orders:         (userId) => `${API_BASE}/orders/${userId}/`,
  createOrder:    `${API_BASE}/create-order/`,
  verifyPayment:  `${API_BASE}/verify-payment/`,

  // Voice
  voice: `${API_BASE}/voice/`,
};
