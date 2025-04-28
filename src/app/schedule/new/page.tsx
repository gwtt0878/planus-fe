'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ScheduleWithMembers } from '@/types/schedule';
import { useAuthStore } from '@/store/authStore';
import React from 'react';
import { API } from '@/config/api';
interface User {
  id: number;
  email: string;
  nickname: string;
}

interface ScheduleJSON {
  title: string;
  description: string;
  meetingDateTime: string;
  meetingPlace: string;
  memberIds: number[];
}

export default function CreateSchedule() {
  const {
    userId: currentUserId,
    nickname: currentNickname,
    email: currentEmail,
  } = useAuthStore();

  const [schedule, setSchedule] = useState<ScheduleWithMembers>({
    title: '',
    description: '',
    meetingDateTime: '',
    meetingPlace: '',
    members: [
      { id: currentUserId, email: currentEmail, nickname: currentNickname },
    ],
    creatorNickname: currentNickname,
    createdAt: '',
    updatedAt: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.USER.SEARCH}?nickname=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${currentUserId}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setSchedule((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
    },
    []
  );

  const handleAddUser = useCallback(
    (user: User) => {
      if (!schedule.members.some((m) => m.id === user.id)) {
        setSchedule((prev) => ({
          ...prev,
          members: [...prev.members, user].sort((a, b) =>
            a.nickname.localeCompare(b.nickname)
          ),
        }));
      }
      setSearchQuery('');
      setSearchResults([]);
    },
    [schedule.members]
  );

  const handleRemoveUser = useCallback(
    (userId: number) => {
      setSchedule((prev) => ({
        ...prev,
        members: prev.members.filter((m) => m.id !== userId),
      }));
    },
    [schedule.members]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        // 일정 생성
        const scheduleJSON: ScheduleJSON = {
          title: schedule.title,
          description: schedule.description,
          meetingDateTime: schedule.meetingDateTime,
          meetingPlace: schedule.meetingPlace,
          memberIds: schedule.members.map((m) => m.id),
        };
        const scheduleResponse = await fetch(
          `${API.BASE_URL}${API.ENDPOINTS.SCHEDULE.CREATE}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${currentUserId}`,
            },
            credentials: 'include',
            body: JSON.stringify(scheduleJSON),
          }
        );

        if (!scheduleResponse.ok) {
          throw new Error('일정 생성에 실패했습니다.');
        }

        alert('일정이 생성되었습니다.');
        router.push('/dashboard');
      } catch (error) {
        console.error('일정 생성 에러:', error);
        alert('일정 생성 중 오류가 발생했습니다.');
      }
    },
    [schedule, currentUserId, router]
  );

  const handleCancel = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const pageTitle = useMemo(() => '새 일정 추가', []);
  const submitButtonText = useMemo(() => '일정 추가', []);

  return (
    <div className="page-container animate-fade-in">
      <div className="content-container">
        <div className="card">
          <h2 className="mb-8 text-3xl font-extrabold text-gray-900">
            {pageTitle}
          </h2>

          <form onSubmit={handleSubmit} className="form-container">
            <div>
              <label htmlFor="title" className="label">
                제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={schedule.title}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="description" className="label">
                설명
              </label>
              <textarea
                id="description"
                name="description"
                value={schedule.description}
                onChange={handleInputChange}
                rows={4}
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="meetingDateTime" className="label">
                일정 시간
              </label>
              <input
                type="datetime-local"
                id="meetingDateTime"
                name="meetingDateTime"
                value={schedule.meetingDateTime}
                onChange={handleInputChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="meetingPlace" className="label">
                장소
              </label>
              <input
                type="text"
                id="meetingPlace"
                name="meetingPlace"
                value={schedule.meetingPlace}
                onChange={handleInputChange}
                className="input-field"
                placeholder="장소를 입력하세요"
              />
            </div>

            <div>
              <label className="label">참가자 추가</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
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

              {schedule.members.length > 0 && (
                <div className="mt-4">
                  <h3 className="section-title">선택된 참가자</h3>
                  <ul className="mt-2 space-y-2">
                    {schedule.members.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-2"
                      >
                        <span>{user.nickname}</span>
                        {user.id !== currentUserId && (
                          <button
                            type="button"
                            onClick={() => handleRemoveUser(user.id)}
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
              <button type="submit" className="btn-primary flex-1">
                {submitButtonText}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex-1"
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
