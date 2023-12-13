<script lang="ts" setup>
import { BaseButton, BaseIconButton, InputNumber } from '@/components';
import InputText from '@/components/base/InputText.vue';
import { useForm } from 'vee-validate';
import { computed, onBeforeUnmount, ref } from 'vue';
import { IEvaluationRecipeScore } from '../interfaces';
import { settingListRecipeScore } from '../schema';
import { onMounted } from 'vue';
import { useSettingEvaluationItemDialog } from '../stores/setting-evaluation-item-dialog.store';
import { isEqual } from 'lodash';

const dialogStore = useSettingEvaluationItemDialog();
const props = withDefaults(
  defineProps<{
    index: number;
    scores?: any[];
  }>(),
  {},
);

const {
  values: form,
  meta,
  setFieldValue,
  validate,
  resetForm,
  setFieldError,
} = useForm<{ index: number; scores: IEvaluationRecipeScore[] }>({
  initialValues: {
    index: props.index,
    scores: [
      {
        name: undefined,
        from: '0',
        to: undefined,
      },
    ],
  },
  validationSchema: settingListRecipeScore,
});

const cloneData = ref();

const limitScore = 10;

onMounted(() => {
  if (dialogStore.isUpdate) {
    const data = props.scores?.map((item, index) => {
      if (index === 0) {
        return {
          name: item.name as string,
          from: '0' as string,
          to: item.maxScores.toString(),
        };
      } else {
        return {
          name: item.name as string,
          from: props.scores?.[index - 1]?.maxScores.toString(),
          to: item.maxScores.toString(),
        };
      }
    });
    cloneData.value = data;
    if (data?.length) {
      setFieldValue(`scores`, data as []);
    }
  }
});

const isChangeForm = computed(() => {
  return !isEqual(cloneData.value, form.scores);
});

const onDeleteEvaluationItemList = (index: number) => {
  const newData = form.scores;
  if (newData[index + 1]) {
    newData[index + 1].from = newData[index - 1].to;
  }
  newData.splice(index, 1);
  setFieldValue('scores', newData);
};

const onAddEvaluationItemList = () => {
  if (!form.scores) form.scores = [];
  const length = form.scores.length;
  if (length >= limitScore) return;
  const newData = form.scores;
  if (length > 0) {
    newData.push({
      name: undefined,
      from: form.scores[length - 1].to,
      to: undefined,
    });
  } else if (length === 0) {
    newData.push({
      name: undefined,
      from: 0,
      to: undefined,
    });
  }

  setFieldValue('scores', newData);
};

const onChangeScoreTo = (index: number) => {
  const scoreTo = form.scores?.[index].to;
  if (form.scores[index + 1]) {
    setFieldValue(`scores.${index + 1}.from`, scoreTo);
  }
};

const isLastScore = (index: number) => {
  return form.scores.length === index + 1;
};

defineExpose({ form, meta, validate, setFieldValue, setFieldError, isChangeForm });

onBeforeUnmount(() => {
  resetForm();
});
</script>
<template>
  <div class="wrapper">
    <v-row>
      <v-col
        cols="12"
        class="d-flex align-start gap-4"
        v-for="(_, index) in form.scores"
        :key="index"
      >
        <v-row class="mb-0">
          <v-col :cols="5">
            <InputText
              :name="`scores[${index}].name`"
              :label="index === 0 ? $t('settings.typeScore.name.label') : undefined"
              :placeholder="$t('settings.typeScore.name.placeholder')"
              :is-required="true"
            />
          </v-col>
          <v-col :cols="5">
            <v-row>
              <v-col :cols="5">
                <InputNumber
                  :name="`scores[${index}].from`"
                  :label="index === 0 ? $t('settings.typeScore.score.label') : undefined"
                  :placeholder="$t('settings.typeScore.score.placeholder')"
                  :is-required="true"
                  :disabled="true"
                />
              </v-col>
              <v-col :cols="2" class="d-flex align-start"
                ><div :class="index === 0 ? `separate-1` : `separate-2`">-</div></v-col
              >
              <v-col :cols="5" class="">
                <div class="separate-label" v-if="index === 0"></div>
                <InputNumber
                  :name="`scores[${index}].to`"
                  :placeholder="$t('settings.typeScore.score.placeholder')"
                  @change="onChangeScoreTo(index)"
                  :clearable="true"
                />
              </v-col>
            </v-row>
          </v-col>
          <v-col
            :cols="2"
            :class="index === 0 ? `d-flex align-center` : `d-flex align-start`"
          >
            <v-row>
              <v-col :cols="6" :class="index === 0 ? `mt-6` : ``">
                <v-tooltip
                  v-if="_.from && _.to"
                  :text="
                    isLastScore(index)
                      ? $t('settings.typeScore.tooltipLast', {
                          from: _.from,
                          to: _.to,
                        })
                      : $t('settings.typeScore.tooltip', {
                          from: _.from,
                          to: _.to,
                        })
                  "
                  location="top"
                >
                  <template v-slot:activator="{ props }">
                    <BaseIconButton
                      v-bind="props"
                      :icon="'mdi-alert-circle-outline '"
                      size="medium"
                      :state="'disabled'"
                      variant="secondary"
                      :is-disabled="true"
                    />
                  </template>
                </v-tooltip>
                <BaseIconButton
                  v-if="!_.from || !_.to"
                  :icon="'mdi-alert-circle-outline '"
                  size="medium"
                  :state="'disabled'"
                  variant="secondary"
                  :is-disabled="true"
                />
              </v-col>
              <v-col :cols="6" class="">
                <BaseIconButton
                  v-if="index !== 0"
                  :icon="'mdi-close-circle'"
                  size="medium"
                  :state="'error'"
                  variant="secondary"
                  @click="onDeleteEvaluationItemList(index)"
                />
                <div class="btn-fake" v-if="index === 0"></div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="12">
        <BaseButton
          :label="$t('settings.evaluationItem.createScore')"
          left-icon="mdi-plus"
          variant="text"
          size="small"
          @click="onAddEvaluationItemList()"
        />
      </v-col>
    </v-row>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  margin-top: 10px;
  padding-left: 20px;
  border-left: 1px solid $color-border-focus-secondary;
}

:deep(.v-btn) {
  margin-left: 10px;
  border: none !important;
}

:deep(.v-btn--disabled) {
  background-color: transparent !important;
}

.btn-fake {
  width: 66px;
  height: 48px;
}

.separate-1 {
  display: flex;
  width: 48px !important;
  height: 72px !important;
  padding-top: 24px;
  align-items: center;
  justify-content: center;
}

.separate-2 {
  display: flex;
  width: 48px !important;
  height: 48px !important;
  align-items: center;
  justify-content: center;
}

.separate-label {
  height: 24px;
}

:deep(.status-container) {
  position: relative;
}

:deep(.error-message) {
  position: absolute;
  top: 0;
}
</style>
