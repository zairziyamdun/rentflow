'use client';

import { useEffect, useCallback, useState } from 'react';
import api from '@/lib/axios';
import PropertyCard from '@/components/PropertyCard';
import { useAuth } from '@/context/AuthContext';

interface Property {
  _id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  images?: string[];
  description?: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { user } = useAuth();
  const [complainOpen, setComplainOpen] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState('');
  const [complainText, setComplainText] = useState('');

  const fetchProperties = useCallback(async () => {
    try {
      const res = await api.get<Property[]>('/properties', {
        params: {
          type: typeFilter || undefined,
          priceMin: minPrice || undefined,
          priceMax: maxPrice || undefined,
        },
      });
      setProperties(res.data);
    } catch (err) {
      console.error('Ошибка загрузки объектов', err);
    }
  }, [typeFilter, minPrice, maxPrice]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleApply = async (propertyId: string) => {
    try {
      await api.post('/applications', { propertyId });
      alert('Заявка отправлена!');
    } catch {
      alert('Ошибка при отправке заявки');
    }
  };

  const handleOpenComplain = (propertyId: string) => {
    setCurrentPropertyId(propertyId);
    setComplainText('');
    setComplainOpen(true);
  };

  const handleSubmitComplain = async () => {
    if (!complainText.trim()) return alert('Введите текст жалобы');

    try {
      await api.post('/complaints', {
        targetId: currentPropertyId,
        targetType: 'property',
        message: complainText,
      });
      alert('Жалоба отправлена!');
      setComplainOpen(false);
    } catch {
      alert('Ошибка при жалобе');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10">
      <main className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Доступные объекты
        </h1>

        {/* Фильтр */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Мин. цена"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Макс. цена"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Тип жилья</option>
            <option value="apartment">Квартира</option>
            <option value="house">Дом</option>
            <option value="room">Комната</option>
          </select>
          <button
            onClick={fetchProperties}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            Применить
          </button>
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              onApply={user?.role === 'tenant' ? () => handleApply(property._id) : undefined}
              onOpenComplain={handleOpenComplain}
            />
          ))}
        </div>
      </main>

      {/* Модалка жалобы */}
      {complainOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Отправить жалобу</h2>
            <textarea
              rows={5}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
              placeholder="Опишите проблему, связанную с этим объектом"
              value={complainText}
              onChange={(e) => setComplainText(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setComplainOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmitComplain}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
