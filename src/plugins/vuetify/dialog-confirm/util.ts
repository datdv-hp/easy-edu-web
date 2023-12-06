import { createApp } from 'vue';
import DialogConfirm from './DialogConfirm.vue';
import vuetify from '@/plugins/vuetify';
import i18n from '@/plugins/vue-i18n';
import { type Component } from 'vue';

export type DialogConfirmType = 'info' | 'success' | 'warning' | 'error';
export interface DialogConfirmMessage {
  title: string;
  text?: string;
  textComponent?: { component: Component; props?: object };
}

export function showDialogConfirm(
  type: DialogConfirmType,
  message: DialogConfirmMessage | string,
) {
  return new Promise((resolve) => {
    let dlog;
    let mountEl: HTMLDivElement;
    new Promise((_resolve) => {
      if (typeof message === 'string') {
        message = {
          title: '',
          text: message,
          textComponent: undefined,
        };
      }
      const _message = {};
      Object.assign(_message, {}, message);

      dlog = createApp(
        {
          extends: DialogConfirm,
        },
        {
          type: type,
          message: _message,
          resolve: _resolve,
        },
      );
      dlog.use(i18n);
      dlog.use(vuetify);
      mountEl = document.createElement('div');
      dlog.mount(mountEl);
    }).then((result) => {
      setTimeout(() => {
        dlog.unmount();
        mountEl.remove();
      }, 300);
      resolve(result);
    });
  });
}
