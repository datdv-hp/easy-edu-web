import { PageName } from '@/common/constants';
import FormLayout from '@/layouts/FormLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import SyllabusCreatePage from './pages/create/SyllabusCreatePage.vue';
import SyllabusDetailPage from './pages/detail/SyllabusDetailPage.vue';
import SyllabusListPage from './pages/list/SyllabusListPage.vue';

const syllabusRoutes: Array<RouteRecordRaw> = [
  {
    path: '/syllabus',
    component: MainLayout,
    children: [
      {
        path: '',
        component: SyllabusListPage,
        name: PageName.SYLLABUS_LIST_PAGE,
        meta: {
          requiresAuth: true,
          role: ['syllabus.view', 'syllabus.viewPersonal'],
        },
      },

      {
        path: '/detail/:id',
        component: SyllabusDetailPage,
        name: PageName.SYLLABUS_DETAIL_PAGE,
        meta: {
          requiresAuth: true,
          role: ['syllabus.view', 'syllabus.viewPersonal'],
        },
      },
    ],
  },
  {
    path: '/syllabus',
    component: FormLayout,
    children: [
      {
        path: 'create',
        component: SyllabusCreatePage,
        name: PageName.SYLLABUS_CREATE_PAGE,
        meta: {
          requiresAuth: true,
          role: 'syllabus.create',
        },
      },
    ],
  },
];

export default syllabusRoutes;
