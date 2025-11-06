import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { OverlayLoader, StatCard } from '../components';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import {
  fetchAdminStats,
  fetchDailyListings,
  fetchDailyUsers,
  fetchListingCategories,
  fetchListingStatus,
} from '../api/api';

export default function AdminPage() {
  const [stats, setStats] = useState({
    users: 0,
    tyres: 0,
  });

  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState([]);
  const [dailyUsers, setDailyUsers] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [mainStats, listings, users, categories, statuses] = await Promise.all([
          fetchAdminStats(),
          fetchDailyListings(),
          fetchDailyUsers(),
          fetchListingCategories(),
          fetchListingStatus(),
        ]);
        setStats(mainStats);
        setDailyData(listings);
        setDailyUsers(users);
        setCategoryData(categories);
        setStatusData(statuses);
      } catch (err) {
        console.error('Помилка при завантаженні статистики:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  return (
    <>
      <Helmet>
        <title>Адмінпанель | Omega Auto</title>
        <meta
          name="description"
          content="Керування користувачами, оголошеннями та налаштуваннями сайту в адміністративній панелі."
        />
      </Helmet>

      <div className="container mx-auto px-12 py-6 relative">
        <h1 className="text-3xl font-semibold text-center mb-6">Адмін-панель</h1>
        {loading && <OverlayLoader />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard label="Користувачі" value={stats.users} />
          <StatCard label="Оголошення" value={stats.tyres} />
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Нові оголошення за останні 7 днів</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Нові користувачі за останні 7 днів</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Оголошення по категоріях</h2>
          <div className="bg-white shadow-md rounded-lg p-6 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label>
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'][index % 5]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Статус оголошень</h2>
          <div className="bg-white shadow-md rounded-lg p-6 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label>
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-status-${index}`}
                      fill={['#10b981', '#ef4444'][index % 2]} // зелений / червоний
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  );
}
