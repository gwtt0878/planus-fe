'use client';

import { useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { API } from '@/config/api';
import SelectedMembers from '@/components/SelectedMembers';
import { useSchedule } from '@/hooks/useSchedule';

export default function ScheduleDetail() {
  const router = useRouter();
  const { userId, nickname, token } = useAuthStore();
  const params = useParams<{ id: string }>();
  const { schedule, isLoading, fetchSchedule } = useSchedule({
    scheduleId: Number(params.id),
  });

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleEdit = useCallback(() => {
    router.push(`/schedule/edit/${params.id}`);
  }, [router, params.id]);

  const handleDelete = useCallback(async () => {
    if (!confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.SCHEDULE.DELETE(Number(params.id))}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        }
      );

      if (response.ok) {
        alert('일정이 삭제되었습니다.');
        router.push('/dashboard');
      } else {
        alert('일정 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('일정 삭제 에러:', error);
      alert('일정 삭제 중 오류가 발생했습니다.');
    }
  }, [params.id, userId, router]);

  const handleBack = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="card text-center">
            <div className="loading-spinner"></div>
            <p className="loading-text">일정을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="card text-center">
            <p className="section-content">일정을 찾을 수 없습니다.</p>
            <button onClick={handleBack} className="btn-primary mt-4">
              대시보드로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="content-container">
        <div className="card">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-3xl font-extrabold text-gray-900">
                {schedule.title}
              </h2>
              <h6 className="text-right text-gray-500">
                {schedule.creatorNickname}
              </h6>
            </div>
            <div className="flex space-x-2">
              {schedule.creatorNickname === nickname && (
                <>
                  <button onClick={handleEdit} className="btn-primary">
                    수정
                  </button>
                  <button onClick={handleDelete} className="btn-danger">
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mx-auto max-w-2xl p-4">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="form-container">
                <div>
                  <h3 className="section-title">설명</h3>
                  <p className="section-content whitespace-pre-wrap">
                    {schedule.description}
                  </p>
                </div>

                <div>
                  <h3 className="section-title">일정 시간</h3>
                  <p className="section-content">
                    {new Date(schedule.meetingDateTime).toLocaleString(
                      'ko-KR',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="section-title">장소</h3>
                  <p className="section-content">{schedule.meetingPlace}</p>
                </div>

                <div>
                  <h3 className="section-title">참가자</h3>
                  <SelectedMembers
                    members={schedule.members}
                    currentUserId={userId}
                  />
                </div>
              </div>

              <div className="mt-8">
                <button onClick={handleBack} className="btn-secondary w-full">
                  대시보드로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
