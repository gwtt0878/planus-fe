'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Schedule } from '@/types/schedule';
import { useAuthStore } from '@/store/authStore';
import { API } from '@/config/api';

export default function DashboardPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const router = useRouter();
  const { isLoggedIn, nickname } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchSchedules();
  }, [isLoggedIn, router]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.SCHEDULE.LIST}`
      );

      if (response.ok) {
        const data = await response.json();
        setSchedules(data.schedules);
      } else {
        alert('일정을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('일정 조회 에러:', error);
      alert('일정 조회 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.SCHEDULE.DELETE(id)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (response.ok) {
        alert('일정이 삭제되었습니다.');
        fetchSchedules();
      } else {
        alert('일정 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('일정 삭제 에러:', error);
      alert('일정 삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900">일정 관리</h1>
          <button
            onClick={() => router.push('/schedule/new')}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            일정 추가
          </button>
        </div>

        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <li key={schedule.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="truncate text-lg font-medium text-indigo-600">
                        {schedule.title}
                      </p>
                      <div className="ml-2 text-sm text-gray-400">
                        {schedule.creatorNickname}
                      </div>
                    </div>
                    <div className="ml-2 flex flex-shrink-0 gap-4">
                      <button
                        onClick={() => router.push(`/schedule/${schedule.id}`)}
                        className="rounded-md border border-indigo-600 px-2 py-1 font-medium text-gray-600 hover:text-indigo-500"
                      >
                        상세보기
                      </button>
                      {schedule.creatorNickname === nickname && (
                        <button
                          onClick={() =>
                            router.push(`/schedule/edit/${schedule.id}`)
                          }
                          className="rounded-md border border-indigo-600 px-2 py-1 font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          수정
                        </button>
                      )}
                      {schedule.creatorNickname === nickname && (
                        <button
                          onClick={() => handleDelete(schedule.id!)}
                          className="rounded-md border border-red-600 px-2 py-1 font-medium text-red-600 hover:text-red-500"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {schedule.description}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        {formatDateTime(schedule.meetingDateTime)} 에 예약된
                        일정입니다.
                      </p>
                    </div>
                  </div>
                  {schedule.meetingPlace && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        장소: {schedule.meetingPlace}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
