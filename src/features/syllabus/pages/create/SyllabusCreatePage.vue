<script lang="ts" setup>
import { ErrorCode, PageName } from '@/common/constants';
import {
  compareFormData,
  scrollToIdElement,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { BaseButton, InputText } from '@/components';
import { commonApiService } from '@/features/common/services/common.api';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import router from '@/plugins/vue-router';
import { cloneDeep } from 'lodash';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { createSyllabusFormSchema } from '../../schema';
import { useSyllabusStore } from '../../stores';
import SyllabusLectures from './components/SyllabusLectures.vue';
import SyllabusCoverImage from '../../components/SyllabusCoverImage.vue';
import { initLecture } from '../../constants';
import { ISyllabusLecture } from '../../interfaces';
import { checkDuplicateLecturesName, validateLecturesEmpty } from '../../helpers';
import { onBeforeUnmount } from 'vue';

const { t } = useI18n();
const store = useSyllabusStore();
const oldForm = ref();

const {
  values: formValue,
  resetForm,
  meta,
  handleSubmit,
  setFieldValue,
  setFieldError,
} = useForm({
  validationSchema: createSyllabusFormSchema,
});

const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);

const isSubmitting = ref(false);
// Hooks
onMounted(async () => {
  store.getSubjectDropdown();
  setFieldValue('lectures', [cloneDeep(initLecture)]);
});
// Hook end

// Handle errors
function handleCreateErrors(error: IResponseError) {
  const { errorCode, key } = error;
  const i18nKey = `syllabus.createError.${errorCode}.${key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(key, t(i18nKey));
      break;

    default:
      showErrorNotification(t('syllabus.error.create'));
      break;
  }
}
// Handle errors end

const handleClickCreate = handleSubmit(async (values) => {
  // check empty document of lecture
  const { valid: isValidLectures, errorIndexes } = validateLecturesEmpty(
    values.lectures as ISyllabusLecture[],
  );
  if (!isValidLectures) {
    store.setLectureErrorIndexes(errorIndexes);
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

  isSubmitting.value = true;
  const res = await store.create(values);
  if (res.success) {
    showSuccessNotification(t('syllabus.success.create'));
    resetForm();
    isSubmitting.value = false;
    store.setLectureErrorIndexes([]);
    goToListPage();
    return;
  }
  if (res.errors?.length) {
    handleCreateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  isSubmitting.value = false;
});

function goToListPage() {
  router.replace({ name: PageName.SYLLABUS_LIST_PAGE });
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

function handleClickCancel() {
  goToListPage();
}

onBeforeUnmount(() => {
  store.setLectureErrorIndexes([]);
});
</script>
<template>
  <HeaderBar>
    <template #title>{{ $t('syllabus.form.title.create') }}</template>
    <template #append>
      <BaseButton
        class="mr-2"
        size="extra-small"
        button-class="px-10"
        variant="outline"
        @click="handleClickCancel"
      >
        <span>{{ $t('common.button.cancel') }}</span>
      </BaseButton>
      <BaseButton
        size="extra-small"
        button-class="px-10"
        @click="handleClickCreate"
        :is-disabled="!isValidSubmit"
        :is-loading="isSubmitting"
      >
        <span>{{ $t('syllabus.button.save') }}</span>
      </BaseButton>
    </template>
  </HeaderBar>
  <v-container class="syllabus-form-container mt-2">
    <v-row>
      <v-col cols="12" class="py-2">
        <InputText
          name="name"
          :is-required="true"
          :label="t('syllabus.form.name.label')"
          :placeholder="t('syllabus.form.name.placeholder')"
          label-class="large-form-label"
        />
      </v-col>
      <v-divider
        color="#E1E3E9"
        class="my-4 mx-auto opacity-1"
        length="calc(100% - 24px)"
      />
      <v-col cols="12" class="py-2">
        <SyllabusCoverImage />
      </v-col>
      <v-divider
        color="#E1E3E9"
        class="my-4 mx-auto opacity-1"
        length="calc(100% - 24px)"
      />
      <v-col cols="12" class="py-2">
        <SyllabusLectures
          name="lectures"
          :lectures="formValue.lectures"
          @add-lecture="handleAddLecture"
          @remove-lecture="handleRemoveLecture"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
.syllabus-form-container {
  max-width: 576px;
}
</style>
