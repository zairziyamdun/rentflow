import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function useProtectedRoute(allowedRoles?: string[]) {
  const { user,} = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Если ещё загружаем данные пользователя
    if (user === undefined) {
        return;
    }
    // Не вошёл
    if (!user) {
      router.replace('/login');
    }

    // Роль не разрешена
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/');
    }
  }, [user, allowedRoles, router]);
}
