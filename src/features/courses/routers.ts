import { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import CoursesListPage from './pages/courses-list/CoursesListPage.vue';
import CourseDetailPage from './pages/course-detail/CourseDetailPage.vue';
import { PageName } from '@/common/constants';

const coursesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/courses',
    component: MainLayout,
    children: [
      {
        path: '',
        component: CoursesListPage,
        name: PageName.COURSE_LIST_PAGE,
        meta: {
          requiresAuth: true,
          role: ['course.view', 'course.viewPersonal'],
        },
      },
      {
        path: 'detail/:id',
        name: PageName.COURSE_DETAIL_PAGE,
        component: CourseDetailPage,
        meta: {
          requiresAuth: true,
          role: 'course.detailBasic',
        },
      },
    ],
  },
];

export default coursesRoutes;
