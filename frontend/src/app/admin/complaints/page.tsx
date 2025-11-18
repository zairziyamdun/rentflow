'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useProtectedRoute } from '@/context/useProtectedRoute';

interface Complaint {
  _id: string;
  message: string;
  createdAt: string;
  status: string;
  targetType: 'user' | 'property';
  userId: {
    name: string;
    email: string;
  };
  targetId: {
    title?: string;
    address?: string;
    name?: string;
    email?: string;
  };
}

export default function AdminComplaintsPage() {
     useProtectedRoute(['admin']);
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/admin/complaints');
      setComplaints(res.data);
    } catch {
      alert('Ошибка при загрузке жалоб');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить жалобу?')) return;
    try {
      await api.delete(`/admin/complaints/${id}`);
      fetchComplaints();
    } catch {
      alert('Ошибка при удалении жалобы');
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-10 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 border-b border-gray-300 dark:border-gray-700 pb-3">
          Жалобы пользователей
        </h1>

        <div className="space-y-6">
          {complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition"
            >
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                  Цель: {c.targetType === 'property' ? 'Недвижимость' : 'Пользователь'}
                </h2>

                {c.targetType === 'property' && c.targetId?.title ? (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{c.targetId.title}</p>
                    <p>{c.targetId.address}</p>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">{c.targetId?.name}</p>
                    <p>{c.targetId?.email}</p>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                <span className="font-medium">Текст жалобы:</span> {c.message}
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Отправитель: {c.userId.name} ({c.userId.email}) • {new Date(c.createdAt).toLocaleDateString()}
              </div>

              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    c.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : c.status === 'in_review'
                      ? 'bg-blue-100 text-blue-800'
                      : c.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {c.status === 'pending'
                    ? 'В ожидании'
                    : c.status === 'in_review'
                    ? 'В обработке'
                    : c.status === 'resolved'
                    ? 'Решено'
                    : 'Отклонено'}
                </span>
              </div>

              <button
                onClick={() => handleDelete(c._id)}
                className="text-sm text-red-600 hover:underline"
              >
                Удалить жалобу
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
