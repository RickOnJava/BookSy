import api from "./axios";

export const getReviews = (ebookId) =>
  api.get(`/reviews/${ebookId}`);

export const addReview = (data) =>
  api.post("/reviews", data);
