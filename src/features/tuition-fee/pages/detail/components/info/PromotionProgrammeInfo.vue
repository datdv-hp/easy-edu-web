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
                priority === option.value &&
                priority !== props.promotions?.[index]?.priority,
        );
        return _index === -1;
    });
});
const promotionOptions = computed(() => (index: number) => {
    const selectedOptions = props.promotions?.map((item) => item.id);
    return store.promotionOptions.filter((option) => {
        const _index = selectedOptions?.findIndex(
            (promotionId) =>
                promotionId === option.value &&
                promotionId !== props.promotions?.[index]?.id,
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

function onChangePromotion() {
    emit('change:promotion-programme');
}
</script>
<template>
    <div class="d-flex align-center mt-8 mb-4 gap--3">
        <div class="profile-title">
            {{ $t('tuitionFee.detail.promotionProgramme.title') }}
        </div>
        <div
            v-if="!store.isUpdating || !store.isAbleUpdatePromotion"
            class="d-flex align-center"
        >
            {{
                $t('tuitionFee.detail.promotionProgramme.total', {
                    total: formatCurrencyVND(store.detail?.promotionValue || 0),
                })
            }}
        </div>
        <div v-else class="d-flex align-center">
            <Field name="promotionValue" v-slot="{ value }">
                {{
                    $t('tuitionFee.detail.promotionProgramme.total', {
                        total: formatCurrencyVND(value || 0),
                    })
                }}
            </Field>
        </div>
    </div>
    <template v-if="store.detail?.promotions?.length || store.isUpdating">
        <v-row>
            <v-col cols="8" lg="6">
                <v-row>
                    <v-col cols="8">{{
                        $t('tuitionFee.detail.promotionProgramme.apply')
                    }}</v-col>
                    <v-col cols="4">{{
                        $t('tuitionFee.detail.promotionProgramme.promotionValue')
                    }}</v-col>
                </v-row>
            </v-col>
            <v-col cols="4" lg="2">{{
                $t('tuitionFee.detail.promotionProgramme.priority')
            }}</v-col>
        </v-row>
        <template v-if="!store.isUpdating || !store.isAbleUpdatePromotion">
            <v-row v-for="item in store.detail?.promotions" :key="item.id">
                <v-col cols="8" lg="6">
                    <v-row>
                        <v-col cols="8">{{ item.name }}</v-col>
                        <v-col cols="4" class="d-flex align-center">{{
                            formatCurrencyVND(item.finalValue)
                        }}</v-col>
                    </v-row>
                </v-col>
                <v-col cols="4" lg="2">{{ item.priority }}</v-col>
            </v-row>
        </template>
        <template v-else>
            <v-row v-for="(_, index) in promotions" :key="index">
                <v-col cols="8" lg="6">
                    <v-row>
                        <v-col cols="8">
                            <BaseAutoComplete
                                :name="`${props.name}[${index}].id`"
                                :placeholder="
                                    $t(
                                        'tuitionFee.detail.promotionProgramme.placeholder.name',
                                    )
                                "
                                :items="promotionOptions(index)"
                                @change="onChangePromotion"
                            />
                        </v-col>
                        <v-col cols="4" class="d-flex align-center">
                            <Field
                                v-slot="{ value }"
                                :name="`${props.name}[${index}].finalValue`"
                            >
                                {{ formatCurrencyVND(value || 0) }}
                            </Field>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="4" lg="2" class="d-flex align-start gap--3">
                    <BaseAutoComplete
                        :name="`${props.name}[${index}].priority`"
                        :placeholder="
                            $t(
                                'tuitionFee.detail.promotionProgramme.placeholder.priority',
                            )
                        "
                        :items="priorityOptions(index)"
                        @change="onChangePromotion"
                    />
                    <BaseIconButton
                        class="ms-1"
                        :icon="getIcon(index)"
                        size="medium"
                        variant="secondary"
                        :state="getStateIcon(index)"
                        @click="clickAction(index)"
                    />
                </v-col>
            </v-row>
        </template>
    </template>
    <span v-else>{{ $t('tuitionFee.detail.promotionProgramme.noApply') }}</span>
</template>
<style lang="scss" scoped></style>
