import api from "./axios";

// export const createOrder = (ebookId) =>
//   api.post("/payments/create-order", { ebookId });

// export const verifyPayment = (data) =>
//   api.post("/payments/verify", data);


export const createStripeSession = (ebookId) =>
  api.post("/payments/stripe/create-session", { ebookId });
