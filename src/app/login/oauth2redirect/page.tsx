'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function OAuth2RedirectPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const payload = JSON.parse(atob(token.split('.')[1]));

    login(payload.sub, payload.nickname, payload.email, token);
    router.push('/dashboard');
  }, [login, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-2xl font-bold">로그인 중입니다...</div>
    </div>
  );
}
