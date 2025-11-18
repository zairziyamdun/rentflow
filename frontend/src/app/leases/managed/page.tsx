'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Lease {
  _id: string;
  startDate: string;
  tenantId: {
    name: string;
    email: string;
  };
  propertyId: {
    title: string;
    address: string;
    price: number;
  };
  payments: {
    _id: string;
    amount: number;
    dueDate: string;
    paid: boolean;
    paidAt?: string;
  }[];
}

export default function ManagedLeasesPage() {
    const [leases, setLeases] = useState<Lease[]>([]);

  const fetchLeases = async () => {
    try {
      const res = await api.get('/leases');
      setLeases(res.data);
    } catch (err) {
      console.error('Ошибка при получении аренд', err);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Вы уверены, что хотите отменить аренду?')) return;
    try {
      await api.delete(`/leases/${id}`);
      fetchLeases();
    } catch {
      alert('Ошибка при отмене');
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10 px-4">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Арендаторы и аренды
        </h1>

        {leases.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Пока нет активных аренд.</p>
        ) : (
          <div className="space-y-6">
            {leases.map((lease) => (
              <div
                key={lease._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md p-6"
              >
                <div className="mb-3">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {lease.propertyId.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lease.propertyId.address} • {lease.propertyId.price} ₸/мес
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Арендатор: {lease.tenantId.name} ({lease.tenantId.email})
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    С {new Date(lease.startDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  {lease.payments.map((payment) => (
                    <div
                      key={payment._id}
                      className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2"
                    >
                      <span className="text-sm text-gray-800 dark:text-gray-300">
                        {new Date(payment.dueDate).toLocaleDateString()} — {payment.amount} ₸
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          payment.paid ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {payment.paid
                          ? `Оплачено ${new Date(payment.paidAt!).toLocaleDateString()}`
                          : 'Не оплачено'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex gap-4">
                  <button
                    onClick={() => handleCancel(lease._id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition"
                  >
                    ❌ Отменить аренду
                  </button>
                  <a
                    href={`/chat/${lease._id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                  >
                    💬 Открыть чат
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
