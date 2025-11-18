'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ChatBox from '@/components/ChatBox';

export default function ChatPage() {
  const { leaseId } = useParams();
  const { user } = useAuth();
  console.log(user);

  if (!user) {
    return <p className="text-center py-10 text-red-600">Требуется вход в систему для чата.</p>;
  }

  if (!leaseId || typeof leaseId !== 'string') {
    return <p className="text-center py-10 text-red-600">Чат недоступен. leaseId отсутствует.</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Переписка по аренде
      </h1>

      <ChatBox leaseId={leaseId} userId={user.id} userName={user.name} />
    </main>
  );
}
