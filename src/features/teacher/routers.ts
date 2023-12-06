import type { RouteRecordRaw } from 'vue-router';
import TeacherListPage from './pages/teacher-list/TeacherListPage.vue';
import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import TeacherDetails from './pages/teacher-detail/TeacherDetails.vue';
import TimeKeepingPage from './pages/timekeeping/TimeKeepingPage.vue';

const teacherRouters: Array<RouteRecordRaw> = [
  {
    path: '/teacher',
    component: MainLayout,
    children: [
      {
        path: '',
        name: PageName.TEACHER_LIST_PAGE,
        component: TeacherListPage,
        meta: {
          requiresAuth: true,
          role: 'teacher.view',
        },
      },
      {
        path: 'detail/:id',
        name: PageName.TEACHER_DETAIL_PAGE,
        component: TeacherDetails,
        meta: {
          requiresAuth: true,
          role: 'teacher.view',
        },
      },
    ],
  },
  {
    path: '/teacher/timekeeping',
    component: MainLayout,
    children: [
      {
        path: '',
        name: PageName.TIMEKEEPING_PAGE,
        component: TimeKeepingPage,
        meta: {
          requiresAuth: true,
          role: ['timekeeping.view', 'timekeeping.viewPersonal'],
        },
      },
    ],
  },
];

export default teacherRouters;
