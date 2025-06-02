import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { logout } from '../../store/slices/user/userSlice';
import { OverlayLoader } from '../OverlayLoader';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, loading } = useAppSelector((state) => state.user);
  const { profile } = useAppSelector((state) => state.profile);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isLoggedIn = Boolean(user?.userId);
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    dispatch(logout());

    navigate('/login');
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Закриття при кліку поза меню
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Блокуємо прокрутку коли меню відкрито
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  if (loading) {
    return <OverlayLoader />;
  }

  return (
    <header className="bg-gray-800 p-4 px-8 flex justify-between items-center relative">
      <Link to="/" className="flex items-center z-50">
        <img
          src="/assets/logo-40.webp"
          srcSet="
            /assets/logo-24.webp 24w,
            /assets/logo-32.webp 32w,
            /assets/logo-40.webp 40w,
            /assets/logo-80.webp 80w
          "
          sizes="(max-width: 640px) 24px, (max-width: 1024px) 32px, 40px"
          className="w-10 h-10 mr-2"
          alt="Логотип"
          width={40}
          height={40}
        />

        <span className="text-white font-bold text-xl">Omega Auto</span>
      </Link>

      {/* Бургер кнопка */}
      <button
        type="button"
        aria-label="Меню"
        onClick={toggleMenu}
        className="md:hidden text-white z-50">
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Меню */}
      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 w-full h-full bg-gray-900 text-white flex flex-col items-center justify-center space-y-6 transition-all duration-300 ease-in-out z-40 transform md:static md:flex md:flex-row md:space-y-0 md:space-x-6 md:bg-transparent md:h-auto md:translate-x-0 md:justify-end ${
            menuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:flex'
          }`}>
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className={`text-lg ${
            isActive('/') ? 'border-b-2 border-cyan-400' : 'hover:border-b-2 hover:border-cyan-400'
          }`}>
          Головна
        </Link>

        <Link
          to={isLoggedIn ? '/add' : '/login'}
          onClick={() => setMenuOpen(false)}
          className={`text-lg ${
            isActive('/add')
              ? 'border-b-2 border-cyan-400'
              : 'hover:border-b-2 hover:border-cyan-400'
          }`}>
          Додати оголошення
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              to="/my"
              onClick={() => setMenuOpen(false)}
              className={`text-lg ${
                isActive('/my')
                  ? 'border-b-2 border-cyan-400'
                  : 'hover:border-b-2 hover:border-cyan-400'
              }`}>
              Мої оголошення
            </Link>

            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              className={`text-lg ${
                isActive('/profile')
                  ? 'border-b-2 border-cyan-400'
                  : 'hover:border-b-2 hover:border-cyan-400'
              }`}>
              Особистий кабінет
            </Link>

            {profile?.isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className={`text-lg ${
                  isActive('/admin/dashboard')
                    ? 'border-b-2 border-cyan-400'
                    : 'hover:border-b-2 hover:border-cyan-400'
                }`}>
                Адмін панель
              </Link>
            )}

            <button
              type="button"
              aria-label="Виити"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 text-lg">
              Вийти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={`text-lg ${
                isActive('/login')
                  ? 'border-b-2 border-cyan-400'
                  : 'hover:border-b-2 hover:border-cyan-400'
              }`}>
              Логін
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className={`text-lg ${
                isActive('/register')
                  ? 'border-b-2 border-green-400'
                  : 'hover:border-b-2 hover:border-green-400'
              }`}>
              Реєстрація
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
