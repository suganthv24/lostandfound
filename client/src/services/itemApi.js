import apiClient from '../utils/apiClient';

export const createItem = async (data) => {
  const response = await apiClient.post('/items', data);
  return response.data;
};

export const getItems = async (query = '') => {
  const response = await apiClient.get(`/items${query ? `?q=${query}` : ''}`);
  return response.data;
};

export const getItemById = async (id) => {
  const response = await apiClient.get(`/items/${id}`);
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await apiClient.delete(`/items/${id}`);
  return response.data;
};

export const updateStatus = async (id, status) => {
  const response = await apiClient.patch(`/items/${id}/status`, { status });
  return response.data;
};

export const contactFound = async (id) => {
  const response = await apiClient.post(`/items/${id}/contact`);
  return response.data;
};
