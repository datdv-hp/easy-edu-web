import { RouteRecordRaw } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import SubjectListPage from './pages/subject-list/SubjectListPage.vue';
import { PageName } from '@/common/constants';

const coursesRoutes: Array<RouteRecordRaw> = [
  {
    path: '/subject',
    component: MainLayout,
    children: [
      {
        path: '',
        component: SubjectListPage,
        name: PageName.SUBJECT_LIST_PAGE,
        meta: {
          requiresAuth: true,
          role: 'subject.view',
        },
      },
    ],
  },
];

export default coursesRoutes;
