<script lang="ts" setup>
import {
  compareFormData,
  getDiffFormData,
  maskPhone,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { AvatarForm, InputText } from '@/components';
import DatePicker from '@/components/base/DatePicker.vue';
import GenderRadioGroup from '@/components/base/GenderRadioGroup.vue';
import InputTel from '@/components/base/InputTel.vue';
import { managerProfileUpdateFormSchema } from '@/features/auth/schema';
import { useUserDialog, useUserStore } from '@/features/auth/stores';
import { IManager } from '@/features/manager/interfaces';
import dayjs from '@/plugins/dayjs';
import { cloneDeep } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const dialogStore = useUserDialog();
const { t } = useI18n();
const store = useUserStore();
const {
  handleSubmit,
  setValues,
  meta,
  values: formValue,
} = useForm({
  validationSchema: managerProfileUpdateFormSchema,
});
const { value: avatar, setValue: updateAvatar } = useField<string | undefined>('avatar');
const oldForm = ref();

const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);

const onCloseDialog = () => {
  dialogStore.close();
};

onMounted(async () => {
  const profile = (store.profile || {}) as IManager;
  setValues({
    name: profile?.name,
    email: profile?.email,
    phone: profile?.phone,
    gender: profile?.gender,
    avatar: profile?.avatar,
    dob: profile?.dob,
  });
  oldForm.value = cloneDeep(formValue);
  oldForm.value.phone = maskPhone(formValue.phone);
});

const handleClickUpdateStudent = handleSubmit(async (values) => {
  dialogStore.isSubmitting = true;
  const data = await store.updateProfile(getDiffFormData(oldForm.value, values));
  if (data?.success) {
    showSuccessNotification(t('auth.userProfile.notification.success'));
    onCloseDialog();
  } else {
    showErrorNotification(t('auth.userProfile.notification.error'));
  }
  dialogStore.isSubmitting = false;
});

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
          :value="avatar ? avatar : undefined"
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
      <v-col cols="6" class="py-2">
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
