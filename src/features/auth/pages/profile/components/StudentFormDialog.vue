<script setup lang="ts">
import { useField, useForm } from 'vee-validate';
import {
  InputText,
  DatePicker,
  AvatarForm,
  BaseDialog,
  InputTel,
  GenderRadioGroup,
} from '@/components';
import {
  compareFormData,
  getDiffFormData,
  maskPhone,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserDialog, useUserStore } from '@/features/auth/stores';
import { IStudent } from '@/features/student/interfaces';
import { computed } from 'vue';
import { ref } from 'vue';
import { cloneDeep } from 'lodash';
import { studentProfileUpdateFormSchema } from '@/features/auth/schema';
import dayjs from '@/plugins/dayjs';
const { t } = useI18n();
const dialogStore = useUserDialog();
const store = useUserStore();
const {
  values: formValue,
  handleSubmit,
  setValues,
  meta,
} = useForm({
  validationSchema: studentProfileUpdateFormSchema,
});
const { value: avatar, setValue: updateAvatar } = useField<string | undefined>('avatar');
const oldForm = ref();
const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);

onMounted(async () => {
  const profile = (store.profile || {}) as IStudent;
  setValues({
    name: profile?.name,
    email: profile?.email,
    phone: profile?.phone,
    gender: profile?.gender,
    dob: profile?.dob,
    avatar: profile?.avatar,
  });
  oldForm.value = cloneDeep(formValue);
  oldForm.value.phone = maskPhone(formValue.phone);
});

const handleClickUpdateStudent = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const data = await store.updateProfile(getDiffFormData(oldForm.value, values));
  if (data?.success) {
    showSuccessNotification(t('auth.userProfile.notification.success'));
    await store.getProfile();
    onCloseDialog();
  } else {
    showErrorNotification(t('auth.userProfile.notification.error'));
  }
  dialogStore.isSubmitting = false;
});

const onCloseDialog = () => {
  dialogStore.close();
};

function submit() {
  handleClickUpdateStudent();
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
          class="readonly-email"
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
          :max="dayjs().toDate()"
          :label="t('common.form.dob.label')"
          :placeholder="t('common.form.dob.placeholder')"
          name="dob"
          value-type="string"
          isRequired
        />
      </v-col>
      <v-col cols="12" md="6">
        <InputTel
          name="phone"
          :label="t('common.form.phone.label')"
          :placeholder="t('common.form.phone.placeholder')"
          :readonly="true"
          :clearable="false"
          isRequired
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="py-2">
        <GenderRadioGroup :is-required="true" />
      </v-col>
    </v-row>
  </BaseDialog>
</template>
<style lang="scss" scoped></style>
