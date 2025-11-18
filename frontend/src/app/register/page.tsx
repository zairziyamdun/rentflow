
'use client';

import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Пожалуйста, заполните все поля');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Некорректный формат email');
      return false;
    }
    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError('');
    if (!validate()) return;

    try {
      await api.post('/auth/register', { name, email, password });
      router.push('/login');
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Ошибка регистрации';

      if (
        message.toLowerCase().includes('email') &&
        message.toLowerCase().includes('используется')
      ) {
        setError('Этот email уже зарегистрирован');
      } else {
        setError(message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Создание аккаунта
        </h1>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300 px-4 py-2 rounded border border-red-200 dark:border-red-800 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Повторите пароль"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleRegister}
            className="w-full py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}
