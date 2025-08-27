import api from "./api";

export const getInventoryItems = async (filters = {}) => {
  return await api.get("/api/inventory/", { params: filters });
};

export const createInventoryItem = async (itemData) => {
  return await api.post("/api/inventory/", itemData);
};

export const updateInventoryItem = async (id, itemData) => {
  return await api.put(`/api/inventory/${id}`, itemData);
};

export const deleteInventoryItem = async (id) => {
  return await api.delete(`/api/inventory/${id}`);
};
