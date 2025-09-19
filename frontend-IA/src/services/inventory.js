import api from "./api";

export const getInventoryItems = async (filters = {}) => {
  return await api.get("/equipos/", { params: filters });
};

export const updateInventoryItem = async (id, itemData) => {
  return await api.put(`/equipos/${id}/`, itemData);
};
