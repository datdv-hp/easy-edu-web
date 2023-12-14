<script lang="ts" setup>
import logo from '@/assets/images/logo.svg';
import { PageName } from '@/common/constants';
import { translateYupError } from '@/common/helpers';
import { phoneMask } from '@/common/mask';
import router from '@/plugins/vue-router';
import { useEventListener } from '@vueuse/core';
import { vMaska } from 'maska';
import { reactive, ref } from 'vue';
import { useRegisterForm } from '../../forms/registration.form';

const registrationForm = reactive(useRegisterForm());
const isSubmitting = ref(false);

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    registrationForm.isValidForm && handleSubmit();
  }
});
async function handleSubmit() {
  isSubmitting.value = true;
  await registrationForm.submitForm();
  isSubmitting.value = false;
}

function goBackToLogin() {
  registrationForm.resetForm();
  router.push({
    name: PageName.LOGIN_PAGE,
  });
}
</script>
<template>
  <div class="h-100 d-flex align-center justify-center">
    <v-card width="450">
      <v-card-title>
        <v-img :src="logo" :lazy-src="logo" :height="100"></v-img>
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="registrationForm.name"
          class="mb-4"
          type="name"
          color="primary"
          variant="outlined"
          :label="$t('registration.form.name')"
          :placeholder="$t('registration.form.placeholder.name')"
          :error="!!registrationForm.nameError"
          :error-messages="translateYupError(registrationForm.nameError as string)"
          hide-details="auto"
        ></v-text-field>
        <v-text-field
          class="mb-4"
          v-model="registrationForm.email"
          variant="outlined"
          color="primary"
          :label="$t('registration.form.email')"
          :placeholder="$t('registration.form.placeholder.email')"
          :error="!!registrationForm.emailError"
          :error-messages="translateYupError(registrationForm.emailError as string)"
          hide-details="auto"
        ></v-text-field>

        <v-text-field
          v-model="registrationForm.phone"
          v-maska:[phoneMask]
          class="mb-4"
          type="phone"
          color="primary"
          variant="outlined"
          :label="$t('registration.form.phone')"
          :placeholder="$t('registration.form.placeholder.phone')"
          :error="!!registrationForm.phoneError"
          :error-messages="translateYupError(registrationForm.phoneError as string)"
          hide-details="auto"
        ></v-text-field>
        <div class="text-center mt-8">
          <v-btn
            class="w-100"
            :loading="isSubmitting"
            height="44"
            variant="flat"
            color="primary"
            :text="$t('registration.button.submit')"
            @click="handleSubmit"
          />
        </div>
        <div class="text-center mt-2">
          <v-btn
            class="w-100"
            height="44"
            color="primary"
            variant="outlined"
            :text="$t('registration.button.backToLogin')"
            @click="goBackToLogin"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<style lang="scss" scoped></style>
