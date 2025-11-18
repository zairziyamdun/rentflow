'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Введите email и пароль');
      return;
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token);
    } catch {
      setError('Аккаунт не найден или данные неверны');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Вход в систему
        </h1>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300 px-4 py-2 rounded mb-4 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="example@mail.com"
              className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
