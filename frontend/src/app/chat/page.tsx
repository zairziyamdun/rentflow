'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useProtectedRoute } from '@/context/useProtectedRoute';

interface LeaseChatInfo {
  _id: string;
  tenantId: { _id: string; name: string };
  propertyId: { _id: string; title: string; ownerId: string };
}

export default function ChatListPage() {
    useProtectedRoute(['tenant', 'landlord', 'admin']);
  const { user } = useAuth();
  const [chats, setChats] = useState<LeaseChatInfo[]>([]);

  useEffect(() => {
    api.get('/leases/my-chats').then((res) => {
      const filtered = res.data.filter((l: LeaseChatInfo) =>
        l.tenantId &&
        l.propertyId &&
        (l.tenantId._id === user?.id || l.propertyId.ownerId === user?.id)
      );
      setChats(filtered);
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-10 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 border-b border-gray-300 dark:border-gray-700 pb-3">
          Мои чаты
        </h1>

        {chats.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Нет активных чатов по аренде.</p>
        ) : (
          <div className="space-y-4">
            {chats.map((lease) => (
              <Link
                key={lease._id}
                href={`/chat/${lease._id}`}
                className="block bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {lease.propertyId.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Чат по аренде с {lease.tenantId.name}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
