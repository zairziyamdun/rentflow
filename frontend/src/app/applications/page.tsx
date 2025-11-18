'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Application {
  _id: string;
  status: string;
  dateCreated: string;
  propertyId: {
    title: string;
    address: string;
    price: number;
    type: string;
  };
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке заявок', err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const statusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
            Одобрено
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
            Отклонено
          </span>
        );
      default:
        return (
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
            В ожидании
          </span>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-10 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 border-b border-gray-300 dark:border-gray-700 pb-3">
          Мои заявки
        </h1>

        {applications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Вы пока не подали ни одной заявки.</p>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {app.propertyId.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {app.propertyId.address}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {app.propertyId.price.toLocaleString()} ₸ / мес
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Дата подачи: {new Date(app.dateCreated).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="md:text-right">{statusBadge(app.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
