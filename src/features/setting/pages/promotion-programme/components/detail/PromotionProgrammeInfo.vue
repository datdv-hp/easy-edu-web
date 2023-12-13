<script lang="ts" setup>
import icons from '@/assets/icons';
import { ProfileItem } from '@/components';
import { usePromotionProgrammeStore } from '@/features/setting/stores';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = usePromotionProgrammeStore();

const description = computed(() => ({
    icon: icons.keyIcon,
    title: t('promotionProgramme.form.description'),
    description: store.info?.description,
    isShow: store.info?.description ? true : false,
}));
const profile = computed(() => {
    if (!store.info) return [];
    const info = store.info;
    const _profile = [
        {
            icon: icons.keyIcon,
            title: t('promotionProgramme.form.type'),
            description: t(`promotionProgramme.type.${info?.type}`),
            isShow: true,
        },
        {
            icon: icons.keyIcon,
            title: t(`promotionProgramme.form.value.${info?.type}`),
            description: info.value,
            isShow: true,
        },
        {
            icon: icons.keyIcon,
            title: t(`promotionProgramme.form.times`),
            description: info.times,
            isShow: true,
        },
        {
            icon: icons.keyIcon,
            title: t(`promotionProgramme.form.startDate`),
            description: info.startDate,
            isShow: true,
        },
        {
            icon: icons.keyIcon,
            title: t(`promotionProgramme.form.endDate`),
            description: info.endDate,
            isShow: true,
        },
    ];
    return _profile.filter((item) => item.isShow);
});
</script>
<template>
    <v-card class="mx-4 mt-4 info-card">
        <v-card-text>
            <div class="profile-title mt-0 mb-4">
                {{ $t('promotionProgramme.info.title') }}
            </div>
            <v-row v-if="description.isShow">
                <v-col>
                    <ProfileItem
                        :icon="description.icon"
                        :title="description.title"
                        :description="(description.description as string)"
                    />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="4" v-for="(item, index) in profile" :key="index">
                    <ProfileItem
                        :icon="item.icon"
                        :title="item.title"
                        :description="(item.description as string)"
                    />
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<style lang="scss" scoped>
.info-card {
    min-height: 256px;
}
</style>
