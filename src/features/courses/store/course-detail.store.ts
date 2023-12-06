import { DEFAULT_FIRST_PAGE, DEFAULT_LIMIT_FOR_PAGINATION } from '@/common/constants';
import { IBodyResponse } from '@/common/interfaces';
import { ClassroomStatus } from '@/features/classroom/contants';
import { transformClassroom } from '@/features/classroom/helpers';
import { IClassroom, IClassroomListQuery } from '@/features/classroom/interfaces';
import { classroomApiService } from '@/features/classroom/services';
import { ITeacher } from '@/features/teacher/interfaces';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { convertToCourseMoreDetail } from '../helpers';
import { ICourse } from '../interfaces';
import { courseApiService } from '../services/courses.api';

export const useCourseDetail = defineStore('course-detail', () => {
  const detail = ref<ICourse>();
  const isFetching = ref<boolean>(false);
  const isFetchingList = ref<boolean>(false);
  const currentCourseId = ref<string>();
  const teacherList = ref<ITeacher[]>([]);
  const classroomListQuery = ref<IClassroomListQuery>({
    page: DEFAULT_FIRST_PAGE,
    limit: DEFAULT_LIMIT_FOR_PAGINATION,
  });
  const classroomList = ref<IClassroom[]>([]);
  const totalClassrooms = ref<number>(0);

  async function getDetail(id: string) {
    isFetching.value = true;
    const response = await courseApiService.moreDetail(id);
    if (response.success) {
      detail.value = convertToCourseMoreDetail(response.data);
    }
    isFetching.value = false;
    return response;
  }

  async function deleteCourse(id: string): Promise<IBodyResponse<any>> {
    const response: IBodyResponse<any> = await courseApiService._delete(id);
    return response;
  }

  async function getListClassroomOfCourse(queryString = classroomListQuery.value) {
    if (!currentCourseId.value) return;
    isFetchingList.value = true;
    let res = await classroomApiService.getList({
      ...queryString,
      courseIds: [currentCourseId.value],
    });
    if (!res.success) {
      isFetchingList.value = false;
      return res;
    }
    totalClassrooms.value = res?.data?.totalItems || 0;
    if (
      classroomListQuery.value.page &&
      classroomListQuery.value.page <= totalClassroomPages.value
    ) {
      classroomList.value = transformClassroom(res.data?.items);
      isFetchingList.value = false;
      return res;
    }
    classroomListQuery.value.page = totalClassroomPages.value;
    res = await classroomApiService.getList({
      ...queryString,
      courseIds: [currentCourseId.value],
    });
    if (res.success) {
      classroomList.value = transformClassroom(res.data?.items);
      totalClassrooms.value = res.data?.totalItems;
    }
    isFetchingList.value = false;
    return res;
  }

  function setClassroomStatus(statuses: ClassroomStatus[]) {
    classroomListQuery.value.statuses = statuses || undefined;
  }

  function setCurrentCourseId(id?: string) {
    currentCourseId.value = id;
  }

  function setClassroomPage(page: number) {
    classroomListQuery.value.page = page;
  }

  function updateDetail(data: ICourse) {
    detail.value = convertToCourseMoreDetail(data as unknown as Record<string, unknown>);
  }

  const totalClassroomPages = computed(
    () => Math.ceil(totalClassrooms.value / DEFAULT_LIMIT_FOR_PAGINATION) || 1,
  );

  function resetDetailPage() {
    detail.value = undefined;
  }

  const getDetailTeachers = async (id: string) => {
    const res = await courseApiService.getDetailTeachers(id);
    teacherList.value = res.data;
  };

  return {
    detail,
    isFetching,
    isFetchingList,
    currentCourseId,
    teacherList,
    classroomListQuery,
    classroomList,
    totalClassrooms,
    totalClassroomPages,
    getDetail,
    deleteCourse,
    setCurrentCourseId,
    getListClassroomOfCourse,
    setClassroomStatus,
    setClassroomPage,
    updateDetail,
    resetDetailPage,
    getDetailTeachers,
  };
});
