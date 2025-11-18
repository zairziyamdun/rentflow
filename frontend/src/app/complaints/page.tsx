'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useProtectedRoute } from '@/context/useProtectedRoute';

interface Complaint {
  _id: string;
  message: string;
  targetId: string;
  targetType: 'user' | 'property';
  status: string;
  createdAt: string;
}

export default function ComplaintsPage() {
    
    useProtectedRoute(['tenant', 'landlord', 'admin']);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints/my');
      setComplaints(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке жалоб', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/complaints/my/${id}`);
      setComplaints((prev) => prev.filter((c) => c._id !== id));
      alert('Жалоба удалена');
    } catch {
      alert('Ошибка при удалении');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">В ожидании</span>;
      case 'in_review':
        return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">В обработке</span>;
      case 'resolved':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">Решено</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Отклонено</span>;
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-10 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 border-b border-gray-300 dark:border-gray-700 pb-3">
          Мои жалобы
        </h1>

        {complaints.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Вы ещё не подавали жалобы.</p>
        ) : (
          <div className="space-y-6">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">
                      Объект: {c.targetType.toUpperCase()} • ID: {c.targetId}
                    </p>
                    <p className="text-base text-gray-800 dark:text-gray-100 mb-2">
                      {c.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      Дата подачи: {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right space-y-2">
                    {getStatusBadge(c.status)}
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="block text-sm text-red-600 hover:underline"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
