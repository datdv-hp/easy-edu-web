import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import { ICommonListQuery, IOption } from '@/common/interfaces';
import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { ref } from 'vue';
import { IPaymentHistory } from '../interfaces';
import { tuitionFeeService } from '../services';
import { convertToPaymentHistories } from '../helpers';
import { commonApiService } from '@/features/common/services/common.api';
import { convertToOptions } from '@/common/helpers';

export const useTuitionFeeDetail = defineStore('tuition-fee-detail', () => {
    const _isFetching = ref<boolean>(false);
    const _list = ref([] as IPaymentHistory[]);
    const _total = ref(0);
    const _listQuery = reactive<ICommonListQuery>({
        page: DEFAULT_FIRST_PAGE,
        limit: DEFAULT_LIMIT_FOR_PAGINATION,
        keyword: undefined,
        orderDirection: undefined,
        orderBy: undefined,
    });
    const _paymentMethodOptions = ref<IOption[]>([]);
    // API
    async function getPaymentHistories(tuitionFeeId: string, query = _listQuery) {
        setIsFetching(true);
        const _getList = async () =>
            tuitionFeeService.getPaymentHistories(tuitionFeeId, query);
        let res = await _getList();
        if (!res.success) {
            setIsFetching(false);
            return res;
        }
        setTotal(res.data.totalItems);
        if (listQuery.value.page && listQuery.value.page <= totalPages.value) {
            const newList = convertToPaymentHistories(res.data.items);
            setList(newList);
            setIsFetching(false);
            return res;
        }
        setPage(totalPages.value);
        res = await _getList();
        if (!res.success) {
            const newList = convertToPaymentHistories(res.data.items);
            setList(newList);
            setTotal(res.data.totalItems);
        }
        setIsFetching(false);
        return res;
    }

    async function getPaymentInfo(tuitionId: string) {
        const res = await tuitionFeeService.getPaymentInfo(tuitionId);
        return res;
    }
    async function getPaymentMethodOptions() {
        const res = await commonApiService._getPaymentMethodDropdown();
        if (res.success) {
            const options = convertToOptions(res.data);
            setPaymentMethodOptions(options);
        }
        return res;
    }
    // Getter
    const isFetching = computed(() => _isFetching.value);
    const list = computed(() => _list.value);
    const listQuery = computed(() => _listQuery);
    const total = computed(() => _total.value);
    const totalPages = computed(
        () => Math.ceil(_total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
    );
    const paymentMethodOptions = computed(() => _paymentMethodOptions.value);
    // Setter
    function setIsFetching(value: boolean) {
        _isFetching.value = value;
    }
    function setPage(value: number) {
        _listQuery.page = value;
    }
    function setList(value: IPaymentHistory[]) {
        _list.value = value;
    }
    function setTotal(value: number) {
        _total.value = value;
    }
    function setPaymentMethodOptions(value: IOption[]) {
        _paymentMethodOptions.value = value;
    }
    return {
        // API,
        getPaymentHistories,
        getPaymentInfo,
        getPaymentMethodOptions,
        // Getter
        list,
        listQuery,
        total,
        totalPages,
        isFetching,
        paymentMethodOptions,
        // Setter
        setIsFetching,
        setPage,
        setList,
        setTotal,
    };
});
