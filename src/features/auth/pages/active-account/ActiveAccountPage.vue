<script lang="ts" setup>
import { ErrorCode, PageName } from '@/common/constants';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../stores';

enum ActiveStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  ERROR = 'error',
  ACTIVATED = 'activated',
}
const route = useRoute();
const store = useUserStore();
const status = ref<ActiveStatus>(ActiveStatus.PENDING);

function setStatus(_status: ActiveStatus) {
  status.value = _status;
}

onMounted(async () => {
  const query = route.query;
  const res = await store.activeAccount({
    code: query.code as string,
    email: query.email as string,
  });
  if (res.success) {
    setStatus(ActiveStatus.SUCCESS);
    return;
  }
  const error = res.errors?.[0];
  if (error?.errorCode === ErrorCode.ITEM_INVALID && error?.key === 'status') {
    setStatus(ActiveStatus.ACTIVATED);
  } else {
    setStatus(ActiveStatus.ERROR);
  }
});
</script>
<template>
  <v-container class="text-center mt-15">
    <template v-if="status === ActiveStatus.PENDING">
      <h1>Đang kích hoạt tài khoản</h1>
      <v-progress-circular
        color="primary"
        :indeterminate="true"
        size="40"
      ></v-progress-circular>
    </template>
    <template v-else-if="status === ActiveStatus.SUCCESS">
      <h1>{{ $t('auth.active.success') }}</h1>
      <h3>{{ $t('auth.active.loginInfoSent', { email: route.query.email }) }}</h3>
      <v-btn
        class="mt-4"
        :text="$t('auth.button.login')"
        :to="{ name: PageName.LOGIN_PAGE }"
        color="primary"
      ></v-btn>
    </template>
    <template v-else-if="status === ActiveStatus.ACTIVATED">
      <h1 class="mb-4">{{ $t('auth.active.alreadyActivated') }}</h1>
      <v-btn
        :text="$t('auth.button.login')"
        :to="{ name: PageName.LOGIN_PAGE }"
        color="primary"
      ></v-btn>
    </template>
    <template v-else>
      <h1>{{ $t('auth.active.failed') }}</h1>
      <h3>{{ $t('auth.active.contactAdmin', { email: 'd.v.dat160901@gmail.com' }) }}</h3>
    </template>
  </v-container>
</template>
<style lang="scss" scoped></style>
