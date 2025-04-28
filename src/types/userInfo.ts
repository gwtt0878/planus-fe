import { Schedule } from './schedule';

export interface UserInfo {
  id: number;
  nickname: string;
  email: string;

  schedules: Schedule[];
}
