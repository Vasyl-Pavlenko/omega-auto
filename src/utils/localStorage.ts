// utils/localStorage.ts
export const saveFiltersToStorage = (filters: Record<string, string>) => {
  try {
    localStorage.setItem('tyresFilters', JSON.stringify(filters));
  } catch {
    // ігнорувати помилки
  }
};

export const loadFiltersFromStorage = (): Record<string, string> | null => {
  try {
    const data = localStorage.getItem('tyresFilters');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const clearFiltersFromStorage = () => {
  try {
    localStorage.removeItem('tyresFilters');
  } catch {
    // ігнорувати помилки
  }
};