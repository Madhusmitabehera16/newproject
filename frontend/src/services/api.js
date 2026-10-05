import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkHealth = async () => {
  const response = await apiClient.get('/health/');
  return response.data;
};

export const getApiRoot = async () => {
  const response = await apiClient.get('/');
  return response.data;
};

export const getMonitors = async () => {
  const response = await apiClient.get('/monitors/');
  return response.data;
};

export const getMonitor = async (id) => {
  const response = await apiClient.get(`/monitors/${id}/`);
  return response.data;
};

export const createMonitor = async (data) => {
  const response = await apiClient.post('/monitors/', data);
  return response.data;
};

export const updateMonitor = async (id, data) => {
  const response = await apiClient.patch(`/monitors/${id}/`, data);
  return response.data;
};

export const deleteMonitor = async (id) => {
  const response = await apiClient.delete(`/monitors/${id}/`);
  return response.data;
};

export default apiClient;
