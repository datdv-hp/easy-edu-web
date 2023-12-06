<script lang="ts" setup>
import Icons from '@/assets/icons';
import { ErrorCode } from '@/common/constants';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { BaseButton, BaseDialog, InputPassword } from '@/components';
import { changePasswordSchema } from '@/features/auth/schema';
import { useUserStore } from '@/features/auth/stores';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useUserStore();
const onCloseDialog = () => {
  store.isShowDialogChangePassword = false;
};

const isLoading = ref(false);

const { handleSubmit, meta, values, setFieldError } = useForm({
  validationSchema: changePasswordSchema,
});

const handleErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  if (errorCode === ErrorCode.ITEM_INVALID) {
    setFieldError('oldPassword', t('auth.validate.wrongPassword'));
  } else {
    showErrorNotification(t('auth.error.updatePassword'));
  }
};

const submit = handleSubmit(async () => {
  isLoading.value = true;
  const res = await store.updatePassword({
    password: values.oldPassword,
    newPassword: values.password,
  });
  isLoading.value = false;
  if (res?.success) {
    showSuccessNotification(t('auth.success.updatePassword'));
    onCloseDialog();
    return;
  }
  if (res.errors?.length) {
    handleErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});
</script>

<template>
  <BaseDialog
    @close="onCloseDialog"
    :hide-footer="true"
    :width="425"
    :isHideHeader="true"
  >
    <v-sheet class="wrapper mx-auto">
      <v-row>
        <v-col class="d-flex justify-center" cols="12">
          <img :src="Icons.lockPurple" />
          <v-icon class="icon-close" @click="onCloseDialog()"> mdi-close </v-icon>
        </v-col>
        <v-col cols="12" class="d-flex justify-center mb-2 fw-700 fz-5">
          <span class="title">{{ $t('userProfile.profile.changePassword') }}</span>
        </v-col>
        <v-col class="d-flex justify-center" cols="12">
          <InputPassword
            name="oldPassword"
            :label="$t('userProfile.profile.oldPassword')"
            :placeholder="$t('userProfile.profile.passwordPlaceholder')"
            is-required
          />
        </v-col>
        <v-col class="d-flex justify-center" cols="12">
          <InputPassword
            name="password"
            :label="$t('userProfile.profile.newPassword')"
            :placeholder="$t('userProfile.profile.passwordPlaceholder')"
            is-required
          />
        </v-col>
        <v-col class="d-flex justify-center" cols="12">
          <InputPassword
            name="confirmPassword"
            :label="$t('userProfile.profile.confirmPassword')"
            :placeholder="$t('userProfile.profile.passwordPlaceholder')"
            is-required
          />
        </v-col>
        <v-col cols="12">
          <BaseButton
            class="w-100"
            :label="$t('common.button.save')"
            size="medium"
            @click="submit"
            :is-disabled="!meta.valid"
            :is-loading="isLoading"
          />
        </v-col>
      </v-row>
    </v-sheet>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.icon-close {
  position: absolute;
  color: #6d6f81;
  right: 32px;
}
</style>
