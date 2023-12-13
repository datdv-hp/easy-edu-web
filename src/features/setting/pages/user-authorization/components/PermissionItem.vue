<script lang="ts" setup>
import { isEmpty } from 'lodash';
import { useField } from 'vee-validate';
import { computed } from 'vue';

interface Props {
  name: string;
  permissionKeys: string[];
  disabledKeys?: string[];
  relatedKeysWithBasicDetail?: string[];
  relatedKeysWithViewSyllabus?: string[];
}
const props = withDefaults(defineProps<Props>(), {});

const { value: groupPermission, setValue } = useField<
  Record<string, boolean | undefined>
>(`features.${props.name}`);

function toggleAll(value: boolean) {
  const values = Object.fromEntries(props.permissionKeys.map((key) => [key, value]));
  if (!value) {
    props.disabledKeys?.forEach((key) => {
      if (isHasKey(key)) {
        values[key] = true;
      }
    });
  }
  setValue(values);
}

function isHasKey(key: string) {
  return props.permissionKeys?.includes(key);
}

function updatePermission(key: string, value: boolean | null) {
  const groupPermissionValue = { ...groupPermission.value, [key]: !!value };
  if (value) {
    if (isHasKey('view')) {
      Object.assign(groupPermissionValue, { view: value });
    }
    if (isHasKey('viewPersonal')) {
      Object.assign(groupPermissionValue, { viewPersonal: value });
    }
    if (props.relatedKeysWithBasicDetail?.includes(key)) {
      if (isHasKey('detailBasic')) {
        Object.assign(groupPermissionValue, { detailBasic: value });
      }
    }
    if (props.relatedKeysWithViewSyllabus?.includes(key)) {
      if (isHasKey('viewSyllabus')) {
        Object.assign(groupPermissionValue, { viewSyllabus: value });
      }
    }
  } else if (['view', 'viewPersonal'].includes(key)) {
    toggleAll(false);
    return;
  } else if (key === 'detailBasic') {
    props.relatedKeysWithBasicDetail?.forEach((key) => {
      if (isHasKey(key)) {
        Object.assign(groupPermissionValue, { [key]: value });
      }
    });
  } else if (key === 'viewSyllabus') {
    props.relatedKeysWithViewSyllabus?.forEach((key) => {
      if (isHasKey(key)) {
        Object.assign(groupPermissionValue, { [key]: value });
      }
    });
  }
  setValue(groupPermissionValue);
}

function updateToggleAll() {
  if (!isEmptySelect.value && !isSelectedAll.value && !!props.disabledKeys?.length) {
    toggleAll(true);
    return;
  }
  if (!isEmptySelect.value) {
    toggleAll(false);
    return;
  }
  toggleAll(true);
}

const selectedPermissions = computed(() => {
  return Object.values(groupPermission.value || []).filter((isSelected) => !!isSelected);
});

const isSelectedAll = computed(() => {
  return (
    !isEmpty(props.permissionKeys) &&
    selectedPermissions.value.length === props.permissionKeys.length
  );
});

const isEmptySelect = computed(() => {
  return !isEmpty(props.permissionKeys) && isEmpty(selectedPermissions.value);
});

function isDisabledKey(key: string) {
  return props.disabledKeys?.includes(key);
}

const checkAllModelValue = computed(() => {
  return props.disabledKeys?.length ? isSelectedAll.value : !isEmptySelect.value;
});
</script>
<template>
  <v-expansion-panel
    :ripple="false"
    collapse-icon="custom list-expand collapse-icon"
    expand-icon="custom list-expand expand-icon"
    :value="name"
  >
    <template #title>
      <div class="d-flex align-center gap-2">
        <v-checkbox
          density="compact"
          color="primary"
          :model-value="checkAllModelValue"
          :indeterminate="!isSelectedAll && !isEmptySelect"
          :hide-details="true"
          @click.stop="updateToggleAll"
        />
        <div>{{ $t(`authorization.permissionList.${name}`) }}</div>
      </div>
    </template>
    <template #text>
      <v-row>
        <v-col cols="6" v-for="(key, index) in permissionKeys" :key="index" class="py-0">
          <v-checkbox
            density="compact"
            color="primary"
            :model-value="groupPermission?.[key]"
            :hide-details="true"
            :disabled="isDisabledKey(key)"
            @update:model-value="(value: boolean | null) => updatePermission(key, value)"
            @click.stop
          >
            <template #label="{ props }">
              <span class="permission-label" v-bind="props">{{
                $t(`authorization.permissions.${name}.${key}`)
              }}</span>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </template>
  </v-expansion-panel>
</template>
<style lang="scss" scoped>
:deep(.collapse-icon) {
  animation: collapse 0.3s ease;
  transform: rotate(90deg);
}

:deep(.expand-icon) {
  animation: expand 0.3s ease;
}

@keyframes collapse {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(90deg);
  }
}

@keyframes expand {
  0% {
    transform: rotate(90deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

:deep(.v-label) {
  opacity: 1;
}
.permission-label {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0;
  color: $color-neutral-2;
  margin-left: 4px;
  opacity: 1;
}

:deep(.v-checkbox-btn) {
  min-height: 32px !important;
}

:deep(.v-selection-control__input) {
  font-size: 12px;
}
</style>
