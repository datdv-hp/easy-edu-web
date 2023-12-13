import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import { RouteRecordRaw } from 'vue-router';
import TuitionFeeListPage from './pages/list/TuitionFeeListPage.vue';
import TuitionFeeDetailPage from './pages/detail/TuitionFeeDetailPage.vue';

const tuitionRoutes: Array<RouteRecordRaw> = [
    {
        path: '/tuition-fee',
        component: MainLayout,
        children: [
            {
                path: '',
                component: TuitionFeeListPage,
                name: PageName.TUITION_FEE_LIST_PAGE,
                meta: {
                    requiresAuth: true,
                    role: ['tuition.view', 'tuition.viewPersonal'],
                },
            },
            {
                path: ':id',
                component: TuitionFeeDetailPage,
                name: PageName.TUITION_FEE_DETAIL_PAGE,
                meta: {
                    requiresAuth: true,
                    role: ['tuition.view', 'tuition.viewPersonal'],
                },
            },
        ],
    },
];
export default tuitionRoutes;
