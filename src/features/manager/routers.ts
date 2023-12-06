import type { RouteRecordRaw } from 'vue-router';
import ManagerListPage from './pages/manager-list/ManagerListPage.vue';
import ManagerDetails from './pages/manager-detail/ManagerDetails.vue';
import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/manager',
    component: MainLayout,
    children: [
      {
        path: '',
        name: PageName.MANAGER_LIST_PAGE,
        component: ManagerListPage,
        meta: {
          requiresAuth: true,
          role: 'manager.view',
        },
      },
      {
        path: 'detail/:id',
        name: PageName.MANAGER_DETAIL_PAGE,
        component: ManagerDetails,
        meta: {
          requiresAuth: true,
          role: 'manager.view',
        },
      },
    ],
  },
];

export default routes;
