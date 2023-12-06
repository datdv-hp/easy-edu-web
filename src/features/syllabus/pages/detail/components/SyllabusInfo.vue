<script lang="ts" setup>
import icons from '@/assets/icons';
import { useRole } from '@/common/stores/role.store';
import { BaseButton } from '@/components';
import { useSyllabusDetail } from '@/features/syllabus/stores';
import { useSyllabusBasicInfoDialog } from '@/features/syllabus/stores/basic-info-dialog.store';
import { useRoute } from 'vue-router';

const store = useSyllabusDetail();
const dialogStore = useSyllabusBasicInfoDialog();
const route = useRoute();
const role = useRole();

function openEditDialog() {
  dialogStore.open(route.params.id as string);
}
</script>
<template>
  <v-card class="pa-6" height="374px">
    <template v-if="store.detail">
      <v-card-title class="info-title px-0">
        <div class="d-flex align-center justify-space-between">
          <div class="info-title-text">{{ store.detail?.name || '' }}</div>
          <BaseButton
            v-if="role.syllabus?.update"
            size="extra-small"
            variant="text"
            @click="openEditDialog"
          >
            <v-img width="16" :src="icons.editPurple" class="mr-1" />
            <span>{{ $t('common.button.edit') }}</span>
          </BaseButton>
        </div></v-card-title
      >
      <v-card-text class="mt-3 px-0 overflow-scrollbar">
        <v-row>
          <v-col cols="4" class="info-label">{{
            $t('syllabus.detail.info.createdAt')
          }}</v-col>
          <v-col cols="8" class="info-text">{{ store.detail?.createdAt }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="info-label">{{
            $t('syllabus.detail.info.createdBy')
          }}</v-col>
          <v-col cols="8" class="info-text">{{ store.detail?.createdBy }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="info-label">{{
            $t('syllabus.detail.info.updatedAt')
          }}</v-col>
          <v-col cols="8" class="info-text">{{ store.detail?.updatedAt }}</v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="info-label">{{
            $t('syllabus.detail.info.updatedBy')
          }}</v-col>
          <v-col cols="8" class="info-text">{{ store.detail?.updatedBy }}</v-col>
        </v-row>
      </v-card-text>
    </template>
  </v-card>
</template>
<style lang="scss" scoped>
.info-title {
  font-size: 24px;
  font-weight: 500;
  line-height: 36px;
  color: $color-text-black;
  border-bottom: thin solid $color-neutral-6;

  .info-title-text {
    overflow: hidden;
    display: -webkit-box;
    line-break: normal;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
  }
}

.info-label {
  color: $color-neutral-3;
  font-size: 16px;
  line-height: 24px;
}
.info-text {
  color: $color-text-black;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
}
</style>
