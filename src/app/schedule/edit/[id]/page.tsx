'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ScheduleWithMembers } from '@/types/schedule';
import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { API } from '@/config/api';

interface User {
  id: number;
  email: string;
  nickname: string;
}

export default function EditSchedule() {
  const [schedule, setSchedule] = useState<ScheduleWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const { userId: currentUserId, nickname: currentNickname } = useAuthStore();
  const params = useParams<{ id: string }>();

  const fetchSchedule = useCallback(async () => {
    try {
      const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.SCHEDULE.DETAIL(Number(params.id))}`
      );

      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
      } else {
        alert('일정을 불러오는데 실패했습니다.');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('일정 조회 에러:', error);
      alert('일정 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, currentUserId, router]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.USER.SEARCH}?nickname=${encodeURIComponent(query)}`
        );

        if (response.ok) {
          const data = await response.json();
          console.log('검색 결과:', data);
          setSearchResults(data.users);
        }
      } catch (error) {
        console.error('유저 검색 에러:', error);
      } finally {
        setIsSearching(false);
      }
    },
    [currentUserId]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleAddUser = useCallback(
    (user: User) => {
      if (!schedule?.members.some((m) => m.id === user.id)) {
        setSchedule((prev) =>
          prev
            ? {
                ...prev,
                members: [...prev.members, user].sort((a, b) =>
                  a.nickname.localeCompare(b.nickname)
                ),
              }
            : null
        );
      }
      setSearchQuery('');
      setSearchResults([]);
    },
    [schedule?.members]
  );

  const handleRemoveUser = useCallback((userId: number) => {
    setSchedule((prev) =>
      prev
        ? {
            ...prev,
            members: prev.members.filter((m) => m.id !== userId),
          }
        : null
    );
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!schedule) return;

      try {
        const scheduleJSON = {
          title: schedule.title,
          description: schedule.description,
          meetingDateTime: schedule.meetingDateTime,
          meetingPlace: schedule.meetingPlace,
          memberIds: schedule.members.map((m) => m.id),
        };

        const response = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.SCHEDULE.UPDATE(Number(params.id))}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(scheduleJSON),
          }
        );

        if (response.ok) {
          alert('일정이 수정되었습니다.');
          router.push('/dashboard');
        } else {
          throw new Error('일정 수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('일정 수정 에러:', error);
        alert('일정 수정 중 오류가 발생했습니다.');
      }
    },
    [schedule, params.id, currentUserId, router]
  );

  const handleCancel = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="loading-spinner mx-auto"></div>
              <p className="mt-2 text-gray-600">일정을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return null;
  }

  if (currentNickname !== schedule.creatorNickname) {
    alert('수정 권한이 없습니다.');
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
            일정 수정
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                제목
              </label>
              <input
                type="text"
                id="title"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={schedule?.title}
                onChange={(e) =>
                  setSchedule((prev) =>
                    prev ? { ...prev, title: e.target.value } : null
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                설명
              </label>
              <textarea
                id="description"
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={schedule?.description}
                onChange={(e) =>
                  setSchedule((prev) =>
                    prev ? { ...prev, description: e.target.value } : null
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="meetingDateTime"
                className="block text-sm font-medium text-gray-700"
              >
                일정 시간
              </label>
              <input
                type="datetime-local"
                id="meetingDateTime"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={schedule?.meetingDateTime}
                onChange={(e) =>
                  setSchedule((prev) =>
                    prev ? { ...prev, meetingDateTime: e.target.value } : null
                  )
                }
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                장소
              </label>
              <input
                type="text"
                id="location"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                value={schedule?.meetingPlace}
                onChange={(e) =>
                  setSchedule((prev) =>
                    prev ? { ...prev, meetingPlace: e.target.value } : null
                  )
                }
              />
            </div>

            <div>
              <label className="label">참가자 추가</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="닉네임으로 검색"
                  className="input-field"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
                    <div className="loading-spinner"></div>
                  </div>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className="mt-2 rounded-md border border-gray-300 bg-white shadow-lg">
                  <ul className="divide-y divide-gray-200">
                    {searchResults.map((user) => (
                      <li
                        key={user.id}
                        className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleAddUser(user)}
                      >
                        {user.nickname}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {schedule?.members && schedule.members.length > 0 && (
                <div className="mt-4">
                  <h3 className="section-title">선택된 참가자</h3>
                  <ul className="mt-2 space-y-2">
                    {schedule.members.map((member) => (
                      <li
                        key={member.id}
                        className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-2"
                      >
                        <span>{member.nickname}</span>
                        {member.id !== currentUserId && (
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(member.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ×
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                수정
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
