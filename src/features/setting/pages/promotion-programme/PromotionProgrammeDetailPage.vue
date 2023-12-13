<script lang="ts" setup>
import { ErrorCode, PageName } from '@/common/constants';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { computed, onBeforeMount, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePromotionProgrammeDialog, usePromotionProgrammeStore } from '../../stores';
import { BaseButton } from '@/components';
import icons from '@/assets/icons';
import { showDialogConfirm } from '@/plugins';
import { useI18n } from 'vue-i18n';
import { showErrorNotification, showSuccessNotification } from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import PromotionProgrammeInfo from './components/detail/PromotionProgrammeInfo.vue';
import StudentListUsedPromotion from './components/detail/StudentListUsedPromotion.vue';
import PromotionProgrammeDialog from './components/dialog/PromotionProgrammeDialog.vue';
import { useRole } from '@/common/stores/role.store';

const route = useRoute();
const router = useRouter();
const role = useRole();
const dialogStore = usePromotionProgrammeDialog();
const store = usePromotionProgrammeStore();
const { t } = useI18n();
onBeforeMount(() => {
    getProfile();
});

const goToListPage = () => {
    router.replace({
        name: PageName.PROMOTION_PROGRAMME_LIST_PAGE,
    });
};
onUnmounted(() => {
    store.setDetail(undefined);
});

function openEditDialog() {
    dialogStore.open(route.params.id as string);
}

function handleDeleteErrors(error: IResponseError) {
    const errorCode = error.errorCode;
    const i18nKey = `promotionProgramme.deleteError.${errorCode}.${error.key}`;
    switch (errorCode) {
        case ErrorCode.ITEM_NOT_FOUND:
            showErrorNotification(t(i18nKey));
            goToListPage();
            break;
        default:
            showErrorNotification(t('promotionProgramme.error.delete'));
            break;
    }
}

async function deletePromotionProgramme() {
    const confirm = await showDialogConfirm('error', {
        title: t('common.deleteConfirm'),
        text: t('promotionProgramme.deleteConfirmMessage'),
    });
    if (!confirm) return;
    const res = await store.deletePromotionProgramme(route.params.id as string);
    if (res.success) {
        showSuccessNotification(t('promotionProgramme.success.delete'));
        goToListPage();
        return;
    }
    if (res?.errors?.length) {
        handleDeleteErrors(res.errors[0]);
    } else {
        showErrorNotification(res.error || (res.message as string));
    }
}

const getProfile = async () => {
    const res = await store.getInfo(route.params.id as string);
    if (res.success) return;
    if (res?.errors?.length) {
        const error = res?.errors[0];
        const i18nKey = `promotionProgramme.getError.${error.errorCode}.${error.key}`;
        showErrorNotification(t(i18nKey));
    } else {
        showErrorNotification(res.error || (res.message as string));
        goToListPage();
    }
};

const title = computed(() => {
    const name = store.info?.name;
    const status = t(`promotionProgramme.status.${store.info?.status}`);
    return `${name} (${status})`;
});
</script>
<template>
    <HeaderBar
        :title="title"
        :defaultBack="{ name: PageName.PROMOTION_PROGRAMME_LIST_PAGE }"
    >
        <template #append>
            <BaseButton
                v-if="role.promotionSetting?.delete"
                class="mr-2"
                size="extra-small"
                variant="outline"
                @click="deletePromotionProgramme"
            >
                <v-img width="16" :src="icons.deleteIcon" class="mr-1" />
                <span>{{ $t('common.button.delete') }}</span>
            </BaseButton>
            <BaseButton
                v-if="role.promotionSetting?.update"
                size="extra-small"
                variant="solid"
                @click="openEditDialog"
            >
                <v-img width="16" :src="icons.editWhite" class="mr-1" />
                <span>{{ $t('common.button.edit') }}</span>
            </BaseButton>
        </template>
    </HeaderBar>
    <PromotionProgrammeInfo />
    <StudentListUsedPromotion />
    <PromotionProgrammeDialog
        v-if="dialogStore.isOpen && role.promotionSetting?.update"
    />
</template>
<style lang="scss" scoped></style>
