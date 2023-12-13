<script lang="ts" setup>
import { BaseButton } from '@/components';
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onBeforeMount } from 'vue';
import { usePromotionProgrammeStore } from '../../stores/promotion-programme.store';
import PromotionProgrammeList from './components/list/PromotionProgrammeList.vue';
import SearchBar from './components/list/SearchBar.vue';
import PromotionProgrammeDialog from './components/dialog/PromotionProgrammeDialog.vue';
import { usePromotionProgrammeDialog } from '../../stores/promotion-programme-dialog';
import { useRole } from '@/common/stores/role.store';

const role = useRole();
const store = usePromotionProgrammeStore();
const dialogStore = usePromotionProgrammeDialog();
onBeforeMount(async () => {
    store.getList();
});
</script>
<template>
    <HeaderBar :title="$t('promotionProgramme.list')" :is-hide-back="true">
        <template #append>
            <BaseButton
                v-if="role.promotionSetting?.create"
                left-icon="mdi-plus"
                size="extra-small"
                :label="$t('common.button.create')"
                @click="dialogStore.open()"
            />
        </template>
    </HeaderBar>
    <SearchBar />
    <PromotionProgrammeList />
    <PromotionProgrammeDialog
        v-if="dialogStore.isOpen && role.promotionSetting?.create"
    />
</template>
<style lang="scss" scoped></style>
