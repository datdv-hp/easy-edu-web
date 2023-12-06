<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ToastType } from './store';
import { computed } from 'vue';

interface Props {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  isAutoClose: boolean;
  duration: number;
  size?: 'large' | 'small';
}

const props = withDefaults(defineProps<Props>(), {
  type: ToastType.INFO,
  isAutoClose: true,
  duration: 2,
  size: 'large',
});

// Defining emits
// for closing a notification
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const timer = ref<number>(-1);
const startedAt = ref<number>(0);
const delay = ref<number>(0);

const icons = {
  success: 'mdi-checkbox-marked-circle-outline',
  info: 'mdi-information-outline',
  warning: 'mdi-alert-outline',
  error: 'mdi-close-circle-outline',
};

const prependIcon = computed(() => icons[props.type]);

const isLarge = computed(() => props.size === 'large');

onMounted(() => {
  if (props.isAutoClose) {
    startedAt.value = Date.now();
    delay.value = props.duration * 1000;
    timer.value = window.setTimeout(close, delay.value);
  }
});

const close = () => {
  emit('close');
};
</script>

<template>
  <div
    class="toast-wrapper"
    :style="`--toast-duration: ${duration}s`"
    @click.prevent="close"
  >
    <v-alert :type="type || 'info'" density="comfortable" closable>
      <template #prepend>
        <v-icon size="20" :icon="prependIcon" />
      </template>
      <v-alert-title v-if="isLarge" class="alert-title">{{ title || '' }}</v-alert-title>
      <span class="alert-text">{{ message }}</span>
    </v-alert>
  </div>
</template>

<style lang="scss" scoped>
.toast-wrapper {
  cursor: pointer;
  max-width: 456px;
  position: relative;
  background: white;
  // box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.08), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
  //     0 1px 5px 0 rgba(0, 0, 0, 0.12);
  transition: all 0.2s ease-in-out;
  border-radius: 4px;
}

:deep(.v-alert) {
  border: 1px solid transparent;
  padding: 12px 16px;
  .v-alert__prepend {
    margin-top: 3px;
    margin-right: 10px;
  }
  .v-alert__close {
    margin-left: 14px;
    margin-top: 4px;
    color: $color-neutral-5;

    .v-btn__overlay,
    .v-btn__underlay {
      display: none;
    }
    .v-btn {
      font-size: 12px;
      display: block;
      width: 18px;
      height: 18px;
    }
  }
}

:deep(.bg-success) {
  border-color: $color-state-success;
  background-color: rgba(241, 255, 244, 1) !important;
  .v-alert__prepend {
    color: $color-state-success;
  }
}

:deep(.bg-info) {
  border-color: $color-state-info;
  background-color: rgba(243, 247, 254, 1) !important;

  .v-alert__prepend {
    color: $color-state-info;
  }
}

:deep(.bg-warning) {
  border-color: $color-state-warning;
  background-color: rgba(255, 251, 241, 1) !important;
  .v-alert__prepend {
    color: $color-state-warning;
  }
}

:deep(.bg-error) {
  border-color: $color-state-error;
  background-color: rgba(255, 245, 245, 1) !important;
  .v-alert__prepend {
    color: $color-state-error;
  }
}

.alert-title {
  color: $color-text-black;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0em;
  text-align: left;
}

.alert-text {
  color: $color-text-black;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: left;
}
</style>
