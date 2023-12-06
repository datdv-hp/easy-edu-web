<script lang="ts" setup>
import { ErrorCode, PageName } from '@/common/constants';
import {
  compareFormData,
  getDiffFormData,
  scrollToIdElement,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { BaseDialog, InputTextarea } from '@/components';
import { commonApiService } from '@/features/common/services/common.api';
import { initLecture } from '@/features/syllabus/constants';
import {
  checkDuplicateLecturesName,
  convertToSyllabusLecture,
  validateLecturesEmpty,
} from '@/features/syllabus/helpers';
import { ISyllabusLecture } from '@/features/syllabus/interfaces';
import {
  createLectureFormSchema,
  updateLectureFormSchema,
} from '@/features/syllabus/schema';
import { lectureApiService } from '@/features/syllabus/services';
import {
  useLectureDialog,
  useSyllabusDetail,
  useSyllabusStore,
} from '@/features/syllabus/stores';
import router from '@/plugins/vue-router';
import { cloneDeep } from 'lodash';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import SyllabusLectures from '../../create/components/SyllabusLectures.vue';

const route = useRoute();
const dialogStore = useLectureDialog();
const store = useSyllabusDetail();
const syllabusStore = useSyllabusStore();
const oldForm = ref();
const { t } = useI18n();

// const initLecture = { name: undefined, files: [] };
const syllabusId = route.params.id as string;
const formTitle = computed(() =>
  dialogStore.isUpdate
    ? t('syllabus.lectureDialog.update.title')
    : t('syllabus.lectureDialog.create.title'),
);

const {
  values: formValue,
  resetForm,
  meta,
  handleSubmit,
  setValues: setFormValue,
  setFieldValue,
  setFieldError,
} = useForm({
  validationSchema: dialogStore.isUpdate
    ? updateLectureFormSchema
    : createLectureFormSchema,
});
const isChangedForm = computed(
  () => !compareFormData(oldForm.value, formValue, ['note']),
);

const isValidSubmit = computed(() => meta.value.valid && isChangedForm.value);

onMounted(async () => {
  dialogStore.isFetching = true;
  syllabusStore.getSubjectDropdown();
  if (dialogStore.isUpdate) {
    await getLectureDetails();
  }
  if (!formValue?.lectures?.length) {
    setFieldValue('lectures', [cloneDeep(initLecture)]);
  }
  dialogStore.isFetching = false;
});

function goToListPage() {
  router.replace({ name: PageName.SYLLABUS_LIST_PAGE });
}

async function getLectureDetails() {
  const res = await lectureApiService.getDetails(store.selectedLectureIdList);
  if (res.success) {
    const lectures = res.data?.map((item) => {
      return {
        ...initLecture,
        ...convertToSyllabusLecture(item),
        referenceLinks: (item.referenceLinks as string[])?.length
          ? item.referenceLinks
          : [''],
      };
    });
    setFormValue({
      note: '',
      lectures,
    });
    oldForm.value = cloneDeep(formValue);
    return;
  }
  if (res.errors?.length) {
    const error = res.errors[0];
    if (error.errorCode === ErrorCode.ITEM_NOT_FOUND) {
      handleCloseDialog();
      showErrorNotification(error.message);
      goToListPage();
      return;
    }
  }
  showErrorNotification(res.error || res.message);
}

function handleCloseDialog() {
  resetForm();
  dialogStore.close();
  syllabusStore.setLectureErrorIndexes([]);
}

function handleAddLecture() {
  const lectures = cloneDeep(formValue.lectures);
  lectures.push(cloneDeep(initLecture));
  setFieldValue('lectures', lectures);
}

function handleDeleteFile(urls: string[]) {
  commonApiService._deleteUploadedFiles(urls);
}

function handleRemoveLecture(index: number) {
  const files = formValue.lectures[index].files;
  if (files.length) {
    const urls = files.map((file) => file.link);
    handleDeleteFile(urls);
  }
  formValue.lectures.splice(index, 1);
}

function findDuplicatedIndexes(lectureIdsOrNames: string[]) {
  return lectureIdsOrNames.map((idOrName) => {
    return formValue.lectures.findIndex(
      (lecture) => lecture.id === idOrName || lecture.name.trim() === idOrName,
    );
  });
}

function handleUpdateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `syllabus.updateError.${errorCode}.lecture.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST: {
      const duplicateIndexes = findDuplicatedIndexes(error.data as string[]);
      duplicateIndexes.forEach((idx) => {
        setFieldError(`lectures[${idx}].${errorKey}`, t(i18nKey));
      });
      const minIndex = Math.min(...duplicateIndexes);
      scrollToIdElement(`syllabus-lectures-${minIndex}`);
      break;
    }
    case ErrorCode.ITEM_NOT_FOUND: {
      showErrorNotification(t(i18nKey));
      handleCloseDialog();
      store.getLectureList(syllabusId);
      store.getUpdateHistoryList(syllabusId);
      store.selectedLectureIds = {};
      break;
    }
    default:
      showErrorNotification(t('syllabus.error.update'));
      break;
  }
}

const handleClickCreate = handleSubmit(async (values) => {
  // check empty document of lecture
  const { valid: isValidLectures, errorIndexes } = validateLecturesEmpty(
    values.lectures as ISyllabusLecture[],
  );
  if (!isValidLectures) {
    syllabusStore.setLectureErrorIndexes(errorIndexes);
    return;
  }

  // check duplicate lecture name
  const { valid: isDuplicateLectureName, errorIndexes: duplicateIndexes } =
    checkDuplicateLecturesName(values.lectures as ISyllabusLecture[]);
  if (isDuplicateLectureName) {
    duplicateIndexes.forEach((idx) => {
      setFieldError(
        `lectures[${idx}].name`,
        t('syllabus.form.message.duplicateLectureName'),
      );
    });
    const minIndex = Math.min(...duplicateIndexes);
    scrollToIdElement(`syllabus-lectures-${minIndex}`);
    return;
  }
  dialogStore.isSubmitting = true;
  const res = await store.createLectures(syllabusId, values);
  if (res.success) {
    showSuccessNotification(t('syllabus.success.update'));
    handleCloseDialog();
    store.getBasicInfo(syllabusId), store.getLectureList(syllabusId);
    store.getUpdateHistoryList(syllabusId);
    return;
  }
  if (res.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  dialogStore.isSubmitting = false;
});

const handleClickUpdate = handleSubmit(async (values) => {
  const { valid: isValidLectures, errorIndexes } = validateLecturesEmpty(
    values.lectures as ISyllabusLecture[],
  );
  if (!isValidLectures) {
    syllabusStore.setLectureErrorIndexes(errorIndexes);
    return;
  }

  // check duplicate lecture name
  const { valid: isDuplicateLectureName, errorIndexes: duplicateIndexes } =
    checkDuplicateLecturesName(values.lectures as ISyllabusLecture[]);
  if (isDuplicateLectureName) {
    duplicateIndexes.forEach((idx) => {
      setFieldError(
        `lectures[${idx}].name`,
        t('syllabus.form.message.duplicateLectureName'),
      );
    });
    const minIndex = Math.min(...duplicateIndexes);
    scrollToIdElement(`syllabus-lectures-${minIndex}`);
    return;
  }
  dialogStore.isSubmitting = true;
  const res = await store.updateLectures(
    syllabusId,
    getDiffFormData(oldForm.value, values),
  );
  if (res.success) {
    showSuccessNotification(t('syllabus.success.update'));
    handleCloseDialog();
    store.getBasicInfo(syllabusId);
    store.getLectureList(syllabusId);
    store.getUpdateHistoryList(syllabusId);
    store.selectedLectureIds = {};
    return;
  }
  if (res.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  dialogStore.isSubmitting = false;
});

function submit() {
  if (dialogStore.isUpdate) {
    handleClickUpdate();
    return;
  }
  handleClickCreate();
}
</script>
<template>
  <BaseDialog
    @close="handleCloseDialog"
    :overlay="dialogStore.isFetching"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit"
    :title="formTitle"
    :width="624"
    @submit="submit"
  >
    <v-row>
      <v-col cols="12" class="py-2">
        <InputTextarea
          name="note"
          :is-required="true"
          :label="t('syllabus.form.note.label')"
          :placeholder="t('syllabus.form.note.placeholder')"
          :disabled="!isChangedForm"
          :max-length="500"
          :counter="500"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <SyllabusLectures
          name="lectures"
          :lectures="formValue.lectures"
          @add-lecture="handleAddLecture"
          @remove-lecture="handleRemoveLecture"
          :is-show-add="!dialogStore.isUpdate"
        />
      </v-col>
    </v-row>
  </BaseDialog>
</template>
<style lang="scss" scoped></style>
