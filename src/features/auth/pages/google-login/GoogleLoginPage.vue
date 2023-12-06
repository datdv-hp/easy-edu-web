<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, nextTick } from 'vue';
import { localStorageGoogleAuthService } from '@/common/storages';
import { googleAuthApi } from '../../services';
import { GOOGLE_LOGIN_REDIRECT_URI } from '@/features/auth/auth.constants';

const route = useRoute();
onMounted(async () => {
  await nextTick(async () => {
    const code = route?.query?.code?.toString() || '';
    localStorageGoogleAuthService.setGoogleLoginCode(code);
    const res = await googleAuthApi.getGoogleLoginEmail({
      code,
      redirectUri: GOOGLE_LOGIN_REDIRECT_URI,
    });
    if (res.success) {
      localStorageGoogleAuthService.setGoogleLoginEmail(res.data.email as string);
    }
    window.close();
  });
});
</script>
<template>
  <div>Đừng tắt tôi!. Hãy để tôi tự tắt</div>
</template>
<style scoped>
.none-box-shadow {
  box-shadow: none;
  border: none;
}
.google-login {
  text-transform: none;
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
