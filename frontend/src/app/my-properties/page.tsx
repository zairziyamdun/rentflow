'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import UploadUI from '@/components/UploadUI';

interface Property {
  _id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  images?: string[];
  available: boolean;
  ownerId: string;
}

const defaultForm = {
  title: '',
  address: '',
  price: '',
  type: 'apartment',
  images: [] as string[],
};

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [resetUploadTrigger, setResetUploadTrigger] = useState(false);

  const fetchMyProperties = async () => {
    try {
      const res = await api.get<Property[]>('/properties/my');
      setProperties(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке объектов', err);
    }
  };

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        price: +form.price,
      };

      if (editingId) {
        await api.put(`/properties/${editingId}`, payload);
      } else {
        await api.post('/properties', payload);
      }

      setForm(defaultForm);
      setEditingId(null);
      setResetUploadTrigger(true);
      setTimeout(() => setResetUploadTrigger(false), 300);
      fetchMyProperties();
    } catch {
      alert('Ошибка при сохранении');
    }
  };

  const handleEdit = (p: Property) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      address: p.address,
      price: String(p.price),
      type: p.type,
      images: p.images || [],
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить объект?')) return;
    try {
      await api.delete(`/properties/${id}`);
      fetchMyProperties();
    } catch {
      alert('Ошибка при удалении');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-10">
        <main className="max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8 border-b pb-2 border-gray-300 dark:border-gray-700">
            Мои объекты
            </h1>

            {/* Форма */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-sm mb-10 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {editingId ? 'Редактировать объект' : 'Добавить объект'}
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
                <input
                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
                placeholder="Название"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
                placeholder="Адрес"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <input
                type="number"
                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
                placeholder="Цена в месяц"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <select
                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                <option value="apartment">Квартира</option>
                <option value="house">Дом</option>
                <option value="room">Комната</option>
                </select>
            </div>

            <UploadUI
                onUploadComplete={(urls) => setForm((f) => ({ ...f, images: urls }))}
                setUploading={setUploading}
                clearTrigger={resetUploadTrigger}
            />

            <button
                onClick={handleSave}
                disabled={isUploading}
                className={`px-4 py-2 rounded font-medium text-white ${
                isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } transition`}
            >
                {editingId ? 'Сохранить' : 'Добавить'}
            </button>
            </div>

            {/* Список объектов */}
            <div className="space-y-6">
            {properties.map((p) => (
                <div
                key={p._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-5 transition hover:shadow-md"
                >
                <div className="grid sm:grid-cols-4 gap-4">
                    <div className="col-span-1 flex gap-2 overflow-x-auto">
                    {p.images?.length ? (
                        p.images.map((url, idx) => (
                        <img
                            key={idx}
                            src={url}
                            alt={`Фото ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded border"
                        />
                        ))
                    ) : (
                        <div className="text-gray-400 text-sm">Нет изображений</div>
                    )}
                    </div>

                    <div className="col-span-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                        <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                            p.available
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                        >
                        {p.available ? 'Доступен' : 'Сдан'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{p.address}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        {p.price} ₸ / мес • {p.type}
                    </p>

                    <div className="flex gap-4 mt-3">
                        <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                        Редактировать
                        </button>
                        <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-600 dark:text-red-400 hover:underline text-sm"
                        >
                        Удалить
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </main>
    </div>
 );
}