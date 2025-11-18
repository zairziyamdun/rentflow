import React, { useState } from 'react';

interface PropertyCardProps {
  property: {
    _id: string;
    title: string;
    address: string;
    price: number;
    type: string;
    images?: string[];
    description?: string;
  };
  onApply?: () => void;
  onOpenComplain?: (propertyId: string) => void;
}

export default function PropertyCard({ property, onApply, onOpenComplain }: PropertyCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (property.images && property.images.length > 0 ? (prev + 1) % property.images.length : 0));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (property.images && property.images.length > 0 ? (prev - 1 + property.images.length) % property.images.length : 0));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 transition-all hover:shadow-xl space-y-4">
      {/* Карусель изображений */}
      {property.images && property.images.length > 0 && (
        <div className="relative w-full overflow-hidden rounded-lg h-64">
          <img
            src={property.images[currentIndex]}
            alt={`Фото ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500 rounded-lg"
          />
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 p-2 rounded-full shadow hover:bg-white hover:scale-110 transition"
          >
            ❮
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 dark:bg-gray-700/70 p-2 rounded-full shadow hover:bg-white hover:scale-110 transition"
          >
            ❯
          </button>
        </div>
      )}

      {/* Информация */}
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{property.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{property.address}</p>
        <p className="text-sm text-gray-500 dark:text-gray-300">Тип: {property.type}</p>
        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{property.price} ₸ / мес</p>
      </div>

      {/* Кнопки действий */}
      <div className="space-y-2">
        {onApply && (
          <button
            onClick={onApply}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Подать заявку
          </button>
        )}
        {onOpenComplain && (
          <button
            onClick={() => onOpenComplain(property._id)}
            className="w-full border border-red-500 text-red-500 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900 transition"
          >
            Пожаловаться
          </button>
        )}
      </div>
    </div>
  );
}
