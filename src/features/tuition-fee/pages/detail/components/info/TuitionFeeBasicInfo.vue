<script lang="ts" setup>
import icons from '@/assets/icons';
import { useRole } from '@/common/stores/role.store';
import { BaseButton, DatePicker, ProfileItem } from '@/components';
import { formatCurrencyVND } from '@/features/tuition-fee/helpers';
import { useTuitionFeeStore } from '@/features/tuition-fee/stores';
import dayjs from '@/plugins/dayjs';
import { computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

type Props = {
    startDate?: string | Date;
    endDate?: string | Date;
    isValidSubmit?: boolean;
};
defineProps<Props>();

const store = useTuitionFeeStore();
const role = useRole();
const { t } = useI18n();

const emit = defineEmits(['click:update', 'click:cancel', 'click:submit']);

const student = computed(() => ({
    icon: icons.keyIcon,
    title: t('tuitionFee.detail.basicInfo.student'),
    description: store.detail?.studentName || '',
    isShow: true,
}));
const paymentDate = computed(() => [
    {
        icon: icons.keyIcon,
        title: t('tuitionFee.detail.basicInfo.startDate'),
        description: store.detail?.startDate || '',
        isShow: true,
    },
    {
        icon: icons.keyIcon,
        title: t('tuitionFee.detail.basicInfo.endDate'),
        description: store.detail?.endDate || '',
        isShow: true,
    },
]);
const profile = computed(() => {
    const _profile = [
        {
            icon: icons.keyIcon,
            title: t('tuitionFee.detail.basicInfo.classroom'),
            description: store.detail?.className || '',
            isShow: true,
        },
        {
            icon: icons.keyIcon,
            title: t('tuitionFee.detail.basicInfo.course'),
            description: store.detail?.courseName || '',
            isShow: true,
        },
        {
            icon: icons.keyIcon,
            title: t('tuitionFee.detail.basicInfo.originalValue'),
            description: store.detail?.originalValue
                ? formatCurrencyVND(store.detail.originalValue)
                : '',
            isShow: true,
        },

        {
            icon: icons.keyIcon,
            title: t('tuitionFee.detail.basicInfo.counselor'),
            description: store.detail?.presenterName || '',
            isShow: true,
        },
    ];
    return _profile;
});

function handleClickEdit() {
    store.setIsUpdating(true);
    emit('click:update');
}

function handleClickSave() {
    emit('click:submit');
}

function handleClickCancel() {
    emit('click:cancel');
}
onBeforeUnmount(() => {
    store.setIsUpdating(false);
});
</script>
<template>
    <div class="d-flex align-center justify-space-between mt-0 mb-4">
        <div class="profile-title">
            {{ $t('tuitionFee.detail.basicInfo.title') }}
        </div>
        <template v-if="role.tuition?.update">
            <BaseButton
                v-if="!store.isUpdating"
                size="small"
                :label="$t('common.button.edit')"
                @click.stop="handleClickEdit"
            />
            <div v-else>
                <BaseButton
                    size="small"
                    :label="$t('common.button.cancel')"
                    variant="outline"
                    @click.stop="handleClickCancel"
                />
                <BaseButton
                    size="small"
                    class="ms-3"
                    :label="$t('common.button.save')"
                    @click.stop="handleClickSave"
                    :is-disabled="!isValidSubmit"
                    :is-loading="store.isSubmitting"
                />
            </div>
        </template>
    </div>

    <v-row>
        <v-col cols="12">
            <ProfileItem
                :icon="student.icon"
                :title="student.title"
                :description="(student.description as string)"
            />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="8">
            <v-row>
                <v-col
                    cols="6"
                    v-for="(item, index) in profile"
                    :key="`${index}${Math.random()}`"
                >
                    <ProfileItem
                        :icon="item.icon"
                        :title="item.title"
                        :description="(item.description as string)"
                    />
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="4">
            <v-row v-if="store.isUpdating">
                <v-col cols="12">
                    <DatePicker
                        name="payment.startDate"
                        :label="$t('tuitionFee.detail.basicInfo.startDate')"
                        :placeholder="
                            $t('tuitionFee.detail.basicInfo.placeholder.startDate')
                        "
                        value-type="string"
                        :max="endDate ? dayjs(endDate).toDate() : undefined"
                    />
                </v-col>
                <v-col cols="12">
                    <DatePicker
                        name="payment.endDate"
                        :label="$t('tuitionFee.detail.basicInfo.endDate')"
                        :placeholder="
                            $t('tuitionFee.detail.basicInfo.placeholder.endDate')
                        "
                        value-type="string"
                        :min="startDate ? dayjs(startDate).toDate() : dayjs().toDate()"
                    />
                </v-col>
            </v-row>
            <v-row v-else>
                <v-col
                    cols="12"
                    v-for="(item, index) in paymentDate"
                    :key="`${index}${Math.random()}`"
                >
                    <ProfileItem
                        :icon="item.icon"
                        :title="item.title"
                        :description="(item.description as string)"
                    />
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<style lang="scss" scoped></style>
