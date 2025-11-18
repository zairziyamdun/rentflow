'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useProtectedRoute } from '@/context/useProtectedRoute';

interface Property {
  _id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  available: boolean;
  ownerId: {
    name: string;
    email: string;
  };
}

export default function AdminPropertiesPage() {
  useProtectedRoute(['admin']);
  const [properties, setProperties] = useState<Property[]>([]);
  const router = useRouter();

  const fetchProperties = async () => {
    try {
      const res = await api.get('/properties');
      setProperties(res.data);
    
    } catch {
      alert('Ошибка при загрузке объектов');
      router.push('/'); 
      
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить объект?')) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      fetchProperties();
    } catch {
      alert('Ошибка при удалении');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 px-4 py-10 text-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 border-b border-gray-300 dark:border-gray-700 pb-3">
          Все объекты недвижимости
        </h1>

        <div className="space-y-6">
          {properties.map((p) => (
            <div
              key={p._id}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{p.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{p.address}</p>

                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full">
                      Цена: {p.price.toLocaleString()} ₸
                    </span>
                    <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                      Тип: {p.type}
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full ${
                        p.available
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {p.available ? 'Доступен' : 'Сдан'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Владелец: {p.ownerId.name} ({p.ownerId.email})
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-sm text-red-600 hover:underline self-start md:self-auto"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
