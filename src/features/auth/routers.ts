import { PageName } from '@/common/constants';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { type RouteRecordRaw } from 'vue-router';
import ActiveAccountPage from './pages/active-account/ActiveAccountPage.vue';
import GoogleLoginPage from './pages/google-login/GoogleLoginPage.vue';
import LoginPage from './pages/login/LoginPage.vue';

const authRouters: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: PageName.LOGIN_PAGE,
        component: LoginPage,
        meta: {
          onlyWhenLoggedOut: true,
          public: true,
        },
      },
      {
        path: 'active-account',
        name: PageName.USER_ACTIVE_ACCOUNT_PAGE,
        component: ActiveAccountPage,
        meta: {
          onlyWhenLoggedOut: true,
          public: true,
        },
      },
      {
        path: 'google-login',
        name: PageName.GOOGLE_LOGIN_PAGE,
        component: GoogleLoginPage,
      },
    ],
  },
  // {
  //     path: '/',
  //     component: MainLayout,
  //     children: [
  //         {
  //             path: '/my-profile',
  //             name: PageName.PROFILE_PAGE,
  //             component: ProfilePage,
  //             meta: {
  //                 requiresAuth: true,
  //             },
  //         },
  //     ],
  // },
];

export default authRouters;
