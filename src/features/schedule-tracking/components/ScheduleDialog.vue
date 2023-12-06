<script setup lang="ts">
import icons from '@/assets/icons';
import { ProfileType } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { useRole } from '@/common/stores/role.store';
import { BaseButton, BaseDialog, CircleIcon, CollapseList } from '@/components';
import { useUserStore } from '@/features/auth/stores';
import { useLessonDialog, useLessonStore } from '@/features/lesson/stores';
import { showDialogConfirm } from '@/plugins';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { LeaveRequestStatus } from '../constants';
import {
  convertToLessonTimekeeping,
  isLessonCompleted,
  isLessonUpcoming,
} from '../helpers';
import { ILessonTimeKeeping, IScheduleDetail, IStudentInLesson } from '../interfaces';
import {
  useReasonDialog,
  useSCheduleTrackingDialog,
  useScheduleTrackingStore,
} from '../stores';
import dayjs from '@/plugins/dayjs';
import { Role } from '@/common/constants';

const { t } = useI18n();
const store = useScheduleTrackingStore();
const dialogStore = useSCheduleTrackingDialog();
const reasonDialogStore = useReasonDialog();
const userStore = useUserStore();
const lessonStore = useLessonStore();
const lessonDialog = useLessonDialog();
const role = useRole();
const isCopied = ref(false);
const isDirtyAttendance = ref(false);
const isUpdatingAttendance = ref(false);

onMounted(async () => {
  fetchDetail();
});

const fetchDetail = async () => {
  dialogStore.isFetching = true;
  await store.getDetail(dialogStore.currentId);
  dialogStore.isFetching = false;
};

const isAttendanceForAll = computed(
  () =>
    store.attendanceList.length &&
    store.attendanceList.length === store.canAttendanceList.length,
);

const isNoAttendance = computed(() => !store.attendanceList.length);

const toggleAttendanceAll = () => {
  if (!isDirtyAttendance.value) {
    isDirtyAttendance.value = true;
  }
  if (isNoAttendance.value) {
    store.attendanceAll();
    return;
  }
  store.unAttendanceAll();
};

const onCloseDialog = () => {
  dialogStore.close();
};

const handleCopyRoom = async (text: string) => {
  await navigator.clipboard.writeText(text);
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
};

const openReasonDialog = (studentId?: string) => {
  reasonDialogStore.open(studentId);
};

const handleAttendance = async (id: string) => {
  if (!isDirtyAttendance.value) {
    isDirtyAttendance.value = true;
  }
  store.updateAttendance({
    userId: id,
    lessonId: store.detail?.id,
    isAttended: !store.studentsObj?.[id]?.timekeeping?.isAttended,
  } as ILessonTimeKeeping);
};

const saveAttendance = async () => {
  isUpdatingAttendance.value = true;
  const usersTimekeeping = store.studentList.map((student) => ({
    userId: student.id,
    lessonId: store.detail.id,
    isAttended: !!student.timekeeping?.isAttended,
  })) as unknown as Record<string, unknown>[];
  const res = await store.timekeepings(usersTimekeeping);
  if (!res.success) {
    showErrorNotification(t('scheduleTracking.notification.error.timekeeping.update'));
  } else {
    isDirtyAttendance.value = false;
    await store.getDetail(dialogStore.currentId);
  }
  isUpdatingAttendance.value = false;
};

const handleTimekeepingForTeacher = async () => {
  dialogStore.isSubmitting = true;
  const res = await store.timekeeping({
    userId: store.detail?.teacher._id,
    lessonId: store.detail?.id,
    isAttended: true,
  });
  dialogStore.isSubmitting = false;
  if (res.success) {
    const timekeeping = convertToLessonTimekeeping(res.data);
    store.updateTeacherTimekeeping(timekeeping);
  }
};

const handleDeleteSchedule = async () => {
  const confirm = await showDialogConfirm('error', {
    title: t('common.deleteConfirm'),
    text: t('lesson.deleteConfirmMessage'),
  });

  if (confirm) {
    const res = await lessonStore.deleteLesson(dialogStore.currentId);
    if (res.success) {
      showSuccessNotification(t('lesson.notification.success.delete'));
      dialogStore.close();
      store.getLessonListForSchedule();
    } else {
      showErrorNotification(
        res.errors?.[0]?.message || t('lesson.notification.error.delete'),
      );
    }
  }
};

const handleEditSchedule = () => {
  lessonDialog.open(store.detail.id, {});
};

const hasTeacherBeenTimekeeping = computed(
  () => !!store.detail?.teacher?.timekeeping?.isAttended,
);

const _isLessonUpcoming = computed(() => {
  const date = store.detail?.date;
  const startTime = store.detail?.startTime;
  if (!date || !startTime) return false;
  return isLessonUpcoming(date, startTime);
});

const _isLessonCompleted = computed(() => {
  const date = store.detail?.date;
  const endTime = store.detail?.endTime;
  if (!date || !endTime) return false;
  return isLessonCompleted(date, endTime);
});

const isAbleUpdateTimekeeping = computed(() => {
  return (
    dayjs().isBefore(dayjs(store.detail.date).endOf('month'), 'day') &&
    !_isLessonUpcoming.value &&
    !hasTeacherBeenTimekeeping.value
  );
});

const hasStudentLeaveRequest = computed(() => {
  const type = userStore.profile?.type;
  if (type === ProfileType.STUDENT) {
    const studentId = userStore.profile?.id as string;
    return !!store.studentsObj?.[studentId]?.leave?.id;
  }
  return false;
});

const room = computed(
  () =>
    (store.detail.isUseGoogleMeet ? store.detail?.meetUrl : store.detail?.room) as string,
);

const isAbleDeleteLesson = computed(() => {
  return (
    (_isLessonUpcoming.value && role.schedule?.delete) ||
    (userStore.profile?.userRole === Role.MASTER && _isLessonCompleted.value)
  );
});

onBeforeUnmount(() => {
  store.detail = {} as IScheduleDetail;
  store.studentsObj = {};
});
</script>
<template>
  <BaseDialog
    :width="480"
    content-class="ps-6 pe-6 pt-0 pb-6"
    wrapper-class="schedule-dialog"
    :hide-action-buttons="true"
    :hide-footer="
      (!role.schedule?.createRequestLeave && !role.schedule?.updateTimeKeeping) ||
      (role.schedule?.createRequestLeave && !hasStudentLeaveRequest && _isLessonCompleted)
    "
    :overlay="dialogStore.isFetching"
  >
    <template v-slot:append>
      <div class="d-flex">
        <span class="mr-3 d-flex gap--1">
          <CircleIcon
            v-if="role.schedule?.updateLesson"
            class="cursor-pointer"
            :icon="icons.edit"
            @click="handleEditSchedule"
            size="small"
          />
          <CircleIcon
            v-if="isAbleDeleteLesson"
            class="cursor-pointer"
            :icon="icons.deleteIcon"
            @click="handleDeleteSchedule"
            size="small"
          />
        </span>
        <CircleIcon
          wrapper-class="bg--neutral-7 cursor-pointer"
          @click="onCloseDialog"
          size="small"
        >
          <v-icon icon="mdi-close" size="24" />
        </CircleIcon>
      </div>
    </template>
    <div class="d-flex flex-column mb-5">
      <span class="schedule-title">{{ store.detail?.subject?.name }}</span>
      <span class="schedule-subtitle">{{ store.detail?.name }}</span>
    </div>
    <div class="d-flex flex-column gap--4">
      <div class="d-flex align-center gap--5">
        <span>
          <CircleIcon :icon="icons.schClockRed" size="small" bg-color="#FFF1F4" />
        </span>
        <span>{{ store.detail?.dateTime }}</span>
      </div>
      <div class="d-flex align-center gap--5">
        <span>
          <CircleIcon :icon="icons.schClassroomGreen" size="small" bg-color="#E4F8F2" />
        </span>
        <span class="ellipsis-one-line">
          <span class="title">{{ $t('scheduleTracking.detail.classroom') }}</span>
          <span>{{ store.detail?.classroom?.name }}</span>
        </span>
      </div>
      <div class="d-flex align-center gap--5">
        <span>
          <CircleIcon :icon="icons.schTeacherOrange" size="small" bg-color="#FEF2ED" />
        </span>
        <span class="ellipsis-one-line">
          <span class="title">{{ $t('scheduleTracking.detail.teacher') }}</span>
          <span>{{ store.detail?.teacher?.name }}</span>
        </span>
      </div>
      <div>
        <div class="d-flex align-center gap--5">
          <span>
            <CircleIcon :icon="icons.schDocumentBlue" size="small" bg-color="#D5E9FA" />
          </span>
          <span class="title">{{ $t('scheduleTracking.detail.document') }}</span>
        </div>
        <div class="ml-14">
          <CollapseList :items="store.detail?.documents || []" :visible="3">
            <template #title> </template>
            <template #item="{ index, item }">
              <div class="ellipsis-one-line link my-3">
                <span>{{ index + 1 }}: </span>
                <a class="link" :href="item" target="_blank">{{ item }}</a>
              </div>
            </template>
          </CollapseList>
        </div>
      </div>
      <div>
        <div class="d-flex align-center gap--5">
          <span>
            <CircleIcon :icon="icons.schStudentPurple" size="small" bg-color="#F2F1FF" />
          </span>
          <div class="flex-1-1 d-flex align-center justify-space-between">
            <div class="d-flex align-center gap--4">
              <div class="title">
                {{ $t('scheduleTracking.detail.student') }}
              </div>
              <v-badge
                :content="store.studentList.length"
                location="center"
                color="#F2F1FF"
                text-color="primary"
              />
            </div>
            <div v-if="role.schedule?.attendance" class="d-flex align-center gap--2">
              <span class="fz-3_5 fw-500 text--neutral-2">{{
                _isLessonCompleted
                  ? $t('scheduleTracking.detail.attendance')
                  : $t('scheduleTracking.detail.selectAll')
              }}</span>
              <v-checkbox
                v-if="!_isLessonCompleted"
                @click.stop
                :model-value="isAttendanceForAll"
                density="compact"
                hide-details
                :disabled="_isLessonUpcoming || !store.canAttendanceList?.length"
                :indeterminate="!isAttendanceForAll && !isNoAttendance"
                @update:model-value="toggleAttendanceAll()"
              />
            </div>
          </div>
        </div>
        <div class="ml-14">
          <CollapseList :items="store.studentList || []">
            <template #item="{ item }: { item: IStudentInLesson }">
              <div class="d-flex align-center justify-space-between">
                <div class="ellipsis-one-line d-flex align-center gap--3 my-3 flex-1-1">
                  <div>
                    <v-img
                      class="rounded-circle"
                      :src="item?.avatar || icons.schDefaultAvatar"
                      :width="24"
                    />
                  </div>
                  <span
                    class="fz-3_5 fw-500 text--neutral-3"
                    :style="{ marginTop: '3px' }"
                  >
                    {{ item?.name }}
                  </span>
                </div>
                <div v-if="role.schedule?.attendance">
                  <div v-if="item?.leave?.status" class="handle-leave">
                    <span v-if="item.leave.status === LeaveRequestStatus.APPROVED">
                      {{ $t('scheduleTracking.absence.withLeave') }}
                    </span>
                    <span
                      v-else-if="
                        item.leave.status === LeaveRequestStatus.UNAPPROVED ||
                        _isLessonCompleted
                      "
                      >{{ $t('scheduleTracking.absence.withoutLeave') }}
                    </span>
                    <template v-if="role.schedule?.attendance">
                      <span v-if="item.leave.status !== LeaveRequestStatus.PROCESSING"
                        >/</span
                      >
                      <span class="handle" @click="() => openReasonDialog(item.id)">
                        {{
                          _isLessonCompleted
                            ? $t('scheduleTracking.absence.viewLeave')
                            : $t('scheduleTracking.absence.handle')
                        }}
                      </span>
                    </template>
                  </div>
                  <span
                    v-else-if="_isLessonCompleted && !item.timekeeping?.isAttended"
                    class="handle-leave"
                  >
                    {{ $t('scheduleTracking.absence.withoutLeave') }}
                  </span>
                  <v-checkbox
                    v-else
                    @click.stop
                    :model-value="!!store.studentsObj[item?.id].timekeeping?.isAttended"
                    class="flex-0"
                    density="compact"
                    :disabled="_isLessonUpcoming"
                    :readonly="_isLessonCompleted"
                    hide-details
                    @update:model-value="handleAttendance(item?.id)"
                  />
                </div>
              </div>
            </template>
          </CollapseList>
        </div>
        <div
          v-if="
            !_isLessonCompleted &&
            !_isLessonUpcoming &&
            role.schedule?.attendance &&
            !!store.canAttendanceList?.length
          "
          class="text-right"
        >
          <BaseButton
            size="extra-small"
            :label="$t('scheduleTracking.button.saveAttendance')"
            @click="saveAttendance"
            :is-disabled="!isDirtyAttendance"
            :is-loading="isUpdatingAttendance"
          />
        </div>
      </div>
      <div class="d-flex align-center gap--5">
        <span>
          <CircleIcon :icon="icons.schLocationYellow" size="small" bg-color="#FFF8E7" />
        </span>
        <div class="d-flex align-center justify-space-between flex-1-1">
          <div class="ellipsis-one-line">
            <span class="title">{{ $t('scheduleTracking.detail.room') }}</span>
            <a
              :href="store.detail.isUseGoogleMeet ? store.detail.meetUrl : undefined"
              :class="{ link: store.detail.isUseGoogleMeet }"
              target="_blank"
              >{{ store.detail.isUseGoogleMeet ? 'Google Meet' : store.detail?.room }}</a
            >
          </div>
          <span class="copy-room">
            <CircleIcon
              :icon="isCopied ? icons.schCopiedPurple : icons.schCopyPurple"
              @click="handleCopyRoom(room)"
            />
          </span>
        </div>
      </div>
    </div>
    <template #actions>
      <v-row class="justify-end">
        <BaseButton
          v-if="role.schedule?.updateTimeKeeping"
          size="small"
          :is-loading="dialogStore.isSubmitting"
          :label="
            hasTeacherBeenTimekeeping
              ? $t('scheduleTracking.button.hasTimekeeping')
              : $t('scheduleTracking.button.timekeeping')
          "
          @click="() => isAbleUpdateTimekeeping && handleTimekeepingForTeacher()"
          :is-disabled="!isAbleUpdateTimekeeping"
          button-class="px-16"
        />
        <BaseButton
          v-else-if="role.schedule?.createRequestLeave"
          size="small"
          :is-loading="dialogStore.isSubmitting"
          :label="
            hasStudentLeaveRequest
              ? $t('scheduleTracking.button.viewLeaveRequest')
              : $t('scheduleTracking.button.askToAbsence')
          "
          @click="() => openReasonDialog()"
          button-class="px-16"
        />
      </v-row>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.schedule-title {
  color: $color-black;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
}

.schedule-subtitle {
  font-size: 14px;
  line-height: 20px;
  color: $color-neutral-3;
}

.title {
  font-size: 16px;
  color: $color-neutral-1;
  font-weight: 500;
}

.handle-leave {
  font-size: 12px;
  font-weight: 500;
  line-height: 12px;
  color: $color-primary-1;
  .handle {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.link {
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: $color-neutral-3;

  &:hover {
    color: $color-neutral-1;
    text-decoration: underline;
  }
}

.copy-room {
  cursor: pointer;
  transition: transform 100;
  &:hover {
    transform: scale(1.1);
  }
}
:global(.schedule-dialog .v-card .v-card-item) {
  padding: 16px 24px 16px 24px !important;
  border-bottom: unset;
}
:global(.schedule-dialog .v-card .v-card-actions) {
  box-shadow: unset;
  padding-left: 36px;
  padding-right: 36px;
}
</style>
