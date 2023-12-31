import { PageName } from '@/common/constants';
import SecondaryLayout from '@/layouts/SecondaryLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import UserAuthorizationManagementPage from './pages/user-authorization/UserAuthorizationManagementPage.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import SettingCourse from './pages/courses/SettingCoursePage.vue';
import SettingEvaluationPage from './pages/evaluation/SettingEvaluationPage.vue';
import SettingTimekeepingPage from './pages/timekeeping/SettingTimekeepingPage.vue';

const settingRoutes: Array<RouteRecordRaw> = [
  {
    path: '/setting',
    component: SecondaryLayout,
    children: [
      {
        path: 'authorization',
        component: UserAuthorizationManagementPage,
        name: PageName.SETTING_USER_AUTHORIZATION,
        meta: {
          requiresAuth: true,
          role: ['role.view'],
        },
      },
    ],
  },
  {
    path: '/setting',
    component: MainLayout,
    children: [
      {
        path: 'course',
        component: SettingCourse,
        name: PageName.SETTING_COURSE_PAGE,
        meta: {
          requiresAuth: true,
          role: 'courseFormSetting.view',
        },
      },
      {
        path: 'evaluation',
        component: SettingEvaluationPage,
        name: PageName.SETTING_EVALUATION_PAGE,
        meta: {
          requiresAuth: true,
          role: ['evaluationClassifiedSetting.view', 'evaluationCriteriaSetting.view'],
        },
      },
      {
        path: 'timekeeping',
        component: SettingTimekeepingPage,
        name: PageName.SETTING_TIMEKEEPING_PAGE,
        meta: {
          requiresAuth: true,
          role: 'settingTimekeeping.view',
        },
      },
    ],
  },
];

export default settingRoutes;
