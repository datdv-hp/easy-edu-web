import { defineStore } from 'pinia';
import {
  ITeacher,
  ISettingTimeKeepingForm,
  ITimeKeeping,
  ITeacherTimekeeping,
  ITeacherTimeKeepingListQuery,
} from '../interfaces';
import { computed, reactive, ref } from 'vue';
import { teacherApiService } from '../services/teacher.api';
import {
  converToSettingTimekeeping,
  coverResponseToSettingTimekeepingForm,
} from '../helpers';
import {
  DEFAULT_FIRST_PAGE,
  DEFAULT_LIMIT_FOR_PAGINATION,
  OrderDirection,
} from '@/common/constants';
import { settingApiService } from '../services/setting.api';
import { timekeepingApiService } from '../services/timekeeping.api';
import dayjs from 'dayjs';
import { IOrderDirection } from '@/common/interfaces';

export const useTimekeepingStore = defineStore('timekeeping', () => {
  const isSubmitting = ref<boolean>(false);
  const timekeepingDetail = ref<ISettingTimeKeepingForm>();

  const teacherDropdown = ref<Pick<ITeacher, 'id' | 'name'>[]>([]);
  const timekeepingEntries = ref<ITimeKeeping[]>([]);
  const teacherTimekeeping = ref<ITeacherTimekeeping[]>([]);
  const total = ref<number>(0);
  const totalTeachers = ref<number>(0);

  const isFetching = ref<boolean>(false);
  const isFetchingTeacherTimekeeping = ref<boolean>(false);
  const isDropdownFetching = ref<boolean>(false);
  const isSuccess = ref<boolean>(false);
  const isDropdownSuccess = ref<boolean>(false);

  const selectedTeacherTimekeeping = ref<ITeacherTimekeeping>();

  const teacherListQuery: ITeacherTimeKeepingListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
    keyword: '',
    userIds: undefined,
    orderDirection: OrderDirection.DESC,
  });

  const totalTeacherPages = computed(() =>
    Math.ceil(totalTeachers.value / DEFAULT_LIMIT_FOR_PAGINATION),
  );

  const selectedMonth = ref<{ month: number; year: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  function setInputSearch(search: string | undefined) {
    teacherListQuery.keyword = search;
  }

  const setOrder = (orders: Record<string, IOrderDirection>) => {
    const orderByArray: string[] = [];
    const orderDirectionArray: OrderDirection[] = [];
    Object.keys(orders).forEach((key) => {
      if (orders[key]) {
        orderByArray.push(key);
        orderDirectionArray.push(orders[key] as OrderDirection);
      }
    });
    if (
      orderByArray.length &&
      orderDirectionArray.length &&
      orderByArray.length === orderDirectionArray.length
    ) {
      teacherListQuery.orderBy = orderByArray.join(',');
      teacherListQuery.orderDirection = orderDirectionArray.join(',');
    } else {
      teacherListQuery.orderBy = 'createdAt';
      teacherListQuery.orderDirection = OrderDirection.DESC;
    }
  };

  function setSelectedTeacherTimekeeping(teacher: ITeacherTimekeeping) {
    selectedTeacherTimekeeping.value = teacher;
  }

  const setCountCheckInTeacher = (count: number) => {
    if (selectedTeacherTimekeeping.value != undefined) {
      selectedTeacherTimekeeping.value.countCheckIn += count;
      teacherTimekeeping.value = teacherTimekeeping.value.map((teacher) => {
        if (teacher._id === selectedTeacherTimekeeping.value?._id) {
          return {
            ...teacher,
            countCheckIn: selectedTeacherTimekeeping.value.countCheckIn,
          };
        } else {
          return teacher;
        }
      });
    }
  };

  const setPage = (page: number) => {
    if (page > totalTeacherPages.value) return;
    teacherListQuery.page = page;
  };

  async function fetchTeacherDropdown() {
    isDropdownFetching.value = true;
    const res = await teacherApiService.getDropDown();
    if (res && res.success) {
      teacherDropdown.value = res.data;
    }
    isDropdownFetching.value = false;
    return res;
  }

  async function fetchTeacherTimekeeping() {
    isFetchingTeacherTimekeeping.value = true;
    isSuccess.value = false;
    const startDate = new Date(
      selectedMonth.value?.year as number,
      selectedMonth.value?.month as number,
      1,
    );
    const endDate = new Date(
      selectedMonth.value?.year as number,
      (selectedMonth.value?.month as number) + 1,
      0,
    );
    const res = await timekeepingApiService.getTeacherTimekeeping({
      ...teacherListQuery,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
    });
    isSuccess.value = !!res.success;
    isFetchingTeacherTimekeeping.value = false;
    if (res.success) {
      teacherTimekeeping.value = res.data.items as unknown as ITeacherTimekeeping[];
      totalTeachers.value = res.data.totalItems;
    }
    return res;
  }

  async function fetchScrollTeacherTimekeeping() {
    isFetchingTeacherTimekeeping.value = true;
    isSuccess.value = false;
    const startDate = new Date(
      selectedMonth.value?.year as number,
      selectedMonth.value?.month as number,
      1,
    );
    const endDate = new Date(
      selectedMonth.value?.year as number,
      (selectedMonth.value?.month as number) + 1,
      0,
    );
    const res = await timekeepingApiService.getTeacherTimekeeping({
      ...teacherListQuery,
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
    });
    isSuccess.value = !!res.success;
    isFetchingTeacherTimekeeping.value = false;
    if (res.success) {
      const items = res.data.items as unknown as ITeacherTimekeeping[];
      teacherTimekeeping.value = [...teacherTimekeeping.value, ...items];
      totalTeachers.value = res.data.totalItems;
    }
    return res;
  }

  async function fetchTimekeepingEntries() {
    isFetching.value = true;
    isSuccess.value = false;
    const startDate = new Date(
      selectedMonth.value?.year as number,
      selectedMonth.value?.month as number,
      1,
    );
    const endDate = new Date(
      selectedMonth.value?.year as number,
      (selectedMonth.value?.month as number) + 1,
      0,
    );

    const res = await timekeepingApiService.getTimekeepingOfTeacher(
      {
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      },
      selectedTeacherTimekeeping.value?._id as string,
    );
    isSuccess.value = !!res.success;
    isFetching.value = false;
    if (res.success) {
      timekeepingEntries.value = res.data;
    }
    return res;
  }

  async function getTimeKeepingDetail() {
    const res = await settingApiService.get();
    if (res.success) {
      timekeepingDetail.value = coverResponseToSettingTimekeepingForm(
        converToSettingTimekeeping(res.data),
      );
    }
    return res;
  }

  async function createTimekeeping(
    userId: string,
    lessonId: string,
    isAttended: boolean,
  ) {
    const body = {
      userId,
      lessonId,
      isAttended,
    };
    const res = await timekeepingApiService.create(body);
    if (res?.success) {
      return res;
    }
  }

  async function updateTimekeeping(timekeepingId: string, isAttended: boolean) {
    const res = await timekeepingApiService.update(timekeepingId, {
      isAttended: isAttended,
    });
    if (res?.success) {
      return res;
    }
  }

  return {
    isSubmitting,
    total,
    totalTeacherPages,
    totalTeachers,
    timekeepingDetail,
    timekeepingEntries,
    teacherTimekeeping,
    teacherListQuery,
    teacherDropdown,
    isFetching,
    isFetchingTeacherTimekeeping,
    isDropdownFetching,
    isDropdownSuccess,
    selectedMonth,
    selectedTeacherTimekeeping,
    fetchTeacherDropdown,
    setInputSearch,
    setSelectedTeacherTimekeeping,
    getTimeKeepingDetail,
    fetchTimekeepingEntries,
    fetchTeacherTimekeeping,
    fetchScrollTeacherTimekeeping,
    createTimekeeping,
    updateTimekeeping,
    setPage,
    setOrder,
    setCountCheckInTeacher,
  };
});
