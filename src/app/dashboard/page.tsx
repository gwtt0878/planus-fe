'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Schedule } from '@/types/schedule';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const router = useRouter();
  const { userId, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    fetchSchedules();
  }, [isLoggedIn, router]);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://localhost:8080/schedule', {
        headers: {
          'Authorization': `Bearer ${userId}`,
        },
      });

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
      const response = await fetch(`http://localhost:8080/schedule/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userId}`,
        },
        credentials: 'include',
      });

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">일정 관리</h1>
          <button
            onClick={() => router.push('/schedule/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            일정 추가
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {schedules.map((schedule) => (
              <li key={schedule.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="h-4 w-4 rounded-full mr-3"
                        style={{ backgroundColor: '#3B82F6' }}
                      />
                      <p className="text-lg font-medium text-indigo-600 truncate">
                        {schedule.title}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => router.push(`/schedule/${schedule.id}`)}
                        className="font-medium text-indigo-600 hover:text-indigo-500 mr-4"
                      >
                        상세보기
                      </button>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <button
                        onClick={() => router.push(`/schedule/edit/${schedule.id}`)}
                        className="font-medium text-indigo-600 hover:text-indigo-500 mr-4"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(schedule.id!)}
                        className="font-medium text-red-600 hover:text-red-500"
                      >
                        삭제
                      </button>
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
                        {formatDateTime(schedule.meetingDateTime)}
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