<script setup lang="ts">
import ToastItem from './ToastItem.vue';
import { useToasts } from './store';

const { toasts, removeToast } = useToasts();
</script>

<template>
  <div class="toast-wrapper">
    <transition-group name="toast" tag="div" class="toasts">
      <ToastItem
        v-for="item in toasts"
        :key="item.id"
        :id="item.id"
        :type="item.type"
        :title="item.title"
        :message="item.message"
        :is-auto-close="item.isAutoClose"
        :duration="item.duration"
        @close="
          () => {
            removeToast(item.id);
          }
        "
      ></ToastItem>
    </transition-group>
  </div>
  <slot />
</template>

<style lang="scss">
.toasts {
  z-index: 2500;
  position: fixed;
  top: 0.8rem;
  right: 50%;
  transform: translateX(50%);
  display: flex;
  flex-direction: column-reverse;
  gap: 0.8rem;
}

.toast-enter-active {
  animation: toast-slide-in 0.3s ease;
}
.toast-leave-active {
  animation: toast-fade-out 0.5s ease;
}

@keyframes toast-slide-in {
  from {
    top: -0.8rem;
  }

  to {
    top: 0;
  }
}

@keyframes toast-fade-out {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
