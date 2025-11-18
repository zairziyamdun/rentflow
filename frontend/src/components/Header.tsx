'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const navItems = () => {
    if (!user) return [];

    const base: { href: string; label: string }[] = [];

    if (user.role === 'tenant') {
      base.push(
        { href: '/properties', label: 'Объекты' },
        { href: '/applications', label: 'Мои заявки' },
        { href: '/leases', label: 'Аренда' },
        { href: '/complaints', label: 'Жалобы' },
        { href: '/chat', label: 'Чат' }
      );
    }

    if (user.role === 'landlord') {
      base.push(
        { href: '/my-properties', label: 'Мои объекты' },
        { href: '/applications/received', label: 'Заявки' },
        { href: '/leases/managed', label: 'Аренда' },
        { href: '/complaints', label: 'Жалобы' },
        { href: '/chat', label: 'Чат' }
      );
    }

    if (user.role === 'admin') {
      base.push(
        { href: '/admin/users', label: 'Пользователи' },
        { href: '/admin/complaints', label: 'Жалобы' },
        { href: '/admin/properties', label: 'Объекты' }
      );
    }

    return base;
  };

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400 hover:opacity-90 transition"
        >
          RentFlow
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4 flex-wrap">
          {navItems().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition px-3 py-1 rounded-md"
            >
              {item.label}
            </Link>
          ))}

          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition"
              >
                Регистрация
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {user.name}{' '}
                <span className="text-xs text-gray-400 italic">({user.role})</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white rounded-md transition"
              >
                Выйти
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
