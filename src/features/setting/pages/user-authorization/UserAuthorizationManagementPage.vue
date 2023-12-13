<script lang="ts" setup>
import { ErrorCode, RoleType } from '@/common/constants';
import {
  compareFormData,
  getDiffFormData,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { DialogConfirmMessage, showDialogConfirm } from '@/plugins';
import { useElementBounding } from '@vueuse/core';
import { cloneDeep, forEach } from 'lodash';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { onBeforeRouteLeave } from 'vue-router';
import { convertToRole } from '../../helpers/authorization.helpers';
import { useAuthorizationStore } from '../../stores';
import { RoleFormSchema } from '../../validations/authorization.validation';
import ConfirmChangeDialog from './components/ConfirmChangeDialog.vue';
import PermissionList from './components/PermissionList.vue';
import RoleInfo from './components/RoleInfo.vue';
import RoleList from './components/RoleList.vue';
import { useRole } from '@/common/stores/role.store';

const { t } = useI18n();
const store = useAuthorizationStore();
const role = useRole();
const authorizationInfo = ref(null);
const { height: infoHeight } = useElementBounding(authorizationInfo);
const oldForm = ref();
const prevSelectedId = ref<string>();

const {
  values: formValue,
  setValues: setForm,
  resetForm,
  setFieldValue,
  setFieldError,
  handleSubmit,
  meta,
} = useForm<Record<string, any>>({
  initialValues: {
    name: '',
    description: undefined,
    features: {},
    type: undefined,
  },
  validationSchema: RoleFormSchema,
  validateOnMount: false,
});

const isValidSubmit = computed(
  () => meta.value.valid && !compareFormData(oldForm.value, formValue),
);
const hasChange = computed(() => !compareFormData(oldForm.value, formValue));
const isAbleChange = computed(() => role.role?.create || role.role?.update);
// Hooks
onMounted(() => {
  store.getDefaultFeatures();
  getListRole();
});

onBeforeRouteLeave(async (_, __, next) => {
  if (hasChange.value && isAbleChange.value) {
    const confirm = await showCancelConfirmDialog();
    if (!confirm) {
      return;
    }
  }
  resetState();
  next();
});
// End hooks

async function getListRole() {
  const res = await store.getList();
  if (res.success) {
    updateDetailValue();
  }
}

async function showCancelConfirmDialog() {
  const message: DialogConfirmMessage = {
    title: t('authorization.confirmation.cancel.title'),
    textComponent: { component: ConfirmChangeDialog },
  };
  if (store.isCreating) {
    message.text = t('authorization.confirmation.cancel.createText');
    message.textComponent = undefined;
  }
  const confirm = await showDialogConfirm('info', message);
  return confirm;
}

async function updateDetailValue() {
  resetForm();
  if (!store.selectedId) {
    store.setSelectedId(prevSelectedId.value);
    prevSelectedId.value = undefined;
  }
  const detail = cloneDeep(store.detail);
  if (detail) {
    setForm({
      features: detail?.features,
      name: detail?.name,
      description: detail?.description,
      type: detail?.type,
    });
    oldForm.value = cloneDeep(formValue);
    store.setCurrentRoleType(formValue.type);
  }
}

function resetState() {
  store.setIsCreating(false);
  oldForm.value = undefined;
}

// Handle click
async function onClickDeleteRole() {
  const confirm = await showDialogConfirm('info', {
    title: t('common.deleteConfirm'),
    text: t('authorization.confirmation.delete.text'),
  });
  if (!confirm) return;
  handleDelete();
}

function onClickCreateRole() {
  store.setIsCreating(true);
  store.setCurrentRoleType(undefined);
  prevSelectedId.value = store.selectedId;
  store.setSelectedId(undefined);
  resetForm();
  oldForm.value = cloneDeep(formValue);
}

async function onClickCancel() {
  if (hasChange.value) {
    const confirm = await showCancelConfirmDialog();
    if (!confirm) {
      return;
    }
  }
  resetState();
  updateDetailValue();
}

async function viewRoleDetail(id: string) {
  if (hasChange.value && isAbleChange.value) {
    const confirm = await showCancelConfirmDialog();
    if (!confirm) {
      return;
    }
  }
  resetState();
  store.setSelectedId(id);
  store.setDetail(id);
  updateDetailValue();
}

function handleChangeRoleType(type: RoleType) {
  if (type && type === store.detail?.type && !store.isCreating) {
    setFieldValue('features', store.detail.features);
    return;
  }
  setFieldValue('features', store.defaultFeatures);
}
// Handle click end

// Handle errors
function handleDeleteErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const i18nKey = `authorization.deleteError.${errorCode}.${error.key}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      store.setSelectedId(undefined);
      store.getList();
      break;
    case ErrorCode.CONFLICT:
      showErrorNotification(t(i18nKey));
      break;
    default:
      showErrorNotification(t('authorization.error.delete'));
      break;
  }
}
function handleUpdateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `authorization.updateError.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_NOT_FOUND:
      showErrorNotification(t(i18nKey));
      store.setSelectedId(undefined);
      store.getList();
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(errorKey, t(i18nKey));
      break;
    default:
      showErrorNotification(t('authorization.error.update'));
      break;
  }
}
function handleCreateErrors(error: IResponseError) {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `authorization.createError.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.ITEM_ALREADY_EXIST:
      setFieldError(errorKey, t(i18nKey));
      break;
    default:
      showErrorNotification(t('authorization.error.create'));
      break;
  }
}
// Handle errors end

// Handle submit
async function handleDelete() {
  const res = await store.deleteRole();
  if (res.success && res.data) {
    store.setSelectedId(undefined);
    showSuccessNotification(t('authorization.success.delete'));
    await store.getList();
    updateDetailValue();
    return;
  }
  if (res?.errors?.length) {
    handleDeleteErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
}

function mappingRoleWithDefaultKeys() {
  const _permissions = {};
  const permissionKeys = store.defaultPermissionKeys.keys;
  forEach(permissionKeys, (keys, groupPermission) => {
    const permissions = formValue.features[groupPermission];
    forEach(keys, (key: string) => {
      if (!_permissions[groupPermission]) {
        _permissions[groupPermission] = {};
      }
      _permissions[groupPermission][key] = permissions?.[key] || false;
    });
  });
  return _permissions;
}

const handleUpdate = handleSubmit(async (values) => {
  const confirm = await showDialogConfirm('info', {
    title: t('authorization.confirmation.save.title'),
    text: t('authorization.confirmation.save.changeText'),
  });
  if (!confirm) return;
  const diffFormData = getDiffFormData(oldForm.value, values, ['type', 'features']);
  if (diffFormData.features) {
    diffFormData.features = mappingRoleWithDefaultKeys();
  }
  const res = await store.updateRole(diffFormData);
  if (res.success) {
    await store.getList();
    resetState();
    updateDetailValue();
    showSuccessNotification(t('authorization.success.update'));
    return;
  }
  if (res?.errors?.length) {
    handleUpdateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

const handleCreate = handleSubmit(async (values) => {
  const res = await store.createRole(values);
  if (res.success) {
    const data = convertToRole(res.data);
    store.setSelectedId(data.id);
    await store.getList();
    resetState();
    updateDetailValue();
    showSuccessNotification(t('authorization.success.create'));
    return;
  }
  if (res?.errors?.length) {
    handleCreateErrors(res.errors[0]);
  } else {
    showErrorNotification(res.error || (res.message as string));
  }
});

function handleSubmitForm() {
  if (store.isCreating) {
    handleCreate();
    return;
  }
  handleUpdate();
}
// Handle submit end
</script>
<template>
  <HeaderBar :is-hide-profile="true" :is-hide-back="true">
    <template #title>{{ $t('authorization.title') }}</template>
  </HeaderBar>
  <v-card class="ma-4 pa-0 card-wrapper">
    <v-row dense>
      <v-col cols="4" lg="3" class="pe-0">
        <RoleList @change-detail="viewRoleDetail" @create-role="onClickCreateRole" />
      </v-col>
      <v-col cols="8" lg="9" class="ps-0">
        <div class="info-wrapper">
          <RoleInfo
            ref="authorizationInfo"
            :is-valid-submit="isValidSubmit"
            :has-change="hasChange"
            @submit="handleSubmitForm"
            @cancel="onClickCancel"
            @delete="onClickDeleteRole"
            @change-type="handleChangeRoleType"
          />
          <PermissionList :offset="`${infoHeight}px`" />
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>
<style lang="scss" scoped>
.card-wrapper {
  border: 1px solid $color-neutral-6 !important;
  border-radius: 10px !important;
}
.info-wrapper {
  height: 100%;
  background: $color-neutral-7;
  padding: 24px;
  border-left: 1px solid $color-neutral-6;
}
</style>
