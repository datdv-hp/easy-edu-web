<script lang="ts" setup>
import { useRole } from '@/common/stores/role.store';
import { BaseButton, BaseDialog, InputTextarea } from '@/components';
import { onMounted, ref } from 'vue';
import {
  useReasonDialog,
  useSCheduleTrackingDialog,
  useScheduleTrackingStore,
} from '../stores';
import { useForm } from 'vee-validate';
import { reasonSchema } from '../schema';
import { LeaveRequestStatus } from '../constants';
import { useUserStore } from '@/features/auth/stores';
import { computed } from 'vue';
import { ILessonLeave } from '../interfaces';
import { isLessonCompleted } from '../helpers';
import { useI18n } from 'vue-i18n';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';

const { t } = useI18n();
const store = useScheduleTrackingStore();
const dialogStore = useSCheduleTrackingDialog();
const reasonDialogStore = useReasonDialog();
const userStore = useUserStore();
const role = useRole();
const leave = ref<ILessonLeave>();
const isAgreeSubmitting = ref(false);
const isDisagreeSubmitting = ref(false);
const { handleSubmit, meta, values } = useForm<{ reason: string }>({
  validationSchema: reasonSchema,
});

const handleCloseDialog = () => {
  reasonDialogStore.close();
};
const handleLeaveRequest = async (status: LeaveRequestStatus) => {
  if (!leave.value?.id) return;
  const res = await store.handleLeaveRequest(leave.value.id, {
    status,
  });
  if (res.success) {
    const studentId = reasonDialogStore.studentId as string;
    store.updateLeaveRequestStatus(studentId, status);
    reasonDialogStore.close();
  }
};

const agreeLeaveRequest = async () => {
  isAgreeSubmitting.value = true;
  await handleLeaveRequest(LeaveRequestStatus.APPROVED);
  isAgreeSubmitting.value = false;
};
const disagreeLeaveRequest = async () => {
  isDisagreeSubmitting.value = true;
  await handleLeaveRequest(LeaveRequestStatus.UNAPPROVED);
  isDisagreeSubmitting.value = false;
};

const handleClickSubmit = handleSubmit(async () => {
  const res = await store.createLeaveRequest({
    lessonId: dialogStore.currentId,
    reason: values.reason,
  });
  if (res.success) {
    reasonDialogStore.close();
  }
});

const handleDeleteRequestLeave = async () => {
  reasonDialogStore.isSubmitting = true;
  const response = await store.deleteLeaveRequest(leave.value?.id);
  reasonDialogStore.isSubmitting = false;
  if (response?.success) {
    store.studentsObj[leave.value?.userId as string].leave = undefined;
    reasonDialogStore.close();
    showSuccessNotification(t('scheduleTracking.notification.success.leave.delete'));
  } else {
    showErrorNotification(t('scheduleTracking.notification.error.leave.delete'));
  }
};

const isLeaveRequestOwner = computed(
  () => !!leave.value?.id && leave.value?.userId === userStore?.profile?.id,
);

const isAbleDeleteLeaveRequest = computed(
  () =>
    !!leave.value?.id &&
    leave.value.status === LeaveRequestStatus.PROCESSING &&
    role.schedule?.deleteLeaveRequest,
);

const _isLessonCompleted = computed(() => {
  const date = store.detail?.date;
  const endTime = store.detail?.endTime;
  if (!date || !endTime) return false;
  return isLessonCompleted(date, endTime);
});

onMounted(() => {
  let studentId: string;
  if (reasonDialogStore.isProcessLeave) {
    studentId = reasonDialogStore.studentId as string;
  } else {
    studentId = userStore?.profile?.id as string;
  }
  leave.value = store.studentsObj?.[studentId]?.leave;
  values.reason = leave.value?.reason as string;
});
</script>

<template>
  <BaseDialog
    :width="480"
    :content-class="`ps-6 pe-6 pt-0 pb-2 ${!leave?.id ? 'h-190px' : 'h-160px'}`"
    wrapper-class="schedule-dialog"
    :hide-action-buttons="true"
    :loading="reasonDialogStore.isFetching"
    :hide-footer="
      _isLessonCompleted || (!isAbleDeleteLeaveRequest && isLeaveRequestOwner)
    "
    @close="handleCloseDialog"
  >
    <InputTextarea
      v-if="!leave?.id"
      name="reason"
      :label="$t('scheduleTracking.reason.description.label')"
      :placeholder="$t('scheduleTracking.reason.description.placeholder')"
      :is-required="true"
      :readonly="!!leave?.id"
      :max-length="1000"
      :counter="1000"
    />
    <div v-else class="leave-reason">
      {{ leave?.reason }}
    </div>
    <template #title>
      <span class="reason-title">{{ $t('scheduleTracking.reason.title') }}</span>
    </template>
    <template #actions>
      <v-row class="gap-3">
        <template v-if="reasonDialogStore.isProcessLeave && role.schedule?.attendance">
          <BaseButton
            class="flex-1-1"
            size="small"
            variant="outline"
            :is-loading="isDisagreeSubmitting"
            :is-disabled="leave?.status === LeaveRequestStatus.UNAPPROVED"
            :label="$t('scheduleTracking.button.disagree')"
            @click="() => role.schedule?.attendance && disagreeLeaveRequest()"
          />
          <BaseButton
            class="flex-1-1"
            size="small"
            :is-loading="isAgreeSubmitting"
            :label="$t('scheduleTracking.button.agree')"
            :is-disabled="leave?.status === LeaveRequestStatus.APPROVED"
            @click="() => role.schedule?.attendance && agreeLeaveRequest()"
          />
        </template>
        <template v-else-if="isLeaveRequestOwner && role.schedule?.deleteLeaveRequest">
          <BaseButton
            class="mx-auto"
            size="small"
            variant="outline"
            :is-loading="reasonDialogStore.isSubmitting"
            :label="$t('scheduleTracking.button.cancelRequest')"
            @click="() => handleDeleteRequestLeave()"
          />
        </template>
        <template v-else>
          <BaseButton
            class="flex-1-1"
            size="small"
            variant="outline"
            :label="$t('common.button.cancel')"
            @click="handleCloseDialog"
          />
          <BaseButton
            class="flex-1-1"
            size="small"
            :is-loading="reasonDialogStore.isSubmitting"
            :label="$t('scheduleTracking.button.send')"
            :is-disabled="!meta.valid"
            @click="handleClickSubmit"
          />
        </template>
      </v-row>
    </template>
  </BaseDialog>
</template>
<style lang="scss" scoped>
.reason-title {
  color: $color-black;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
}

.leave-reason {
  padding: 8px 16px;
  height: 136px;
  overflow-y: auto;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  color: $color-text-black;

  scrollbar-gutter: stable;
  &::-webkit-scrollbar {
    // display: block;
    visibility: hidden;
    background-color: #fff;
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    visibility: hidden;
    background-color: $color-neutral-6;
    border-radius: 6px;
  }

  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
}
</style>
