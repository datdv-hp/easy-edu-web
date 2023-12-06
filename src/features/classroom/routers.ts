import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import type { RouteRecordRaw } from 'vue-router';
import ClassroomDetailPage from './pages/classroom-detail/ClassroomDetailPage.vue';
import ClassroomListPage from './pages/classroom-list/ClassroomListPage.vue';
import ClassroomSyllabusListPage from './pages/classroom-syllabus/ClassroomSyllabusListPage.vue';
import ClassroomTimekeepingPage from './pages/classroom-timekeeping/ClassroomTimekeepingPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/classroom',
    component: MainLayout,
    children: [
      {
        path: '',
        name: PageName.CLASSROOM_LIST_PAGE,
        component: ClassroomListPage,
        meta: {
          requiresAuth: true,
          role: ['classroom.view', 'classroom.viewPersonal'],
        },
      },
      {
        path: 'detail/:id',
        name: PageName.CLASSROOM_DETAIL_PAGE,
        component: ClassroomDetailPage,
        meta: {
          requiresAuth: true,
          role: 'classroom.detailBasic',
        },
      },
      {
        path: 'detail/:id/syllabus',
        name: PageName.CLASSROOM_SYLLABUS_LIST_PAGE,
        component: ClassroomSyllabusListPage,
        meta: {
          requiresAuth: true,
          role: 'classroom.viewSyllabus',
        },
      },
      {
        path: ':id/timekeeping',
        name: PageName.CLASSROOM_TIMEKEEPING_PAGE,
        component: ClassroomTimekeepingPage,
        meta: {
          requiresAuth: true,
          role: ['classroom.viewTimeKeeping', 'classroom.viewAttendance'],
        },
      },
    ],
  },
];

export default routes;
