import { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import StudentListPage from './pages/student-list/StudentListPage.vue';
import { PageName } from '@/common/constants';
import StudentDetails from './pages/student-detail/StudentDetails.vue';
const studentRoutes: Array<RouteRecordRaw> = [
  {
    path: '/student',
    component: MainLayout,
    children: [
      {
        path: '',
        component: StudentListPage,
        name: PageName.STUDENT_LIST_PAGE,
        meta: {
          requiresAuth: true,
          role: 'student.view',
        },
      },
      {
        path: ':id',
        name: PageName.STUDENT_DETAIL_PAGE,
        component: StudentDetails,
        meta: {
          requiresAuth: true,
          role: 'student.view',
        },
      },
    ],
  },
];

export default studentRoutes;
