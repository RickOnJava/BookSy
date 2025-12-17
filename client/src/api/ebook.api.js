import api from "./axios";

// GET /api/ebooks
export const getAllEBooks = async () => {
  return api.get("/ebooks");
};

export const getRecommendedBooks = () => api.get("/ebooks/recommended");

// GET /api/ebooks/:id
export const getSingleEBook = async (id) => {
  return api.get(`/ebooks/${id}`);
};

export const getMyBooks = () => api.get("/ebooks/my-books");

export const getReadingProgress = () =>
  api.get("/ebooks/progress");

