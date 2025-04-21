'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Schedule } from '@/types/schedule';
import { useAuthStore } from '@/store/authStore';

export default function CreateSchedule() {
  const [schedule, setSchedule] = useState<Schedule>({
    title: '',
    description: '',
    meetingDateTime: new Date().toISOString(),
    meetingPlace: '',
  });
  const router = useRouter();
  const { userId } = useAuthStore();

  const handleInputChange = useCallback((field: keyof Schedule) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSchedule(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`,
        },
        credentials: 'include',
        body: JSON.stringify(schedule),
      });

      if (response.ok) {
        alert('일정이 추가되었습니다.');
        router.push('/dashboard');
      } else {
        alert('일정 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('일정 저장 에러:', error);
      alert('일정 저장 중 오류가 발생했습니다.');
    }
  }, [schedule, userId, router]);

  const handleCancel = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            일정 추가
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                제목
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={schedule.title}
                onChange={handleInputChange('title')}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                설명
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={schedule.description}
                onChange={handleInputChange('description')}
              />
            </div>

            <div>
              <label htmlFor="meetingDateTime" className="block text-sm font-medium text-gray-700">
                일정 시간
              </label>
              <input
                type="datetime-local"
                id="meetingDateTime"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={schedule.meetingDateTime}
                onChange={handleInputChange('meetingDateTime')}
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                장소
              </label>
              <input
                type="text"
                id="location"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={schedule.meetingPlace}
                onChange={handleInputChange('meetingPlace')}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                추가
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 