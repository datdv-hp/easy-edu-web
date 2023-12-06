<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DialogConfirm',
  props: {
    type: String,
    message: Object,
    resolve: Function,
  },
  data() {
    return {
      visible: false,
    };
  },
  mounted() {
    this.visible = true;
  },
  methods: {
    onClose() {
      this.visible = false;
      this.resolve?.(false);
    },
    onConfirm() {
      this.visible = false;
      this.resolve?.(true);
    },
  },
});
</script>

<template>
  <v-dialog v-model="visible" persistent width="auto" class="dialog-confirm">
    <!-- <v-overlay persistent v-model="visible" :style="{ zIndex: 2399 }"></v-overlay> -->

    <v-card color="white" class="pa-4">
      <div class="text-right">
        <v-icon @click="onClose" class="close-icon" icon="mdi-close" />
      </div>
      <div class="d-flex justify-center align-center text-center">
        <v-card-title class="pa-0"> {{ message?.title }}</v-card-title>
      </div>

      <v-card-text class="text-center pt-0 my-4">
        <template v-if="message?.textComponent">
          <component
            :is="message.textComponent.component"
            v-bind="message.textComponent.props"
          />
        </template>
        <template v-else>{{ message?.text }}</template>
      </v-card-text>
      <v-card-actions class="d-flex justify-space-between button-action">
        <v-btn
          @click="onClose"
          variant="outlined"
          size="large"
          class="flex-1-1 text-none w-50"
        >
          {{ $t('app.cancel') }}
        </v-btn>
        <v-btn
          color="error"
          @click="onConfirm"
          variant="flat"
          size="large"
          class="flex-1-1 text-none w-50"
          :style="{ color: '#ffffff !important' }"
        >
          {{ $t('app.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.button-action {
  text-transform: capitalize !important;
}
</style>
