import { format } from "date-fns";

export const formatDate = (date?: string | Date, fallback = 'Дата не вказана') => {
  try {
    return date ? format(new Date(date), 'dd.MM.yyyy') : fallback;
  } catch {
    return fallback;
  }
};
