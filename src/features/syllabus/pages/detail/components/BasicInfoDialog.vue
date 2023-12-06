<script lang="ts" setup>
import { ErrorCode, PageName } from '@/common/constants';
import {
  compareFormData,
  getDiffFormData,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { BaseDialog, InputText } from '@/components';
import SyllabusCoverImage from '@/features/syllabus/components/SyllabusCoverImage.vue';
import { updateBasicSyllabusInfoFormSchema } from '@/features/syllabus/schema';
import { useSyllabusDetail } from '@/features/syllabus/stores';
import { useSyllabusBasicInfoDialog } from '@/features/syllabus/stores/basic-info-dialog.store';
import router from '@/plugins/vue-router';
import { cloneDeep } from 'lodash';
import { useForm } from 'vee-validate';
import { computed } from 'vue';
import { ref } from 'vue';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const dialogStore = useSyllabusBasicInfoDialog();
const { t } = useI18n();
const store = useSyllabusDetail();
const route = useRoute();
const syllabusId = route.params.id as string;
const oldForm = ref();

const {
  values: formValue,
  resetForm,
  meta,
  handleSubmit,
  setValues: setFormValue,
  setFieldError,
} = useForm({
  validationSchema: updateBasicSyllabusInfoFormSchema,
});

const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);

onMounted(async () => {
  dialogStore.isFetching = true;
  if (dialogStore.isUpdate) {
    const res = await store.getBasicInfo(syllabusId);
    if (res.success) {
      setFormValue({
        name: store.detail?.name,
        image: store.detail?.image,
      });
      oldForm.value = cloneDeep(formValue);
    }
  }
  dialogStore.isFetching = false;
});

function handleCloseDialog() {
  resetForm();
  dialogStore.close();
}

function goToListPage() {
  router.replace({ name: PageName.SYLLABUS_LIST_PAGE });
}

function handleUpdateError(error: IResponseError) {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `syllabus.updateError.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(errorKey, t(i18nKey));
      break;
    case ErrorCode.ITEM_NOT_FOUND: {
      showErrorNotification(t(i18nKey));
      if (errorKey === 'id') {
        dialogStore.close();
        goToListPage();
      }
      break;
    }
    default:
      showErrorNotification(t('syllabus.error.update'));
      break;
  }
}

const handleClickUpdate = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const res = await store.updateSyllabus(
    syllabusId,
    getDiffFormData(oldForm.value, values),
  );
  if (res.success) {
    showSuccessNotification(t('syllabus.success.update'));
    handleCloseDialog();
    store.getBasicInfo(syllabusId);
    store.getUpdateHistoryList(syllabusId);
    return;
  }
  if (res.errors?.length) {
    handleUpdateError(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
  dialogStore.isSubmitting = false;
});
</script>
<template>
  <BaseDialog
    @close="handleCloseDialog"
    :overlay="dialogStore.isFetching"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit"
    :title="$t('syllabus.basicInfoDialog.update.title')"
    :width="624"
    @submit="handleClickUpdate"
  >
    <v-row>
      <v-col cols="12" class="py-2">
        <InputText
          name="name"
          :is-required="true"
          :label="$t('syllabus.form.name.label')"
          :placeholder="$t('syllabus.form.name.placeholder')"
        />
      </v-col>
      <v-col cols="12" class="py-2">
        <SyllabusCoverImage />
      </v-col>
    </v-row>
  </BaseDialog>
</template>
<style lang="scss" scoped></style>
