<script lang="ts" setup>
import {
  AvatarForm,
  BaseDialog,
  DatePicker,
  GenderRadioGroup,
  InputTel,
  InputText,
  InputTextarea,
} from '@/components';
import { useField, useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  compareFormData,
  getDiffFormData,
  maskPhone,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { teacherProfileUpdateFormSchema } from '@/features/auth/schema';
import { useUserDialog, useUserStore } from '@/features/auth/stores';
import { ITeacher } from '@/features/teacher/interfaces';
import dayjs from '@/plugins/dayjs';
import { cloneDeep } from 'lodash';
import { computed } from 'vue';

const dialogStore = useUserDialog();
const { t } = useI18n();
const store = useUserStore();
const oldForm = ref();

const {
  handleSubmit,
  setValues,
  meta,
  values: formValue,
} = useForm({
  validationSchema: teacherProfileUpdateFormSchema,
});
const { value: avatar, setValue: updateAvatar } = useField<string | undefined>('avatar');

const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);

const onCloseDialog = () => {
  dialogStore.close();
};

onMounted(async () => {
  const profile = (store.profile || {}) as ITeacher;
  setValues({
    name: profile?.name,
    email: profile?.email,
    phone: profile?.phone,
    gender: profile?.gender,
    avatar: profile?.avatar,
    dob: profile?.dob,
    teacherDetail: {
      degree: profile?.teacherDetail?.degree,
      note: profile?.teacherDetail?.note,
    },
  });
  oldForm.value = cloneDeep(formValue);
  oldForm.value.phone = maskPhone(formValue.phone);
});

const handleClickUpdateTeacher = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const data = await store.updateProfile(getDiffFormData(oldForm.value, values));
  if (data?.success) {
    showSuccessNotification(t('auth.userProfile.notification.success'));
    await store.getProfile();
    handleCloseDialog();
  } else {
    showErrorNotification(t('auth.userProfile.notification.error'));
  }
  dialogStore.isSubmitting = false;
});

const handleCloseDialog = () => {
  dialogStore.close();
};

function submit() {
  handleClickUpdateTeacher();
}
</script>
<template>
  <BaseDialog
    @close="onCloseDialog"
    :overlay="dialogStore.isFetching"
    :loading="dialogStore.isSubmitting"
    :disabled="!isValidSubmit"
    :title="t('auth.userProfile.edit.title')"
    @submit="submit"
    content-class="pt-6"
  >
    <v-row>
      <v-col cols="6" class="py-2">
        <AvatarForm
          :value="avatar"
          :user-name="formValue.name"
          @avatar-change="updateAvatar"
        />
      </v-col>
      <v-col cols="6" class="d-flex flex-column gap--4 py-2">
        <InputText
          name="name"
          :label="t('common.form.name.label')"
          :placeholder="t('common.form.name.placeholder')"
          is-required
        />
        <InputText
          name="email"
          class="readonly-email mt-4"
          :label="t('common.form.email.label')"
          :placeholder="t('common.form.email.placeholder')"
          is-required
          :readonly="true"
          :clearable="false"
          size="small"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-2">
        <DatePicker
          name="dob"
          :max="dayjs().toDate()"
          :label="t('common.form.dob.label')"
          :placeholder="t('common.form.dob.placeholder')"
          value-type="string"
          is-required
        />
      </v-col>
      <v-col cols="6" class="py-2">
        <InputTel
          name="phone"
          :label="t('common.form.phone.label')"
          :placeholder="t('common.form.phone.placeholder')"
          :readonly="true"
          :clearable="false"
          is-required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <GenderRadioGroup :is-required="true" />
      </v-col>
      <v-col cols="6" class="py-2">
        <InputTextarea
          name="teacherDetail.degree"
          :label="t('teacher.form.degree.label')"
          :placeholder="t('teacher.form.degree.placeholder')"
          :rows="5"
        />
      </v-col>
      <v-col cols="6" class="skill py-2">
        <InputTextarea
          name="teacherDetail.note"
          :label="t('teacher.form.note.label')"
          :placeholder="t('teacher.form.note.placeholder')"
          :rows="5"
        />
      </v-col>
    </v-row>
  </BaseDialog>
</template>
<style lang="scss" scoped></style>
