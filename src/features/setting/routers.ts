import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import SecondaryLayout from '@/layouts/SecondaryLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import SettingCourse from './pages/courses/SettingCoursePage.vue';
import SettingPaymentMethodListPage from './pages/payment-method/SettingPaymentMethodListPage.vue';
import PromotionProgrammeDetailPage from './pages/promotion-programme/PromotionProgrammeDetailPage.vue';
import PromotionProgrammeListPage from './pages/promotion-programme/PromotionProgrammeListPage.vue';
import SettingTimekeepingPage from './pages/timekeeping/SettingTimekeepingPage.vue';
import UserAuthorizationManagementPage from './pages/user-authorization/UserAuthorizationManagementPage.vue';

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
        path: 'timekeeping',
        component: SettingTimekeepingPage,
        name: PageName.SETTING_TIMEKEEPING_PAGE,
        meta: {
          requiresAuth: true,
          role: 'settingTimekeeping.view',
        },
      },
      {
        path: 'promotion-programme',
        component: PromotionProgrammeListPage,
        name: PageName.PROMOTION_PROGRAMME_LIST_PAGE,
        meta: {
          requiresAuth: true,
          role: ['promotionSetting.view'],
        },
      },
      {
        path: 'promotion-programme/:id',
        component: PromotionProgrammeDetailPage,
        name: PageName.PROMOTION_PROGRAMME_DETAIL_PAGE,
        meta: {
          requiresAuth: true,
          role: ['promotionSetting.view'],
        },
      },
      {
        path: 'payment-method',
        component: SettingPaymentMethodListPage,
        name: PageName.SETTING_PAYMENT_METHOD_LIST_PAGE,
        meta: {
          requiresAuth: true,
          role: ['paymentMethodSetting.view'],
        },
      },
    ],
  },
];

export default settingRoutes;
