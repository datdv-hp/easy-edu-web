import { PageName } from '@/common/constants';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { type RouteRecordRaw } from 'vue-router';
import CreateRegistrationPage from './pages/create/CreateRegistrationPage.vue';
import RegistrationListPage from './pages/list/RegistrationListPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
const registrationRouters: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'register',
        name: PageName.REGISTRATION_PAGE,
        component: CreateRegistrationPage,
        meta: {
          onlyWhenLoggedOut: true,
          public: true,
        },
      },
    ],
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'registration',
        name: PageName.REGISTRATION_LIST_PAGE,
        component: RegistrationListPage,
        meta: {
          requiresAuth: true,
          role: ['registration.view'],
        },
      },
    ],
  },
];

export default registrationRouters;
