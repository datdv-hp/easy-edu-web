<script lang="ts" setup>
import { BaseAutoComplete, BaseIconButton } from '@/components';
import { MAX_NUMBER_OF_PROMOTIONS } from '@/features/tuition-fee/constants';
import { formatCurrencyVND } from '@/features/tuition-fee/helpers';
import { useTuitionFeeStore } from '@/features/tuition-fee/stores';
import { Field } from 'vee-validate';
import { computed } from 'vue';

type Props = {
  name: string;
  promotions: { id: string; finalValue: number; priority: number }[];
};
const props = defineProps<Props>();
const emit = defineEmits([
  'change:promotion-programme',
  'add:promotion-programme',
  'remove:promotion-programme',
]);
const store = useTuitionFeeStore();

const _priorityOptions = Array.from({ length: 5 }, (_, index) => ({
  title: index + 1,
  value: index + 1,
}));

const priorityOptions = computed(() => (index: number) => {
  const selectedOptions = props.promotions?.map((item) => item.priority);
  return _priorityOptions.filter((option) => {
    const _index = selectedOptions?.findIndex(
      (priority) =>
        priority === option.value && priority !== props.promotions?.[index]?.priority,
    );
    return _index === -1;
  });
});
const promotionOptions = computed(() => (index: number) => {
  const selectedOptions = props.promotions?.map((item) => item.id);
  return store.promotionOptions.filter((option) => {
    const _index = selectedOptions?.findIndex(
      (promotionId) =>
        promotionId === option.value && promotionId !== props.promotions?.[index]?.id,
    );
    return _index === -1;
  });
});

const isFirstItem = (index: number) => {
  return index === 0;
};

const isAbleAddPriority = computed(
  () => (props.promotions?.length || 1) < MAX_NUMBER_OF_PROMOTIONS,
);

const getIcon = (index: number) => {
  if (isFirstItem(index) && isAbleAddPriority.value) {
    return 'mdi-plus-circle';
  }
  return 'mdi-close-circle';
};

const getStateIcon = (index: number) => {
  if (isFirstItem(index) && isAbleAddPriority.value) {
    return 'default';
  }
  return 'error';
};

function clickAction(index: number) {
  if (isFirstItem(index) && isAbleAddPriority.value) {
    emit('add:promotion-programme', index);
  } else {
    emit('remove:promotion-programme', index);
  }
}

function onChangePromotion(index: number) {
  emit('change:promotion-programme', index);
}
</script>
<template>
  <div class="profile-title">
    {{ $t('tuitionFee.detail.promotionProgramme.title') }}
  </div>
  <div class="total-promotion">
    <v-icon icon="$custom.ticket-discount" color="primary" />
    <template v-if="!store.isUpdating || !store.isAbleUpdatePromotion">
      {{
        $t('tuitionFee.detail.promotionProgramme.total', {
          total: formatCurrencyVND(store.detail?.promotionValue || 0),
        })
      }}
    </template>
    <template v-else>
      <Field name="promotionValue" v-slot="{ value }">
        {{
          $t('tuitionFee.detail.promotionProgramme.total', {
            total: formatCurrencyVND(value || 0),
          })
        }}
      </Field>
    </template>
  </div>
  <template
    v-if="
      store.detail?.promotions?.length ||
      (store.isUpdating && store.isAbleUpdatePromotion)
    "
  >
    <v-row class="text--neutral-4 font-size--3_5">
      <v-col cols="8" class="pb-2">
        <v-row>
          <v-col cols="8" class="pb-0">
            <span class="text-form-label">{{
              $t('tuitionFee.detail.promotionProgramme.apply')
            }}</span>
          </v-col>
          <v-col cols="4" class="pb-0 pr-0" :class="{ 'text-center': !store.isUpdating }">
            <span class="text-form-label">{{
              $t('tuitionFee.detail.promotionProgramme.priority')
            }}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <template v-if="!store.isUpdating || !store.isAbleUpdatePromotion">
      <v-row
        v-for="item in store.detail?.promotions"
        :key="item.id"
        class="text--black font-weight--500"
      >
        <v-col cols="8" class="pb-0">
          <v-row>
            <v-col cols="8">{{ item.name }}</v-col>
            <v-col cols="4" class="text-center pr-0">{{ item.priority }}</v-col>
          </v-row>
        </v-col>
        <div class="d-flex align-start justify-center py-3">
          {{ formatCurrencyVND(item.finalValue) }}
        </div>
      </v-row>
    </template>
    <template v-else>
      <v-row v-for="(item, index) in promotions" :key="index">
        <v-col cols="8" class="pt-2">
          <v-row>
            <v-col cols="8">
              <BaseAutoComplete
                :is-required="true"
                :name="`${props.name}[${index}].id`"
                :placeholder="$t('tuitionFee.detail.promotionProgramme.placeholder.name')"
                :items="promotionOptions(index)"
                @change="() => onChangePromotion(index)"
              />
            </v-col>
            <v-col cols="4" class="pr-0">
              <BaseAutoComplete
                :name="`${props.name}[${index}].priority`"
                :is-required="true"
                :is-disabled="!item.id"
                :items="priorityOptions(index)"
                @change="onChangePromotion"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4" class="d-flex align-start gap--3 pt-2">
          <BaseIconButton
            class="ms-1"
            :icon="getIcon(index)"
            size="medium"
            variant="secondary"
            :state="getStateIcon(index)"
            @click="clickAction(index)"
          />
          <div class="promotion-value d-flex align-center justify-center">
            <Field v-slot="{ value }" :name="`${props.name}[${index}].finalValue`">
              {{ formatCurrencyVND(value || 0) }}
            </Field>
          </div>
        </v-col>
      </v-row>
    </template>
  </template>
  <span v-else>{{ $t('tuitionFee.detail.promotionProgramme.noApply') }}</span>
</template>
<style lang="scss" scoped>
.profile-title {
  margin-top: 32px;
}

.total-promotion {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 46px;
  width: max-content;
  margin: 16px 0 24px 0;
  border-radius: 12px;
  background-color: #f7f6ff;
  padding: 12px;
  border: 2px solid $color-primary-1;
  font-weight: 500;
  color: $color-text-black;
}

.promotion-value {
  // border: 1px solid $color-neutral-6;
  color: $color-text-black;
  // padding: 0 12px;
  height: 48px;
  border-radius: 8px;
}
</style>
