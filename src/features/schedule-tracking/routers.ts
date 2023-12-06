import type { RouteRecordRaw } from 'vue-router';
import ScheduleTrackingPage from './pages/ScheduleTrackingPage.vue';
import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/schedule-tracking',
    component: MainLayout,
    children: [
      {
        path: '',
        name: PageName.SCHEDULE_TRACKING_PAGE,
        component: ScheduleTrackingPage,
        meta: {
          requiresAuth: true,
          role: ['schedule.view', 'schedule.viewPersonal'],
        },
      },
    ],
  },
];

export default routes;
