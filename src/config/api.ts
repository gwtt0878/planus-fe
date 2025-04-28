export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  ENDPOINTS: {
    USER: {
      LOGIN: '/user/login',
      REGISTER: '/user/register',
      MY_INFO: '/user/myinfo',
      SEARCH: '/user/search',
    },
    SCHEDULE: {
      LIST: '/schedule',
      DETAIL: (id: number) => `/schedule/${id}`,
      CREATE: '/schedule',
      UPDATE: (id: number) => `/schedule/${id}`,
      DELETE: (id: number) => `/schedule/${id}`,
    },
  },
} as const;
