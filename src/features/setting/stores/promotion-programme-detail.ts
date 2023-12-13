import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import { ICommonListQuery } from '@/common/interfaces';
import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { ref } from 'vue';
import { IUserUsedPromotionProgramme } from '../interfaces/promotion-programme.interfaces';
import { promotionProgrammeService } from '../services';
import { convertToUserUsedPromotionList } from '../helpers/promotion-programme.helper';

export const usePromotionProgrammeDetail = defineStore('promotion-detail', () => {
    const _isFetching = ref<boolean>(false);
    const _list = ref([] as IUserUsedPromotionProgramme[]);
    const _total = ref(0);
    const _listQuery = reactive<ICommonListQuery>({
        page: DEFAULT_FIRST_PAGE,
        limit: DEFAULT_LIMIT_FOR_PAGINATION,
        keyword: undefined,
        orderDirection: undefined,
        orderBy: undefined,
    });

    // API
    async function getStudentList(promotionId: string, query = _listQuery) {
        setIsFetching(true);
        const _getList = async () =>
            promotionProgrammeService.getStudentListUsedPromotionProgramme(
                promotionId,
                query,
            );
        let res = await _getList();
        if (!res.success) {
            setIsFetching(false);
            return res;
        }
        setTotal(res.data.totalItems);
        if (listQuery.value.page && listQuery.value.page <= totalPages.value) {
            const newList = convertToUserUsedPromotionList(res.data.items);
            setList(newList);
            setIsFetching(false);
            return res;
        }
        setPage(totalPages.value);
        res = await _getList();
        if (!res.success) {
            const newList = convertToUserUsedPromotionList(res.data.items);
            setList(newList);
            setTotal(res.data.totalItems);
        }
        setIsFetching(false);
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
    // Setter
    function setIsFetching(value: boolean) {
        _isFetching.value = value;
    }
    function setPage(value: number) {
        _listQuery.page = value;
    }
    function setList(value: IUserUsedPromotionProgramme[]) {
        _list.value = value;
    }
    function setTotal(value: number) {
        _total.value = value;
    }
    return {
        // API,
        getStudentList,
        // Getter
        list,
        listQuery,
        total,
        totalPages,
        isFetching,
        // Setter
        setIsFetching,
        setPage,
        setList,
        setTotal,
    };
});
