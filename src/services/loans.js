import api from "./api";

export const getLoans = async (filters = {}) => {
  return await api.get("/api/loans/", { params: filters });
};

export const createLoan = async (loanData) => {
  return await api.post("/api/loans/", loanData);
};

export const approveLoan = async (id) => {
  return await api.put(`/api/loans/${id}/approve`);
};

export const returnLoan = async (id) => {
  return await api.put(`/api/loans/${id}/return`);
};
