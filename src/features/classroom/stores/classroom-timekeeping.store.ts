import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import type { IBodyResponse, ICommonListQuery } from '@/common/interfaces';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { ClassroomTimekeepingListType } from '../contants';
import { convertToClassroom, transformClassroomTimekeepingList } from '../helpers';
import { IClassroom, IClassroomTimekeepingStudent } from '../interfaces';
import { classroomApiService } from '../services/classroom.api';

export const useClassroomTimekeepingStore = defineStore('classroom-timekeeping', () => {
  const list = ref<IClassroomTimekeepingStudent[]>([]);
  const classroomDetail = ref<IClassroom>();
  const total = ref<number>(0);
  const isFetching = ref<boolean>(false);
  const selectedViewType = ref<ClassroomTimekeepingListType>(
    ClassroomTimekeepingListType.STUDENT,
  );
  const { t } = useI18n();

  const listQuery: ICommonListQuery = reactive({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
  });

  async function getClassroomTimekeepingStudentList(classroomId: string) {
    isFetching.value = true;
    const response: IBodyResponse<any> =
      await classroomApiService.getClassroomTimekeepingStudentList(classroomId);
    if (response.success) {
      list.value = transformClassroomTimekeepingList(response.data || []);
      total.value = response.data?.length || 0;
    }
    isFetching.value = false;
    return response;
  }

  async function getClassroomTimekeepingTeacherList(classroomId: string) {
    isFetching.value = true;
    const response: IBodyResponse<any> =
      await classroomApiService.getClassroomTimekeepingTeacherList(classroomId);
    if (response.success) {
      list.value = transformClassroomTimekeepingList(response.data || []);
      total.value = response.data?.length || 0;
    }
    isFetching.value = false;
    return response;
  }

  const setPage = (page: number) => {
    listQuery.page = page;
  };

  const timekeepingViewOptions = computed(() => {
    const options = Object.values(ClassroomTimekeepingListType).map((view) => ({
      title: t(`classroom.timekeepingPage.listType.${view.toLowerCase()}`),
      value: view,
    }));
    return options;
  });

  const totalPages = computed(
    () => Math.ceil(total.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  async function getClassroomDetail(classroomId: string) {
    isFetching.value = true;
    const response: IBodyResponse<any> =
      await classroomApiService.getMoreDetail(classroomId);
    if (response.success) {
      classroomDetail.value = convertToClassroom(response.data);
    }
    isFetching.value = false;
    return response;
  }

  const setSelectedViewType = (value: ClassroomTimekeepingListType) => {
    selectedViewType.value = value;
  };
  return {
    list,
    listQuery,
    total,
    isFetching,
    timekeepingViewOptions,
    getClassroomTimekeepingStudentList,
    getClassroomTimekeepingTeacherList,
    setPage,
    totalPages,
    classroomDetail,
    getClassroomDetail,
    setSelectedViewType,
    selectedViewType,
  };
});
