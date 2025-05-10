import { User } from './user';

export interface Schedule {
  id?: number;
  title: string;
  description: string;
  meetingDateTime: string;
  meetingPlace: string;
  creatorNickname: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleWithMembers extends Schedule {
  members: ScheduleMember[];
}

export interface ScheduleMember {
  memberId: number;
  nickname: string;
  email: string;
}
