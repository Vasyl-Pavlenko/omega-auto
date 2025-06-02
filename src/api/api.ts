import axios, { AxiosError } from 'axios';
import { SortOption, Tyre, TyreForm } from '../types/tyre';
import { TyreFilterField } from '../constants/tyreOptions';

export type UserResponse = {
  token: string;
  userId: string;
};

export const API = axios.create({
  // baseURL: 'http://localhost:4000',
  baseURL: process.env.REACT_APP_API_URL,
});

// Якщо є токен — додаємо до кожного запиту
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Хелпер для обробки помилок
const handleError = (error: AxiosError, customMessage: string) => {
  if (error.response) {
    const backendMessage = (error.response.data as { message?: string }).message || customMessage;
    return backendMessage;
  }

  // Обробка помилок без відповіді
  if (error.code === 'ECONNABORTED') {
    return 'Перевищено час очікування з’єднання';
  }

  return customMessage;
};

const logError = (context: string, error: unknown) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
};

// Реєстрація
export const registerUser = async (data: { email: string; password: string; name: string }) => {
  try {
    const res = await API.post<{ message: string }>('/api/auth/register', data);

    return res.data.message;
  } catch (err: any) {
    if (err.response?.data?.message) {
      throw err.response.data.message;
    }

    logError('Помилка запиту:', err);
  }
};

// Підтвердження пошти
export const confirmEmail = (token: string) =>
  API.get<{ message: string }>(`/api/auth/confirm-email/${token}`)
    .then((res) => res.data.message)
    .catch((err) => handleError(err, 'Не вдалося підтвердити пошту'));

// Повторний лист з токеном
export const resendEmailConfirmation = (email?: string) =>
  API.post('/api/auth/resend-confirmation', email ? { email } : {})
    .then((res) => res.data.message)
    .catch((err) => handleError(err, 'Не вдалося надіслати підтвердження'));

// Логін входу
export const loginUser = (data: { email: string; password: string }) =>
  API.post('/api/auth/login', data)
    .then((response) => {
      return response.data;
    })
    .catch((err) => handleError(err, 'Помилка при вході'));

export const getMyProfile = async () => {
  const res = await API.get('/api/user/profile');

  return res.data;
};

export const updateProfile = async (data: { name: string; phone?: string; city?: string }) => {
  const res = await API.put('/api/user/profile', data);

  return res.data;
};

export const sendPhoneCode = async (phone: string): Promise<string> => {
  try {
    const res = await API.post<{ message: string }>('/api/phone/send', { phone });

    return res.data.message;
  } catch (err: any) {
    return handleError(err, 'Не вдалося надіслати код');
  }
};

// Функція для перевірки коду підтвердження телефону
export const verifyPhoneCode = async (code: string): Promise<{ message: string }> => {
  const res = await API.post<{ message: string }>('/api/phone/verify', { code });
  return res.data;
};

export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const res = await API.put('/api/user/updatePassword', data);

  return res.data;
};

// Функція для відправки листа з відновленням паролем
export const requestPasswordReset = (email: string) =>
  API.post('/api/auth/forgot-password', { email })
    .then((res) => res.data.message)
    .catch((err) => handleError(err, 'Не вдалося надіслати лист'));

export const resetPassword = (token: string, newPassword: string) =>
  API.post(`/api/auth/reset-password/${token}`, { newPassword })
    .then((res) => res.data.message)
    .catch((err) => handleError(err, 'Не вдалося змінити пароль'));

// Загальна функція для отримання шин
export const fetchTyresFromAPI = async (
  url: string,
  filters: Partial<Record<TyreFilterField, string>> = {},
  page: number = 1,
  limit: number = 6,
  sortBy: SortOption = SortOption.None,
): Promise<{ tyres: Tyre[]; total: number }> => {
  try {
    const cleanedParams = Object.fromEntries(
      Object.entries({ ...filters, sort: sortBy }).filter(([_, v]) => v !== ''),
    );

    const response = await API.get<{ tyres: Tyre[]; total: number }>(url, {
      params: { ...cleanedParams, page, limit },
    });

    return response.data;
  } catch (error) {
    logError('Error fetching tyres:', error);
    throw error;
  }
};

// Використовуємо загальну функцію
export const fetchTyres = (
  filters: Partial<Record<TyreFilterField, string>> = {},
  page: number,
  limit: number,
  sortBy: SortOption = SortOption.None,
) => fetchTyresFromAPI('/api/tyres', filters, page, limit, sortBy);

export const fetchMyTyres = (page: number, limit: number) =>
  fetchTyresFromAPI('/api/tyres/my', {}, page, limit);

// Отримати одну шину
export const fetchTyreById = (id: string) =>
  API.get(`/api/tyres/${id}`).catch((err) => handleError(err, 'Не вдалося завантажити оголошення'));

// Створити оголошення
export const createTyre = (data: any) =>
  API.post('/api/tyres', data).catch((err) => handleError(err, 'Помилка при створенні оголошення'));

// Оновити оголошення
export const updateTyre = (id: string, data: Partial<TyreForm>) =>
  API.patch(`/api/tyres/${id}`, data).catch((err) =>
    handleError(err, 'Помилка при оновленні оголошення'),
  );

// Оновити дату публікації
export const renewTyre = (id: string) =>
  API.patch(`/api/tyres/${id}/renew`)
    .then((res) => res.data)
    .catch((err) => handleError(err, 'Помилка при продовженні оголошення'));

// Видалити оголошення
export const deleteTyre = (id: string) =>
  API.delete(`/api/tyres/${id}`).catch((err) =>
    handleError(err, 'Помилка при видаленні оголошення'),
  );

export const removeFromActiveTyres = (id: string) =>
  API.put(`/api/tyres/${id}`).catch((err) =>
    handleError(err, 'Помилка при деактивації оголошення'),
  );

  export const getFavorites = async (): Promise<string[]> => {
    try {
      const response = await API.get<string[]>('/api/favorites/ids');
      
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          return [];
        }

        logError('Помилка при отриманні обраного', err);
        handleError(err, 'Помилка при отриманні обраного')
      } else {
        logError('Невідома помилка:', err);
      }

      return [];
    }
  };

export const fetchTyresByIds = async (ids: string[]): Promise<{ tyres: Tyre[] }> => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { tyres: [] };
  }

  const response = await API.post('/api/tyres/by-ids', { ids });

  return response.data;
};

export const addToFavorite = (id: string) =>
  API.post('/api/favorites', { tyreId: id }).catch((err) =>
    handleError(err, 'Помилка при додаванні в обране'),
  );

export const removeFromFavorite = (id: string) =>
  API.delete(`/api/favorites/${id}`).catch((err) =>
    handleError(err, 'Помилка при видаленні з обраного'),
  );

// ========================
// Admin статистика
// ========================

export const fetchAdminStats = async () => {
  const res = await API.get('/api/admin/stats');

  return res.data;
};

export const fetchDailyListings = async () => {
  const res = await API.get('/api/admin/stats/daily-listings');

  return res.data;
};

export const fetchDailyUsers = async () => {
  const res = await API.get('/api/admin/stats/daily-users');

  return res.data;
};

export const fetchListingCategories = async () => {
  const res = await API.get('/api/admin/stats/listing-categories');

  return res.data;
};

export const fetchListingStatus = async () => {
  const res = await API.get('/api/admin/stats/listing-status');

  return res.data;
};
