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
  members: User[];
}

export interface User {
  id: number;
  nickname: string;
  email: string;
}
