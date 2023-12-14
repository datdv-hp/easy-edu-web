<script setup lang="ts">
import { ErrorCode } from '@/common/constants';
import {
  compareFormData,
  convertToOptions,
  getDiffFormData,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { useGoogleAuthStore } from '@/common/stores';
import { useRole } from '@/common/stores/role.store';
import { BaseAutoComplete, BaseButton, CheckboxInput, InputText } from '@/components';
import {
  GOOGLE_CALENDAR_SCOPES,
  GOOGLE_LOGIN_REDIRECT_URI,
} from '@/features/auth/auth.constants';
import { IGoogleLoginLinkParams } from '@/features/auth/interfaces';
import { useLessonDialog, useLessonStore } from '@/features/lesson/stores';
import dayjs from 'dayjs';
import { cloneDeep, uniqueId } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { LessonTimeItemAction, lessonTimeItemDefault } from '../constants';
import {
  checkOverlapTimes,
  convertToLesson,
  generateLessons,
  generatePreviewTimes,
} from '../helpers';
import { lessonApiService } from '../lesson.api';
import { createLessonFormSchema, updateLessonFormSchema } from '../schema';
import InputTextItem from './InputTextItem.vue';
import LessonTimeItem from './LessonTimeItem.vue';
import { googleAuthApi } from '@/features/auth/services';
import {
  GOOGLE_AUTH_SERVICE_KEY,
  localStorageGoogleAuthService,
} from '@/common/storages';
import { useLocalStorage } from '@vueuse/core';
import { onBeforeMount } from 'vue';

const { t } = useI18n();
const store = useLessonStore();
const role = useRole();
const dialogStore = useLessonDialog();
const googleAuthStore = useGoogleAuthStore();

const emit = defineEmits<{
  (event: 'preview'): void;
  (event: 'update', values: Record<string, unknown>): void;
  (event: 'update-not-existed'): void;
  (event: 'createSuccess'): void;
}>();
const oldForm = ref();

const {
  handleSubmit,
  resetForm,
  setValues,
  meta,
  values: formValue,
  setFieldError,
  validate,
  setFieldValue,
} = useForm({
  validationSchema: dialogStore.isUpdate
    ? updateLessonFormSchema
    : createLessonFormSchema,
});

const { value: isUseGoogleMeet } = useField('isUseGoogleMeet');
const {
  value: studentIds,
  setValue: setStudentIds,
  resetField: resetStudentIds,
} = useField<string[]>('studentIds');
const { resetField: resetSubject } = useField('subject');
const { value: documents } = useField<string[]>('documents', undefined, {
  initialValue: [''],
});
const { meta: lessonTimeListMeta } = useField('timeList');

// Google
const googleCode = useLocalStorage(
  GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_CODE,
  localStorageGoogleAuthService.getGoogleLoginCode(),
  { listenToStorageChanges: true, initOnMounted: true },
);
const googleEmail = useLocalStorage(
  GOOGLE_AUTH_SERVICE_KEY.GOOGLE_LOGIN_EMAIL,
  localStorageGoogleAuthService.getGoogleLoginEmail(),
  { listenToStorageChanges: true, initOnMounted: true },
);

const isValidSubmit = computed(() => {
  return (
    meta.value.valid &&
    !compareFormData(oldForm.value, formValue) &&
    (!formValue.isUseGoogleMeet || (formValue.isUseGoogleMeet && googleCode.value))
  );
});
const isValidPreview = computed(() => meta.value.valid);

const resetGoogleInfo = () => {
  localStorageGoogleAuthService.resetGoogleLoginCode();
  localStorageGoogleAuthService.resetGoogleLoginEmail();
};

onBeforeMount(async () => {
  const googleCode = localStorageGoogleAuthService.getGoogleLoginCode();
  const googleEmail = localStorageGoogleAuthService.getGoogleLoginEmail();
  if (googleCode && googleEmail) {
    await getGoogleEmail();
  } else {
    resetGoogleInfo();
  }
});

const getGoogleEmail = async () => {
  googleAuthApi
    .getGoogleLoginEmail({
      code: googleCode.value,
      redirectUri: GOOGLE_LOGIN_REDIRECT_URI,
    })
    .then((res) => {
      if (!res.success) {
        resetGoogleInfo();
      }
    });
};

onMounted(async () => {
  dialogStore.isFetching = true;
  if (dialogStore.isUpdate) {
    const response = await store.getDetail(dialogStore.currentId);
    if (!response.success) {
      return;
    }
    const item = convertToLesson(response.data);
    store.setSelectedClassroomId(item.classroom.id);
    store.setSelectedSubjectId(item.subject.id);

    if (role.lesson?.update || role.schedule?.updateLesson) {
      await Promise.all([
        store.getSubjectOptions(),
        store.getClassroomOptions(),
        store.getTeacherOptions(),
        store.getStudentOptions(),
      ]);
    } else {
      store.subjectOptions = convertToOptions([item.subject], true);
      store.teacherOptions = convertToOptions([item.teacher], true);
      store.classroomOptions = convertToOptions([item.classroom], true);
      store.studentOptions = convertToOptions(item.students, true);
    }
    store.getSyllabusOptions();
    if (item.syllabusId) {
      store.getLectureOptions(item.syllabusId);
    }

    const selectedStudentIds = item.students?.map((student) => student.id);
    setValues({
      name: item.name,
      teacherId: item.teacher.id,
      classroomId: item.classroom.id,
      subjectId: item.subject.id,
      documents: item.documents?.length ? item.documents : [''],
      isUseGoogleMeet: !!item.isUseGoogleMeet,
      syllabusId: item.syllabusId,
      lectureIds: item.lectureIds,
      room: !item.isUseGoogleMeet ? item.room : undefined,
      studentIds: selectedStudentIds,
      timeList: [
        {
          ...lessonTimeItemDefault,
          startTime: item.startTime,
          endTime: item.endTime,
          startDate: item.date,
        },
      ],
    });
    oldForm.value = cloneDeep(formValue);
    validate();
  } else {
    await Promise.all([store.getTeacherOptions(), store.getClassroomOptions()]);
    setFieldValue('timeList', [
      {
        ...lessonTimeItemDefault,
        startTime: dialogStore.initValue?.startTime,
        endTime: dialogStore.initValue?.endTime,
        startDate: dialogStore.initValue?.date || dayjs().toDate(),
      },
    ]);
  }
  dialogStore.isFetching = false;
});

const handleCloseDialog = () => {
  resetForm();
  dialogStore.close();
  store.resetRemovedPreviewTimeIndexes();
};

const invalidStudentNames = (invalidIds: string[]) => {
  return invalidIds.map((id) => store.studentOptionsObj[id]).join(', ');
};
// Handle errors
const handleStudentInOtherLessonError = (errorData: any[], i18nKey: string) => {
  ((store.previewTimes as any[]) || []).forEach((lesson) => {
    const _lessonErr = errorData.find((err) =>
      dayjs(lesson?.date).isSame(dayjs(err?.date), 'day'),
    );
    if (_lessonErr) {
      const _studentsName = _lessonErr.studentsExistLesson
        .map((id) => store.studentOptionsObj[id])
        .join(', ');
      Object.assign(lesson, {
        error: t(i18nKey, { students: _studentsName }),
      });
    }
  });
};

const handleCoincidedLessonError = (errorData: any[], i18nKey: string) => {
  ((store.previewTimes as any[]) || []).forEach((lesson) => {
    const _lessonErr = errorData.find((err) =>
      dayjs(lesson?.date).isSame(dayjs(err?.date), 'day'),
    );
    if (_lessonErr) {
      Object.assign(lesson, {
        error: t(i18nKey),
      });
    }
  });
};

const handleTeacherInOtherLessonError = (errorData: any[], i18nKey: string) => {
  ((store.previewTimes as any[]) || []).forEach((lesson) => {
    const _lessonErr = errorData.find((err) =>
      dayjs(lesson?.date).isSame(dayjs(err?.date), 'day'),
    );
    if (_lessonErr) {
      Object.assign(lesson, {
        error: t(i18nKey),
      });
    }
  });
};
const itemAlreadyExistErrorFunctions = {
  teacher: handleTeacherInOtherLessonError,
  students: handleStudentInOtherLessonError,
  classroom: handleCoincidedLessonError,
};
const handleClickPreview = () => {
  store.previewTimes = generatePreviewTimes(cloneDeep(formValue.timeList) || []);
  store.lessonName = formValue.name;
  emit('preview');
};
const handleCreateErrors = (errors: IResponseError[]) => {
  (errors || []).forEach((error) => {
    const errorCode = error.errorCode;
    const errorKey = error.key;
    const i18nKey = `lesson.create.${errorCode}.${errorKey}`;
    switch (errorCode) {
      case ErrorCode.ITEM_NOT_FOUND: {
        setFieldError(errorKey, t(i18nKey));
        break;
      }
      case ErrorCode.ITEM_INVALID: {
        if (errorKey === 'student') {
          const invalidStudentIds = error?.data as string[];
          const studentNames = invalidStudentNames(invalidStudentIds);
          showErrorNotification(t(i18nKey, { students: studentNames }));
        }
        showErrorNotification(t(i18nKey));
        break;
      }
      case ErrorCode.GROUP_MAX_QUANTITY: {
        showErrorNotification(t(i18nKey));
        break;
      }
      case ErrorCode.ITEM_ALREADY_EXIST: {
        handleClickPreview();
        const errorData = error?.data as any[];
        itemAlreadyExistErrorFunctions[errorKey](errorData, i18nKey);
        break;
      }
      default:
        showErrorNotification(t('lesson.notification.error.create'));
        break;
    }
  });
};

const handleUpdateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const i18nKey = `lesson.update.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      handleCloseDialog();
      emit('update-not-existed');
      break;
    case ErrorCode.GROUP_MAX_QUANTITY:
    case ErrorCode.ITEM_ALREADY_EXIST:
    case ErrorCode.ITEM_INVALID:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('lesson.notification.error.update'));
      break;
  }
};
const handleCreate = handleSubmit(async () => {
  dialogStore.isSubmitting = true;
  const times = store.getPreviewTimesToSubmit();
  if (formValue.isUseGoogleMeet && !googleCode.value) {
    await getGoogleLoginLink();
  }

  const body = generateLessons(
    {
      ...formValue,
      code: formValue.isUseGoogleMeet ? googleCode.value : undefined,
      redirectUri: formValue.isUseGoogleMeet ? GOOGLE_LOGIN_REDIRECT_URI : undefined,
    },
    times,
  );
  const res = await lessonApiService.create(body);
  dialogStore.isSubmitting = false;
  // localStorageGoogleAuthService.resetGoogleLoginCode();
  if (res.success) {
    showSuccessNotification(t('lesson.notification.success.create'));
    handleCloseDialog();
    emit('createSuccess');
    return;
  }
  if (res?.errors?.length) {
    handleCreateErrors(res.errors);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

const handleClickUpdate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const diffFormData = getDiffFormData(oldForm.value, values, [
    'startTime',
    'endTime',
    'startDate',
  ]);
  if (diffFormData?.isUseGoogleMeet) {
    diffFormData['code'] = googleCode.value;
  }
  const res = await store.update(dialogStore.currentId as string, diffFormData);
  if (res.success) {
    emit('update', res.data);
    showSuccessNotification(t('lesson.notification.success.edit'));
    // localStorageGoogleAuthService.resetGoogleLoginCode();
    handleCloseDialog();
    return;
  }
  if (res?.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  dialogStore.isSubmitting = false;
});

const isAbleAddDocuments = computed(() => documents.value?.length < 5);

const onUpdateSelectedSubject = async (value?: string) => {
  // set created lessons of subject
  const option = store.subjectOptions.find((_option) => _option.value === value);
  const createdLessons = option?.other?.countLesson as number;
  const totalLessons = option?.other?.time as number;
  store.setTotalLessons(totalLessons);
  store.setCreatedLessons(createdLessons);

  store.setSelectedSubjectId(value);
};
const onUpdateSelectedClassroom = async (value?: string) => {
  store.setSelectedClassroomId(value);
  store.setSelectedSubjectId(undefined);
  resetSubject();
  resetStudentIds();
  await Promise.all([
    store.getSubjectOptions(),
    store.getStudentOptions(),
    store.getSyllabusOptions(),
  ]);
  // Select all students by default
  const _studentIds = store.studentOptions.map((option) => option.value) as string[];
  setStudentIds(_studentIds);
};

function onUpdateSelectedSyllabusId(id: string) {
  setFieldValue('lectureIds', []);
  if (id) {
    store.getLectureOptions(id);
  }
}

const totalStudents = computed(() => studentIds.value?.length || 0);
const isFirst = (index: number) => {
  return index === 0;
};

const onClickDocumentButton = (index: number) => {
  const document = cloneDeep(formValue.documents);
  if (isFirst(index) && isAbleAddDocuments.value) {
    document.push('');
  } else {
    document.splice(index, 1);
  }
  setFieldValue('documents', document);
};

const isAbleToUpdate = computed(() => {
  return (
    (role.lesson?.update ||
      role.lesson?.create ||
      role.schedule?.updateLesson ||
      role.schedule?.createLesson) &&
    store.isAbleToUpdate
  );
});

const changeLessonTimeList = ({ action, index }: any) => {
  if (action === LessonTimeItemAction.ADD) {
    formValue.timeList.push({ ...lessonTimeItemDefault, feId: uniqueId() });
  }
  if (action === LessonTimeItemAction.REMOVE) {
    formValue.timeList.splice(index, 1);
    const errorIndexes = store.errorPreviewTimeIndexes?.filter(
      (errorIndex) => errorIndex === index,
    );
    store.errorPreviewTimeIndexes = errorIndexes;
  }
};
const getGoogleLoginLink = async (): Promise<void> => {
  const params: IGoogleLoginLinkParams = {
    redirectUri: GOOGLE_LOGIN_REDIRECT_URI,
    scopes: GOOGLE_CALENDAR_SCOPES,
  };
  await googleAuthStore.generateGoogleLoginLink(params);
  if (googleAuthStore.googleLoginLink) {
    const width = 500,
      height = 500;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(googleAuthStore.googleLoginLink, '_blank', features);
  }
};

watch(lessonTimeListMeta, () => {
  if (!formValue.timeList) return;
  store.previewTimes = generatePreviewTimes(cloneDeep(formValue.timeList));
  const listOverLap = checkOverlapTimes(
    store.previewTimes,
    store.removedPreviewTimeIndexes,
  );
  store.setErrorOverlapPreviewTimes(
    listOverLap,
    t('lesson.form.message.overlapTimeError'),
  );
});

defineExpose({
  isValidSubmit,
  handleCreate,
  handleClickUpdate,
});
</script>

<template>
  <div class="bg-color-white px-5 py-6 rounded--1_5">
    <v-row>
      <v-col cols="12" class="pb-2">
        <span class="fz-4_5 fw-600 text--black">{{
          t('lesson.form.title.infoTitle')
        }}</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <BaseAutoComplete
          name="classroomId"
          :is-loading="dialogStore.isFetching"
          :label="$t('lesson.form.classroom')"
          :placeholder="$t('lesson.form.placeholder.classroom')"
          is-required
          :items="store.classroomOptions"
          @change="(value) => onUpdateSelectedClassroom(value)"
          clearable
          :is-disabled="!isAbleToUpdate"
        >
        </BaseAutoComplete>
      </v-col>
      <v-col cols="6">
        <BaseAutoComplete
          name="subjectId"
          :is-loading="dialogStore.isFetching"
          :label="$t('lesson.form.subject')"
          :placeholder="$t('lesson.form.placeholder.subject')"
          :items="store.subjectOptions"
          @change="(value) => onUpdateSelectedSubject(value)"
          clearable
          :is-disabled="!store.selectedClassroomId || !isAbleToUpdate"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <InputText
          name="name"
          :label="$t('lesson.form.name')"
          :placeholder="$t('lesson.form.placeholder.name')"
          is-required
          :disabled="!isAbleToUpdate"
        />
      </v-col>
      <v-col cols="6">
        <BaseAutoComplete
          name="teacherId"
          :is-loading="dialogStore.isFetching"
          :label="$t('lesson.form.teacher')"
          :placeholder="$t('lesson.form.placeholder.teacher')"
          is-required
          :items="store.teacherOptions"
          :is-disabled="!isAbleToUpdate"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <BaseAutoComplete
          name="syllabusId"
          :label="$t('lesson.form.syllabus')"
          :placeholder="$t('lesson.form.placeholder.syllabus')"
          :items="store.syllabusOptions"
          :is-disabled="!formValue.classroomId"
          @change="onUpdateSelectedSyllabusId"
        />
      </v-col>
      <v-col cols="6">
        <BaseAutoComplete
          name="lectureIds"
          :is-loading="dialogStore.isFetching"
          :label="$t('lesson.form.lecture')"
          :placeholder="$t('lesson.form.placeholder.lecture')"
          multiple
          :is-required="!!formValue?.syllabusId"
          :is-disabled="!formValue.syllabusId"
          :items="store.lectureOptions"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <BaseAutoComplete
          name="studentIds"
          :items="store.studentOptions"
          multiple
          :is-disabled="!store.selectedClassroomId || !isAbleToUpdate"
          :label="$t('lesson.form.student')"
          :placeholder="$t('lesson.form.placeholder.student')"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-0 d-flex align-center">
        <CheckboxInput
          name="isUseGoogleMeet"
          :label="$t('lesson.form.useGoogleMeet')"
          :readonly="!isAbleToUpdate"
          font-size="16px"
          label-class="ml-2"
          :default="true"
        />
        <div v-if="googleEmail" class="google-email">
          <span>{{ googleEmail }} </span>
          <v-tooltip text="Chuyển đổi tài khoản" :delay-open="150" location="top">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-sync" @click.stop="getGoogleLoginLink"
            /></template>
          </v-tooltip>
        </div>
        <v-tooltip
          v-else
          text="Nhấn để đăng nhập tài khoản Google"
          :delay-open="150"
          location="top"
        >
          <template #activator="{ props }">
            <div v-bind="props" class="login-google" @click.stop="getGoogleLoginLink">
              {{ $t('auth.button.login') }}
            </div>
          </template>
        </v-tooltip>
      </v-col>
      <v-col cols="6" class="d-flex align-center gap-1 fz-4 fw-500 py-0">
        <span class="text--neutral-1">{{ $t('lesson.form.totalStudents') + ':' }}</span>
        <span class="text--neutral-4">{{ totalStudents }}</span>
      </v-col>
    </v-row>
    <v-row :class="{ hidden: isUseGoogleMeet }">
      <v-col cols="12">
        <InputText
          name="room"
          :label="$t('lesson.form.room')"
          :placeholder="$t('lesson.form.placeholder.room')"
          is-required
          :disabled="!isAbleToUpdate"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-for="(_, index) in formValue.documents" :key="index">
        <InputTextItem
          :name="`documents[${index}]`"
          :index="index"
          :label="$t('lesson.form.document')"
          :placeholder="$t('lesson.form.placeholder.document')"
          :isAbleAddItem="isAbleAddDocuments"
          @click-btn-action="onClickDocumentButton(index)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <span class="fz-4_5 fw-600 text--black">{{
          t('lesson.form.title.timeTitle')
        }}</span>
        <LessonTimeItem
          v-for="(item, index) in formValue.timeList"
          :index="index"
          :item="item"
          :key="index"
          :is-able-to-update="isAbleToUpdate"
          :isUpdate="dialogStore.isUpdate"
          :errorMessage="
            store.errorPreviewTimeIndexes.includes(index)
              ? $t('lesson.form.message.overlapTimeError')
              : undefined
          "
          @clickAction="(action) => changeLessonTimeList({ action, index })"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex align-center justify-center">
        <BaseButton
          v-if="!dialogStore.isUpdate"
          :label="$t('lesson.form.preview')"
          size="small"
          variant="solid"
          :is-disabled="!isValidPreview || !!store.errorPreviewTimeIndexes?.length"
          @click="handleClickPreview"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.hidden {
  display: none;
}
.login-google {
  font-size: 12px;
  padding-top: 4px;
  margin-left: 6px;
  color: $color-primary-1;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
.google-email {
  display: flex;
  align-items: center;
  font-size: 12px;
  padding-top: 4px;
  gap: 4px;
  margin-left: 6px;
  color: $color-neutral-3;
}
</style>
