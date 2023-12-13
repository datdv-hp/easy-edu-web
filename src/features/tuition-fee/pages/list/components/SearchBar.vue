<script lang="ts" setup>
import { BaseAutoComplete, DatePicker, SearchForm } from '@/components';
import { TuitionStatus } from '@/features/tuition-fee/constants';
import { useTuitionFeeStore } from '@/features/tuition-fee/stores';
import { isEmpty } from 'lodash';
import { useForm } from 'vee-validate';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const store = useTuitionFeeStore();
const { t } = useI18n();
const { handleSubmit, setFieldValue, values: formValue } = useForm();

const TuitionStatusOptions = computed(() => {
    return Object.values(TuitionStatus).map((status) => ({
        title: t(`tuitionFee.status.${status}`),
        value: status,
    }));
});
onMounted(() => {
    store.getClassroomOptions();
    store.getPresenterOptions();
});
const submit = handleSubmit(async (values) => {
    store.setQuery({
        ...values,
        keyword: values.keyword?.trim(),
    });
    setFieldValue('keyword', store.listQuery.keyword);
    await store.getList();
});

const isApplyFilter = computed(() =>
    Object.keys(formValue).some((key) => key !== 'keyword' && !isEmpty(formValue[key])),
);
</script>
<template>
    <SearchForm :is-apply-filter="isApplyFilter" @submit="submit()" :is-use-filter="true">
        <template #filters>
            <v-row class="filter-content mx-0">
                <v-col cols="12" class="px-0">
                    <BaseAutoComplete
                        name="classroomIds"
                        :label="$t('tuitionFee.filter.classroom')"
                        :placeholder="$t('tuitionFee.filter.placeholder.classroom')"
                        :multiple="true"
                        :items="store.classroomOptions"
                    />
                </v-col>
                <v-col cols="12" class="px-0">
                    <BaseAutoComplete
                        name="statuses"
                        :label="$t('tuitionFee.filter.status')"
                        :placeholder="$t('tuitionFee.filter.placeholder.status')"
                        :multiple="true"
                        :items="TuitionStatusOptions"
                    />
                </v-col>
                <v-col cols="12" class="px-0">
                    <DatePicker
                        name="startAt"
                        :label="$t('tuitionFee.filter.startDate')"
                        :placeholder="$t('tuitionFee.filter.placeholder.startDate')"
                        value-type="string"
                        :max="formValue.endAt"
                    />
                </v-col>
                <v-col cols="12" class="px-0">
                    <DatePicker
                        name="endAt"
                        :label="$t('tuitionFee.filter.endDate')"
                        :placeholder="$t('tuitionFee.filter.placeholder.endDate')"
                        value-type="string"
                        :min="formValue.startAt"
                    />
                </v-col>
                <v-col cols="12" class="px-0">
                    <BaseAutoComplete
                        name="presenterIds"
                        :label="$t('tuitionFee.filter.counselor')"
                        :placeholder="$t('tuitionFee.filter.placeholder.counselor')"
                        :multiple="true"
                        :items="store.presenterOptions"
                    />
                </v-col>
            </v-row>
        </template>
    </SearchForm>
</template>
<style lang="scss" scoped>
.filter-content {
    max-width: 300px;
}
</style>
