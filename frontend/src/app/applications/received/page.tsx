'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  tenantId: {
    name: string;
    email: string;
  };
  propertyId: {
    title: string;
    address: string;
    price: number;
  };
}

export default function ReceivedApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/received');
      setApplications(res.data);
    } catch (err) {
      console.error('Ошибка при получении заявок', err);
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.put(`/applications/${id}`, { status });
      fetchApplications();
    } catch {
      alert('Ошибка при обновлении заявки');
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
      <main className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Заявки на мои объекты
        </h1>

        {applications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Пока заявок нет.</p>
        ) : (
          <div className="space-y-6">
            {applications.map((a) => (
              <div
                key={a._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6 transition hover:shadow-lg"
              >
                <div className="mb-3">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {a.propertyId.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {a.propertyId.address} — <span className="font-medium">{a.propertyId.price} ₸/мес</span>
                  </p>
                </div>

                <div className="text-sm text-gray-800 dark:text-gray-300 space-y-1">
                  <p>
                    👤 <strong>{a.tenantId.name}</strong> ({a.tenantId.email})
                  </p>
                  <p>
                    Статус:{' '}
                    <span
                      className={
                        a.status === 'approved'
                          ? 'text-green-600 font-semibold'
                          : a.status === 'rejected'
                          ? 'text-red-600 font-semibold'
                          : 'text-yellow-600 font-semibold'
                      }
                    >
                      {a.status === 'approved'
                        ? 'Одобрено'
                        : a.status === 'rejected'
                        ? 'Отклонено'
                        : 'В ожидании'}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Подано: {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {a.status === 'pending' && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleStatusChange(a._id, 'approved')}
                      className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleStatusChange(a._id, 'rejected')}
                      className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
