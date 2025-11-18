
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useProtectedRoute } from '@/context/useProtectedRoute';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'landlord' | 'admin';
}

export default function AdminUsersPage() {
    useProtectedRoute(['admin']);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch {
      alert('Ошибка при загрузке пользователей');
    }
  };

  const handleRoleChange = async (id: string, role: User['role']) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      fetchUsers();
    } catch {
      alert('Ошибка при обновлении роли');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить пользователя полностью?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch  {
      alert('Ошибка при удалении');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
  <main className="min-h-screen bg-gray-900 px-4 py-8">
    <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
      👥 Пользователи системы
    </h1>

    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="bg-gray-800 p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <p className="text-lg font-bold text-white">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user._id, e.target.value as User['role'])}
              className="px-3 py-1 border border-gray-600 rounded bg-gray-700 text-sm text-white"
            >
              <option value="user">👤 Пользователь</option>
              <option value="landlord">🏠 Владелец</option>
              <option value="admin">🛠️ Админ</option>
            </select>

            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded flex items-center gap-1"
            >
              🗑 Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  </main>
);

}
