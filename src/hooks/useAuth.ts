import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  return {
    isAuthenticated,
    token,
    userId,
    loading,
  };
}
