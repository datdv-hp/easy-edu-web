<script lang="ts" setup>
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { BaseAutoComplete } from '@/components';
import { TimeKeepingType } from '@/features/setting/constant';
import { settingTimekeepingApiService } from '@/features/setting/services/settingTimekeeping.api';
import { settingDateTimekeepingFormSchema } from '../../../schema';
import { isEqual, range } from 'lodash';
import { useForm } from 'vee-validate';
import { onMounted } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    isCancel: boolean;
    isSave: boolean;
  }>(),
  {
    isCancel: false,
    isSave: false,
  },
);

const emit = defineEmits<{
  (event: 'save-done'): void;
}>();
const isLastDayOfMonth = ref<boolean>(true);
const type = ref<TimeKeepingType>(TimeKeepingType.CUTOFF_DATE);
const settingTimekeepingId = ref<string>();
const cloneFormData = ref();

const { t } = useI18n();
const { setFieldValue, values, validate } = useForm({
  validationSchema: settingDateTimekeepingFormSchema,
});

const options = computed(() => {
  const options = range(1, 32).map((item) => ({
    title: item,
    value: item,
    other: item,
  }));
  return options;
});

onMounted(async () => {
  const res = await settingTimekeepingApiService.getSettingTimekeeping();
  if (res?.success) {
    settingTimekeepingId.value = res.data._id;
    const dataResponse = res.data.value;
    isLastDayOfMonth.value = dataResponse.isEndOfMonth as boolean;
    setFieldValue('dateTimekeeping', dataResponse.day as number);
    setFieldValue('isLastDayOfMonth', dataResponse.isEndOfMonth as boolean);
    type.value = dataResponse.type as TimeKeepingType;
    cloneFormData.value = {
      dateTimekeeping: dataResponse.day as number,
      isLastDayOfMonth: dataResponse.isEndOfMonth as boolean,
      type: dataResponse.type as TimeKeepingType,
    };
  }
});

const isEditing = computed(() => {
  return !isEqual(cloneFormData.value, {
    dateTimekeeping: values.dateTimekeeping as number,
    isLastDayOfMonth: values.isLastDayOfMonth as boolean,
    type: type.value as TimeKeepingType,
  });
});

const resetSelectDate = (e: boolean | null) => {
  if (e) {
    setFieldValue('isLastDayOfMonth', true);
    setFieldValue('dateTimekeeping', undefined);
    type.value = TimeKeepingType.CUTOFF_DATE;
    validate();
  } else {
    setFieldValue('isLastDayOfMonth', false);
    setFieldValue('dateTimekeeping', 20);
    validate();
  }
};

const resetLastDayOfMonth = () => {
  isLastDayOfMonth.value = true;
};

watch(
  () => props.isSave,
  async () => {
    if (props.isSave) {
      const data = {
        day: values.dateTimekeeping,
        isEndOfMonth: isLastDayOfMonth.value,
        type: type.value,
      };
      const res = await settingTimekeepingApiService.updateSettingTimekeeping(
        settingTimekeepingId.value as string,
        data,
      );

      if (res?.success) {
        cloneFormData.value = {
          dateTimekeeping: data.day as number,
          isLastDayOfMonth: data.isEndOfMonth as boolean,
          type: data.type as TimeKeepingType,
        };
        showSuccessNotification(t('settings.success.timekeepingUpdate'));
        emit('save-done');
      } else {
        showErrorNotification(t('settings.error.timekeepingUpdate'));
      }
    }
  },
);

watch(
  () => props.isCancel,
  async () => {
    if (props.isCancel) {
      isLastDayOfMonth.value = cloneFormData.value.isLastDayOfMonth as boolean;
      setFieldValue('dateTimekeeping', cloneFormData.value.dateTimekeeping as number);
      setFieldValue('isLastDayOfMonth', cloneFormData.value.isLastDayOfMonth as boolean);
      type.value = cloneFormData.value.type as TimeKeepingType;
      emit('save-done');
    }
  },
);

defineExpose({ isEditing });
</script>
<template>
  <v-card class="ma-4 pa-4">
    <div>
      <div class="header">
        <h3 class="setting-label">
          {{ t('timekeeping.setting.dateTimekeeping') }}
          <span class="mark-required">*</span>
        </h3>
      </div>
      <div class="mt-2 mb-4 d-flex align-center">
        <div :style="{ width: '300px' }">
          <BaseAutoComplete
            name="dateTimekeeping"
            :items="options"
            :is-disabled="isLastDayOfMonth"
            :placeholder="t('timekeeping.setting.placeholder')"
            :clearable="true"
            :menu-width="300"
            @clear="resetLastDayOfMonth"
          />
        </div>
        <div class="setting-date">
          <v-checkbox
            v-model="isLastDayOfMonth"
            color="primary"
            class="setting-date-checkbox mx-2"
            @update:model-value="resetSelectDate"
          />
          <span class="setting-date-text">{{ t('timekeeping.setting.lastDate') }}</span>
        </div>
      </div>
      <div>
        <h3 class="setting-label">{{ t('timekeeping.setting.titleAuto') }}</h3>
        <v-radio-group v-model="type">
          <v-row>
            <v-col cols="12" class="d-flex align-center pb-0">
              <div class="setting-date">
                <v-radio
                  :value="TimeKeepingType.CUTOFF_DATE"
                  class="setting-date-checkbox"
                  color="primary"
                />
                <span class="setting-date-text">{{
                  t('timekeeping.setting.dateTimekeeping')
                }}</span>
              </div>
            </v-col>
            <span class="setting-subtitle">{{
              t('timekeeping.setting.dateTimekeepingDescription')
            }}</span>
            <v-col cols="12" class="d-flex align-center pb-0">
              <div :class="`setting-date ${isLastDayOfMonth ? `opacity-disable` : ''}`">
                <v-radio
                  :value="TimeKeepingType.END_OF_MONTH"
                  class="setting-date-checkbox"
                  color="primary"
                  :disabled="isLastDayOfMonth"
                />
                <span class="setting-date-text">{{
                  t('timekeeping.setting.dateFuture')
                }}</span>
              </div>
            </v-col>
            <span
              :class="`setting-subtitle ${isLastDayOfMonth ? `opacity-disable` : ''}`"
              >{{ t('timekeeping.setting.dateFutureDescription') }}</span
            >
          </v-row>
        </v-radio-group>
      </div>
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.setting-label {
  font-size: 16px;
  font-weight: 500;
  margin: 10px 0;
}

.mark-required {
  color: $color-red;
}
.setting-date {
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  :deep(.v-input) {
    flex: 0;
  }
  .setting-date-checkbox {
    height: 40px;
    display: flex;
    align-items: center;
  }
  .setting-date-text {
    font-size: 14px;
    font-weight: 500;
  }
}

.opacity-disable {
  opacity: 0.8;
}

.setting-subtitle {
  padding: 0px 10px 0 52px;
  font-size: 14px;
}

:deep(.status-container) {
  position: relative;
}

:deep(.error-message) {
  position: absolute;
  top: 0;
}
</style>
