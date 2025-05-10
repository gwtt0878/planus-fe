import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ScheduleWithMembers } from '@/types/schedule';
import { API } from '@/config/api';

interface UseScheduleProps {
  scheduleId?: number;
  onError?: () => void;
}

export function useSchedule({ scheduleId, onError }: UseScheduleProps = {}) {
  const [schedule, setSchedule] = useState<ScheduleWithMembers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchSchedule = useCallback(async () => {
    if (!scheduleId) return;

    try {
      const response = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.SCHEDULE.DETAIL(scheduleId)}`
      );

      if (response.ok) {
        const data = await response.json();
        setSchedule(data);
        console.log(data);
      } else {
        alert('일정을 불러오는데 실패했습니다.');
        if (onError) {
          onError();
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('일정 조회 에러:', error);
      alert('일정 조회 중 오류가 발생했습니다.');
      if (onError) {
        onError();
      } else {
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  }, [scheduleId, router, onError]);

  return {
    schedule,
    setSchedule,
    isLoading,
    fetchSchedule,
  };
}
