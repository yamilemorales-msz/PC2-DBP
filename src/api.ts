import axios from 'axios';


export interface Book { id: number; title: string; author: string; category: string; availableCopies: number; }

export interface Page<T> { items: T[]; page: number; size: number; totalItems: number; totalPages: number; }


export interface Booking { id: number; bookId: number; bookTitle: string; days: number; status: string; }


export const api = axios.create({ baseURL: 'https://bibliotecaactiva-api.aaron-navarro.workers.dev/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && !config.url?.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export function apiError(err: any) {
  if (err.response) return { code: err.response.data?.code, message: err.response.data?.message ?? 'Ocurrió un error.' };
  return { code: undefined, message: 'No se pudo conectar con el servidor.' };
}
