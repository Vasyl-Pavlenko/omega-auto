import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Сторінка не знайдена | Omega Auto</title>
        <meta
          name="description"
          content="Вибачте, запитувана сторінка не існує. Перевірте URL або поверніться на головну"
        />
      </Helmet>

      <div className="flex justify-center items-center min-h-screen bg-white px-4">
        <div className="text-center max-w-md">
          <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Сторінка не знайдена
          </p>

          <Link to="/" className="btn-blue hover:underline">
            На головну
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
