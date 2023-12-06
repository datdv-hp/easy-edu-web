<script lang="ts" setup>
import { PageName } from '@/common/constants';
import { LoadingOverlay } from '@/components';
import router from '@/plugins/vue-router';
import { onBeforeMount, reactive, ref } from 'vue';
import { useLoginForm } from '../../forms/login-form.ts';
import { useAuthStore, useUserStore } from '../../stores';
import logo from '@/assets/images/logo.svg';
import { translateYupError } from '@/common/helpers';
import { useEventListener } from '@vueuse/core';

const loginForm = reactive(useLoginForm());
const authStore = useAuthStore();
const userStore = useUserStore();
const loading = ref(false);

useEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    loginForm.isValidForm && handleLogin();
  }
});

const redirectIfNeed = () => {
  const redirectPath = sessionStorage.getItem('redirect') as string;
  if (redirectPath) {
    router.replace(redirectPath);
    sessionStorage.removeItem('redirect');
  } else {
    router.replace({
      name: PageName.COURSE_LIST_PAGE,
    });
  }
};

async function getProfile() {
  const res = await userStore.getProfile();
  if (!res.success) {
    loading.value = false;
    return;
  }
  redirectIfNeed();
}

async function handleLogin() {
  loading.value = true;
  const success = await loginForm.handleLogin();
  if (success) {
    await getProfile();
  }
  loading.value = false;
}

const setup = async () => {
  loading.value = true;
  if (authStore.hasToken) {
    await getProfile();
  }
  loading.value = false;
};

onBeforeMount(() => {
  if (authStore.isAuthenticated) {
    redirectIfNeed();
    return;
  }
  setup();
});
</script>
<template>
  <LoadingOverlay :loading="loading" bg-color="#FFF" :opacity="1" />
  <div class="h-100 d-flex align-center justify-center">
    <v-card width="450">
      <v-card-title>
        <v-img :src="logo" :lazy-src="logo" :height="100"></v-img>
      </v-card-title>
      <v-card-text>
        <v-text-field
          class="mb-3"
          v-model="loginForm.email"
          variant="outlined"
          color="primary"
          :label="$t('auth.form.email')"
          :placeholder="$t('auth.form.placeholder.email')"
          :error="!!loginForm.emailError"
          :error-messages="translateYupError(loginForm.emailError as string)"
        ></v-text-field>

        <v-text-field
          v-model="loginForm.password"
          class="mb-3"
          type="password"
          color="primary"
          variant="outlined"
          :label="$t('auth.form.password')"
          :placeholder="$t('auth.form.placeholder.password')"
          :error="!!loginForm.passwordError"
          :error-messages="translateYupError(loginForm.passwordError as string)"
        ></v-text-field>
        <div class="text-center">
          <v-btn
            color="primary"
            :text="$t('auth.button.login')"
            @click="handleLogin"
            @enter="handleLogin"
          />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-field__input) {
  &:-internal-autofill-selected {
    background-color: white !important;
  }
}
</style>
