import { IBodyResponse, IOption } from '@/common/interfaces';
import { lessonApiService } from '@/features/lesson/lesson.api';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { LeaveRequestStatus, ScheduleMode, scheduleQueryDefault } from '../constants';
import {
  convertToCreateLeaveRequestBody,
  convertToLessonLeave,
  convertToSchedule,
  convertToStudentsObj,
  transformToSchedule,
} from '../helpers';
import {
  IHandleLeaveRequestBody,
  ILessonLeave,
  ILessonTimeKeeping,
  IScheduleDetail,
  IScheduleListQuery,
  IStudentInLesson,
} from '../interfaces';
import { scheduleTrackingApi } from '../services/schedule-tracking.api';
import { useReasonDialog } from './reason-dialog.store';
import { OrderDirection } from '@/common/constants';
import { convertToOptions } from '@/common/helpers';
import { orderBy } from 'lodash';
import { commonApiService } from '@/features/common/services/common.api';

export const useScheduleTrackingStore = defineStore('schedule-tracking', () => {
  const list = ref<IScheduleDetail[]>([]);
  const total = ref(0);
  const reasonDialogStore = useReasonDialog();
  const isFetching = ref<boolean>(false);
  const detail = ref<IScheduleDetail>({} as IScheduleDetail);
  const studentsObj = ref<Record<string, IStudentInLesson>>({});
  const scheduleListQuery = reactive({
    ...scheduleQueryDefault,
  });
  const modeView = ref(ScheduleMode.WEEK);
  const _teacherOptions = ref<IOption[]>([]);
  const _subjectOptions = ref<IOption[]>([]);
  const _classroomOptions = ref<IOption[]>([]);

  // API
  async function getLessonListForSchedule(query = scheduleListQuery) {
    isFetching.value = true;
    const response: IBodyResponse<IScheduleDetail[]> =
      await lessonApiService.getListForSChedule(query);
    if (response.success) {
      list.value = transformToSchedule(response.data || []);
    }
    isFetching.value = false;
    return response;
  }

  async function getDetail(id?: string) {
    if (!id) return;
    const response: IBodyResponse<Record<string, unknown>> =
      await scheduleTrackingApi.detail(id);
    if (response.success) {
      detail.value = convertToSchedule(response.data);
      studentsObj.value = convertToStudentsObj(
        response?.data?.students as Record<string, unknown>[],
      );
    }
    return response;
  }

  async function timekeeping(params: Record<string, unknown>) {
    const res = await scheduleTrackingApi.timekeeping(params);
    return res;
  }

  async function timekeepings(params: Record<string, unknown>[]) {
    const res = await scheduleTrackingApi.timekeepings(params);
    return res;
  }

  async function createLeaveRequest(data: Record<string, unknown>) {
    reasonDialogStore.isSubmitting = true;
    const response = await scheduleTrackingApi.createLeaveRequest(
      convertToCreateLeaveRequestBody(data),
    );
    if (response.success) {
      const leave = convertToLessonLeave(response.data);
      Object.assign(studentsObj.value[leave.userId], { leave });
    }
    reasonDialogStore.isSubmitting = false;
    return response;
  }

  async function deleteLeaveRequest(id?: string) {
    if (!id) return;
    const response: IBodyResponse<ILessonLeave> =
      await scheduleTrackingApi.deleteLeaveRequest(id);
    return response;
  }

  async function handleLeaveRequest(
    leaveRequestId: string,
    data: IHandleLeaveRequestBody,
  ) {
    reasonDialogStore.isSubmitting = true;
    const response = await scheduleTrackingApi.handleLeaveRequest(leaveRequestId, data);
    reasonDialogStore.isSubmitting = false;
    return response;
  }

  async function getTeacherDropdown() {
    const res = await commonApiService._getTeacherDropdown();
    if (res.success) {
      _teacherOptions.value = orderBy(
        convertToOptions(res.data),
        ['value'],
        [OrderDirection.DESC],
      );
    }
  }
  async function getSubjectDropdown() {
    const res = await commonApiService._getSubjectDropdown();
    if (res.success) {
      _subjectOptions.value = convertToOptions(res.data);
    }
  }
  async function getClassroomDropdown() {
    const res = await commonApiService._getClassroomDropdown();
    if (res.success) {
      _classroomOptions.value = convertToOptions(res.data);
    }
  }
  // END API

  // Getter
  const subjectOptions = computed(() => _subjectOptions.value);
  const teacherOptions = computed(() => _teacherOptions.value);
  const classroomOptions = computed(() => _classroomOptions.value);
  const canAttendanceList = computed(() => {
    return Object.values(studentsObj.value).filter(
      (student: IStudentInLesson) => !student?.leave?.id,
    );
  });
  const attendanceList = computed(() => {
    return canAttendanceList.value.filter(
      (student: IStudentInLesson) => student?.timekeeping?.isAttended,
    );
  });

  const studentList = computed<IStudentInLesson[]>(() =>
    Object.values(studentsObj.value),
  );

  // Setter
  function unAttendanceAll() {
    canAttendanceList.value.forEach((_student) => {
      if (_student?.timekeeping?.isAttended) {
        (studentsObj.value[_student.id].timekeeping as ILessonTimeKeeping).isAttended =
          false;
      }
    });
  }

  function attendanceAll() {
    canAttendanceList.value.forEach((_student) => {
      const timekeeping = {
        userId: _student.id,
        lessonId: detail.value.id,
        isAttended: true,
      };
      Object.assign(studentsObj.value[_student.id], {
        timekeeping,
      });
    });
  }

  function updateLeaveRequestStatus(studentId: string, status: LeaveRequestStatus) {
    Object.assign(studentsObj.value[studentId].leave as ILessonLeave, { status });
  }
  function updateAttendance(timekeeping: ILessonTimeKeeping) {
    Object.assign(studentsObj.value[timekeeping.userId], { timekeeping });
  }

  function updateTeacherTimekeeping(timekeeping: ILessonTimeKeeping) {
    Object.assign(detail.value.teacher, { timekeeping });
  }

  function setScheduleListQuery(query: IScheduleListQuery) {
    Object.keys(query)?.forEach((key) => {
      scheduleListQuery[key] = query[key];
    });
  }

  function setModeView(view: ScheduleMode) {
    modeView.value = view;
  }

  return {
    isFetching,
    getDetail,
    detail,
    createLeaveRequest,
    handleLeaveRequest,
    deleteLeaveRequest,
    canAttendanceList,
    attendanceList,
    unAttendanceAll,
    attendanceAll,
    studentList,
    studentsObj,
    list,
    total,
    getLessonListForSchedule,
    scheduleListQuery,
    setScheduleListQuery,
    timekeeping,
    timekeepings,
    updateLeaveRequestStatus,
    updateAttendance,
    updateTeacherTimekeeping,
    modeView,
    setModeView,
    getTeacherDropdown,
    teacherOptions,
    getSubjectDropdown,
    subjectOptions,
    getClassroomDropdown,
    classroomOptions,
  };
});
