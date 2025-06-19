import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/administrativo'; // Tu URL base del backend

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptores (opcional pero muy útil para el futuro)

// Interceptor de Solicitud: para añadir tokens de autenticación, etc.
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const token = localStorage.getItem('authToken'); // Ejemplo si usas tokens
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta: para manejar errores globales, refrescar tokens, etc.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Manejo de errores global
    // Por ejemplo, si es un error 401 (No Autorizado), redirigir al login
    // if (error.response?.status === 401) {
    //   window.location.href = '/login';
    // }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error); // Propagar el error para que el componente lo maneje
  }
);

export default apiClient;