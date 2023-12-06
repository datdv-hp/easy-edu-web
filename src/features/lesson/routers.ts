import type { RouteRecordRaw } from 'vue-router';
import LessonListPage from './pages/lesson-list/LessonListPage.vue';
import LessonDetailPage from './pages/lesson-detail/LessonDetailPage.vue';
import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/lesson',
    component: MainLayout,
    children: [
      {
        path: '',
        name: PageName.LESSON_LIST_PAGE,
        component: LessonListPage,
        meta: {
          requiresAuth: true,
          role: ['lesson.view', 'lesson.viewPersonal'],
        },
      },
      {
        path: 'detail/:id',
        name: PageName.LESSON_DETAIL_PAGE,
        component: LessonDetailPage,
        meta: {
          requiresAuth: true,
          role: ['lesson.viewPersonal', 'lesson.view'],
        },
      },
    ],
  },
];

export default routes;
