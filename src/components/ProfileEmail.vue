<script setup lang="ts">
import { ref } from 'vue';
import { BaseButtonLink } from '.';
import { computed } from 'vue';

defineProps({
  icon: String,
  title: String,
  description: String,
  isVerified: Boolean,
  isResending: Boolean,
});
const emit = defineEmits<{
  (event: 'resend'): void;
}>();
const isClickResend = ref(false);
const label = computed(() => {
  return isClickResend.value ? 'common.profile.resent' : 'common.profile.resend';
});

const onClickResend = () => {
  emit('resend');
  isClickResend.value = true;
};
</script>

<template>
  <div>
    <div class="info-title d-flex align-center mb-2 gap--3 ws-nowrap">
      <img :src="icon" />
      <div>
        <span>{{ title }}</span>
        <span class="unverified" v-if="!isVerified">{{
          $t('common.profile.unverified')
        }}</span>
        <BaseButtonLink
          v-if="!isVerified"
          :is-disabled="isClickResend"
          :label="$t(label)"
          :is-loading="isResending"
          @click="onClickResend"
        />
      </div>
    </div>
    <div class="d-flex align-center gap--4">
      <span class="info-description">{{ description }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-title {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: $color-neutral-4;
}

.info-description {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: $color-text-black;
}

.unverified {
  color: $color-state-error;
}
</style>
