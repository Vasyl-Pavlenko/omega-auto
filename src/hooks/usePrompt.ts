import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function usePrompt(message: string, when: boolean) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!when) {
      return;
    }

    const handleWindowClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    const handleBrowseAway = (e: PopStateEvent) => {
      if (!window.confirm(message)) {
        navigate(location.pathname, { replace: true });
      }
    };

    window.addEventListener('beforeunload', handleWindowClose);
    window.addEventListener('popstate', handleBrowseAway);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      window.removeEventListener('popstate', handleBrowseAway);
    };
  }, [when, message, navigate, location]);
}
