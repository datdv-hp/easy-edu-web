import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import { IBodyResponse, IOption, IOrderDirection } from '@/common/interfaces';
import { commonApiService } from '@/features/common/services/common.api';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import {
    convertTPromotionOptionsMapObject,
    convertToTuitionFeeDetail,
    convertToTuitionFeeList,
} from '../helpers';
import {
    IPromotionOptionInfo,
    ITuitionFeeDetail,
    ITuitionFeeListItem,
    ITuitionFeeListQuery,
} from '../interfaces';
import { tuitionFeeService } from '../services';

export const useTuitionFeeStore = defineStore('tuition-fee', () => {
    const _list = ref<ITuitionFeeListItem[]>([]);
    const _total = ref(0);
    const _detail = ref<ITuitionFeeDetail>();
    const _isFetching = ref(false);
    const _isSubmitting = ref(false);
    const _isUpdating = ref(false);
    const _selectedIds = reactive(new Set<string>());
    const _listQuery = ref<ITuitionFeeListQuery>({
        page: DEFAULT_FIRST_PAGE,
        limit: DEFAULT_LIMIT_FOR_PAGINATION,
        keyword: undefined,
        orderDirection: undefined,
        orderBy: undefined,
    });
    const _courseOptions = ref<IOption[]>([]);
    const _promotionOptions = ref<IOption[]>([]);
    const _promotionsMapObject = ref<Record<string, IPromotionOptionInfo>>({});
    const _classroomOptions = ref<IOption[]>([]);
    const _presenterOptions = ref<IOption[]>([]);

    // API
    async function getList(query = _listQuery.value) {
        setIsFetching(true);
        const _getList = async () =>
            await tuitionFeeService._getList<Record<string, unknown>>(query);
        let res = await _getList(); // TODO: Call Get List API
        if (!res.success) {
            setIsFetching(false);
            return res;
        }
        unSelectAll();
        setTotal(res.data.totalItems);
        if (listQuery.value.page && listQuery.value.page <= totalPages.value) {
            const newList = convertToTuitionFeeList(res.data.items);
            setList(newList);
            setIsFetching(false);
            return res;
        }
        setPage(totalPages.value);
        res = await _getList();
        if (!res.success) {
            const newList = convertToTuitionFeeList(res.data.items);
            setList(newList);
            setTotal(res.data.totalItems);
        }
        setIsFetching(false);
        return res;
    }

    async function getDetail(id?: string) {
        if (!id) return;
        const res = await tuitionFeeService._getDetail<
            IBodyResponse<Record<string, unknown>>
        >(id);
        if (res.success) {
            const promotion = convertToTuitionFeeDetail(res.data);
            setDetail(promotion);
        }
        return res;
    }

    async function createPayment(id: string, params: Record<string, unknown>) {
        const res = await tuitionFeeService.createPayment(id, params);
        return res;
    }

    async function removeSelectedItems() {
        return await tuitionFeeService.bulkDelete([...selectedIds.value]);
    }

    async function deletePromotionProgramme(id: string) {
        return await tuitionFeeService._delete<IBodyResponse<Record<string, unknown>>>(
            id,
        );
    }

    async function update(id: string, data: Record<string, unknown>) {
        const res = await tuitionFeeService.update(id, data);
        return res;
    }

    async function getCourseOptions() {
        const res = await commonApiService._getCourseDropdown();
        if (res.success) {
            const courseOptions = convertToOptions(res.data);
            setCourseOptions(courseOptions);
        }
        return res;
    }
    async function getPromotionOptions(courseId?: string) {
        if (!courseId) return;
        const res = await commonApiService._getPromotionDropdown({ courseId });
        if (res.success) {
            const options = convertToOptions(res.data);
            const mapObject = convertTPromotionOptionsMapObject(res.data);
            setPromotionOptions(options);
            setPromotionsMapObject(mapObject);
        }
        return res;
    }

    async function getClassroomOptions() {
        const res = await commonApiService._getClassroomDropdown();
        if (res.success) {
            const options = convertToOptions(res.data);
            setClassroomOptions(options);
        }
    }
    async function getPresenterOptions() {
        const res = await commonApiService._getPresenterDropdown();
        if (res.success) {
            const options = convertToOptions(res.data);
            setPresenterOptions(options);
        }
    }

    // Getter
    const list = computed(() => _list.value);
    const total = computed(() => _total.value);
    const detail = computed(() => _detail.value);
    const isFetching = computed(() => _isFetching.value);
    const isSubmitting = computed(() => _isSubmitting.value);
    const isUpdating = computed(() => _isUpdating.value);
    const isAbleUpdatePromotion = computed(() => _detail.value?.paidValue === 0);
    const listQuery = computed(() => _listQuery.value);
    const totalPages = computed(
        () => Math.ceil(_total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
    );
    const selectedIds = computed(() => _selectedIds);
    const isSelectedId = computed(() => (id: string) => _selectedIds.has(id));
    const isEmptySelected = computed(() => _selectedIds.size === 0);
    const isAllSelected = computed(() => _selectedIds.size === list.value.length);
    const courseOptions = computed(() => _courseOptions.value);
    const promotionOptions = computed(() => _promotionOptions.value);
    const promotionsMapObject = computed(() => _promotionsMapObject.value);
    const classroomOptions = computed(() => _classroomOptions.value);
    const presenterOptions = computed(() => _presenterOptions.value);

    // Setter
    function setList(value: ITuitionFeeListItem[]) {
        _list.value = value;
    }
    function setTotal(value: number) {
        _total.value = value;
    }
    function setDetail(value?: ITuitionFeeDetail) {
        _detail.value = value;
    }
    function setIsFetching(value: boolean) {
        _isFetching.value = value;
    }
    function setIsSubmitting(value: boolean) {
        _isSubmitting.value = value;
    }
    function setIsUpdating(value: boolean) {
        _isUpdating.value = value;
    }
    function setPage(page: number | string) {
        _listQuery.value.page = +page;
    }
    function setKeyword(keyword?: string) {
        _listQuery.value.keyword = keyword;
    }
    function setOrder(orderBy: string, orderDirection: IOrderDirection) {
        _listQuery.value.orderBy = orderBy;
        _listQuery.value.orderDirection = orderDirection;
    }
    function setQuery(query: ITuitionFeeListQuery) {
        _listQuery.value = { ..._listQuery.value, ...query };
    }
    function toggleSelectedId(id: string) {
        if (_selectedIds.has(id)) {
            _selectedIds.delete(id);
        } else {
            _selectedIds.add(id);
        }
    }
    function unSelectAll() {
        _selectedIds.clear();
    }
    function selectAll() {
        _list.value.forEach((questionSet) => {
            _selectedIds.add(questionSet.id);
        });
    }
    function toggleSelectAll() {
        if (!isEmptySelected.value) {
            unSelectAll();
            return;
        }
        selectAll();
    }
    function setCourseOptions(options: IOption[]) {
        _courseOptions.value = options;
    }
    function setPromotionOptions(options: IOption[]) {
        _promotionOptions.value = options;
    }
    function setClassroomOptions(options: IOption[]) {
        _classroomOptions.value = options;
    }
    function setPromotionsMapObject(mapObject: Record<string, IPromotionOptionInfo>) {
        _promotionsMapObject.value = mapObject;
    }
    function setPresenterOptions(options: IOption[]) {
        _presenterOptions.value = options;
    }
    return {
        // Getter
        list,
        total,
        detail,
        isFetching,
        isSubmitting,
        isUpdating,
        totalPages,
        listQuery,
        selectedIds,
        isSelectedId,
        isEmptySelected,
        isAllSelected,
        courseOptions,
        promotionOptions,
        isAbleUpdatePromotion,
        promotionsMapObject,
        classroomOptions,
        presenterOptions,
        // Setter
        setPage,
        setKeyword,
        setOrder,
        setIsFetching,
        setIsSubmitting,
        setIsUpdating,
        setDetail,
        setTotal,
        setList,
        toggleSelectedId,
        unSelectAll,
        selectAll,
        toggleSelectAll,
        setPromotionOptions,
        setPresenterOptions,
        setQuery,
        // API
        update,
        getList,
        getDetail,
        removeSelectedItems,
        deletePromotionProgramme,
        getCourseOptions,
        createPayment,
        getPromotionOptions,
        getClassroomOptions,
        getPresenterOptions,
    };
});
