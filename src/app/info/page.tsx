'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/app/globals.css';
import { useAuthStore } from '@/store/authStore';
import { UserInfo } from '@/types/userInfo';
import { API } from '@/config/api';

export default function InfoPage() {
  const { nickname, userId } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState<UserInfo | null>(null);
  const { token } = useAuthStore();

  const fetchInfo = useCallback(async () => {
    if (!nickname) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.USER.MY_INFO}?nickname=${nickname}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );
      if (response.ok) {
        const data = await response.json();
        setInfo(data);
      } else {
        alert('회원 정보를 불러오는데 실패했습니다.');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      alert('회원 정보를 불러오는데 실패했습니다.');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }, [nickname, userId, router]);

  useEffect(() => {
    fetchInfo();
  }, [fetchInfo]);

  if (isLoading || !info) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-gray-600">회원 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-lg bg-white p-6 shadow">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {info.nickname}
            </h2>
          </div>
          <div className="text-gray-600"> {info.email}</div>
          <div className="text-gray-600"> {info.nickname}</div>
          <div className="text-gray-600"> {info.schedules.length}개의 일정</div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-gray-900">일정</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {info.schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="cursor-pointer rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg"
                onClick={() => router.push(`/schedule/${schedule.id}`)}
              >
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-800">
                    {schedule.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-500">
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(schedule.meetingDateTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{schedule.meetingPlace}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
