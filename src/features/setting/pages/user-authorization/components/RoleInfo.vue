<script lang="ts" setup>
import { RoleType } from '@/common/constants';
import { useRole } from '@/common/stores/role.store';
import { BaseButton, InputText, InputTextarea, SingleSelect } from '@/components';
import { useAuthorizationStore } from '@/features/setting/stores';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{ isValidSubmit?: boolean; hasChange?: boolean }>();
const store = useAuthorizationStore();
const { t } = useI18n();
const role = useRole();
const emit = defineEmits(['submit', 'cancel', 'update', 'delete', 'change-type']);

function submitForm() {
  emit('submit');
}

function clickCancel() {
  emit('cancel');
}
function clickDelete() {
  emit('delete');
}

const roleTypeOptions = computed(() =>
  Object.values(RoleType).map((type) => ({
    title: t(`authorization.roleType.${type.toLowerCase()}`),
    value: type,
  })),
);

function onChangeRoleType(type: RoleType) {
  store.setCurrentRoleType(type);
  emit('change-type', type);
}
</script>
<template>
  <v-row>
    <v-col cols="12" class="d-flex justify-space-between align-start">
      <span class="title">{{ $t('authorization.info.title') }}</span>
      <div class="mt-n1">
        <template v-if="role.role?.delete">
          <BaseButton
            v-if="!store.isDefaultRole && !store.isCreating"
            size="extra-small"
            class="mr-2"
            variant="outline"
            @click="clickDelete"
          >
            <span>{{ $t('common.button.delete') }}</span>
          </BaseButton>
        </template>
        <template
          v-if="
            (role.role?.create || role.role?.update) && (hasChange || store.isCreating)
          "
        >
          <BaseButton
            size="extra-small"
            class="mr-2"
            variant="outline"
            @click="clickCancel"
          >
            <span>{{ $t('common.button.cancel') }}</span>
          </BaseButton>
          <BaseButton
            size="extra-small"
            @click="submitForm"
            :is-disabled="!isValidSubmit"
            :is-loading="store.isSubmitting"
          >
            <span>{{ $t('common.button.save') }}</span>
          </BaseButton>
        </template>
      </div>
    </v-col>
    <v-col cols="6" class="pt-1">
      <InputText
        name="name"
        :is-required="true"
        :label="$t('authorization.form.name.label')"
        :placeholder="$t('authorization.form.name.placeholder')"
      />
    </v-col>
    <v-col cols="6" class="pt-1">
      <SingleSelect
        name="type"
        :is-required="true"
        :items="roleTypeOptions"
        :label="$t('authorization.form.type.label')"
        :placeholder="$t('authorization.form.type.placeholder')"
        :clearable="false"
        :disabled="!store.isCreating"
        @change="onChangeRoleType"
      />
    </v-col>
    <v-col cols="12" class="pt-1">
      <InputTextarea
        name="description"
        :label="$t('authorization.form.description.label')"
        :placeholder="$t('authorization.form.description.placeholder')"
        :max-length="1000"
        :counter="1000"
      />
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 27px;
  color: $color-text-black;
  max-width: calc(100% - 320px);
  min-width: 140px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role-name {
  max-width: calc(100% - 280px);
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;
  letter-spacing: 0;
  color: $color-neutral-1;
}

.role-info {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0;
  margin-bottom: 12px;
  color: $color-text-black;

  &.role-description {
    color: $color-neutral-2;
  }
}
</style>
