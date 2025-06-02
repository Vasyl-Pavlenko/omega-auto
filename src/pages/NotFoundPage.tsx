import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-white px-4">
      <div className="text-center max-w-md">
        <p className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Сторінка не знайдена</p>

        <Link to="/" className="btn-blue hover:underline">
          На головну
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
