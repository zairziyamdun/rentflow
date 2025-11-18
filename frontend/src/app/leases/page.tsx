'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useProtectedRoute } from '@/context/useProtectedRoute';

interface Payment {
  _id: string;
  amount: number;
  dueDate: string;
  paid: boolean;
  paidAt?: string;
}

interface Lease {
  _id: string;
  startDate: string;
  endDate?: string;
  propertyId: {
    title: string;
    address: string;
    price: number;
  };
  payments: Payment[];
}

export default function LeasesPage() {
    useProtectedRoute(['tenant']);
  const [leases, setLeases] = useState<Lease[]>([]);

  const fetchLeases = async () => {
    try {
      const res = await api.get('/leases');
      setLeases(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке аренд', err);
    }
  };

  const handlePay = async (paymentId: string) => {
    try {
      await api.post(`/payments/${paymentId}/pay`);
      fetchLeases();
    } catch {
      alert('Ошибка при оплате');
    }
  };

  useEffect(() => {
    fetchLeases();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-10 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 border-b border-gray-300 dark:border-gray-700 pb-3">
          Мои аренды
        </h1>

        {leases.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Аренда пока не найдена.</p>
        ) : (
          leases.map((lease) => (
            <div
              key={lease._id}
              className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">
                {lease.propertyId.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {lease.propertyId.address} • {lease.propertyId.price.toLocaleString()} ₸ / мес
              </p>

              <div className="space-y-3">
                {lease.payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3"
                  >
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Срок оплаты: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                      {payment.paid ? (
                        <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                          Оплачено: {new Date(payment.paidAt!).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full">
                          Не оплачено
                        </span>
                      )}
                    </div>

                    {!payment.paid && (
                      <button
                        onClick={() => handlePay(payment._id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                      >
                        Оплатить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
