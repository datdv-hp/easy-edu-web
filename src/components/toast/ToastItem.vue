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
  box-shadow: -3px 7px 24px 0px #00000033;
  transition: all 0.2s ease-in-out;
  border-radius: 4px;
}

:deep(.v-alert) {
  border: 1px solid transparent;
  padding: 12px 16px;
  background-color: $color-white !important;
  opacity: 0.8;
  transition: opacity 0.15s ease-in-out;
  &:hover {
    opacity: 1;
  }
  .v-alert__prepend {
    margin-top: 3px;
    margin-right: 10px;
  }
  .v-alert__close {
    margin-left: 14px;
    margin-top: 4px;
    color: $color-neutral-5;
    transition: all 0.15s ease-in-out;
    &:hover {
      color: $color-text-black;
    }

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
  .v-alert__prepend {
    color: $color-state-success;
  }
}

:deep(.bg-info) {
  .v-alert__prepend {
    color: $color-state-info;
  }
}

:deep(.bg-warning) {
  .v-alert__prepend {
    color: $color-state-warning;
  }
}

:deep(.bg-error) {
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
