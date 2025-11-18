'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-800">
      {/* HERO */}
      <section className="bg-gray-900 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-4">RentFlow</h1>
        <p className="text-xl mb-6 text-gray-300">Современная платформа для управления арендой недвижимости</p>
        <Link
          href="/properties"
          className="bg-white text-gray-900 font-medium px-6 py-3 rounded hover:bg-gray-200 transition"
        >
          Начать поиск
        </Link>
      </section>

      {/* КАК ЭТО РАБОТАЕТ */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">1. Зарегистрируйтесь</h3>
              <p className="text-gray-600">Создайте аккаунт как арендатор или владелец. Получите доступ к своему кабинету.</p>
            </div>
            <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">2. Работайте с недвижимостью</h3>
              <p className="text-gray-600">Публикуйте объекты, подавайте заявки, управляйте арендами и жалобами.</p>
            </div>
            <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
              <h3 className="text-xl font-semibold mb-2">3. Общайтесь и платите</h3>
              <p className="text-gray-600">Используйте встроенный чат, оплачивайте аренду, и контролируйте процесс.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white border-t border-gray-200 text-center">
        <h2 className="text-2xl font-bold mb-4">Готовы начать?</h2>
        <p className="text-gray-600 mb-6">Создайте аккаунт и получите полный контроль над арендой.</p>
        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Регистрация
          </Link>
          <Link
            href="/login"
            className="border border-blue-600 text-blue-600 px-5 py-2 rounded hover:bg-blue-50 transition"
          >
            Войти
          </Link>
        </div>
      </section>
    </div>
  );
}
