import { ImageInfo } from "../utils/getImageUrl";

// Загальні типи
export type Season = '' |'Літо' | 'Зима' | 'Всесезонна';
export type VehicleType = '' | 'Легковий' | 'Мото' | 'Вантажний';
export type Condition = '' | 'Нова' | 'Б/У';

// Основна модель
export interface Tyre {
  _id: string;
  id?: string;
  brand: string;
  model: string;
  width: string;
  height: string;
  radius: string;
  title: string;
  slug: string;
  season: Season;
  vehicle: VehicleType;
  year: number;
  quantity: number;
  treadDepth: string;
  treadPercent: string;
  city: string;
  condition: Condition;
  price: number;
  contact: string;
  description?: string;
  images: ImageInfo[][];
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  userId: string;
  favoritesCount: number;
  isFavorite?: boolean;
  views: number;
  isViewed?: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isExpired: boolean;
  willBeDeletedAt: Date | string;
}

// Пропси до карточки
export interface TyreCardProps {
  tyre: Tyre;
  showActions?: boolean;
  showContact?: boolean;
  showDetailsButton?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

// Форма реєстрації/входу
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
}

// Форма оголошення
export interface TyreForm {
  brand: string;
  model: string;
  width: string;
  height: string;
  radius: string;
  quantity: string;
  season: Season;
  vehicle: VehicleType;
  year: string;
  treadDepth: string;
  treadPercent: string;
  city: string;
  condition: Condition;
  price: string;
  contact?: string;
  description: string;
  images: ImageInfo[][];
  [key: string]: string | string[] | ImageInfo[][] | undefined;
}

// Фільтри
export interface Filters {
  title?: string;
  width?: string;
  height?: string;
  radius?: string;
  season?: string;
  vehicle?: string;
  condition?: string;
}

// Сортування
export enum SortOption {
  None = '',
  Newest = 'newest',
  Oldest = 'oldest',
  PriceAsc = 'priceAsc',
  PriceDesc = 'priceDesc',
}
