<script lang="ts" setup>
import { useAuthorizationStore } from '@/features/setting/stores';
import PermissionItem from './PermissionItem.vue';
import { isEmpty } from 'lodash';
import { computed } from 'vue';

const store = useAuthorizationStore();
defineProps({ offset: { type: String } });
const defaultKeys = computed(() => store.defaultPermissionKeys.keys);

const disabledKeys = {
  course: ['view', 'viewPersonal'],
};

const relatedKeysWithBasicDetail = {
  course: [
    'detailStatistics',
    'viewClassroomByCourse',
    'update',
    'viewPersonalClassroomByCourse',
    'viewTeacherByCourse',
    'viewSubjectByCourse',
    'viewExamsByCourse',
  ],
  classroom: [
    'viewSyllabus',
    'download',
    'detailStatistics',
    'viewTimeKeeping',
    'viewAttendance',
    'viewStudentClassroom',
    'viewGeneralClassroom',
    'update',
  ],
};
const relatedKeysWithViewSyllabus = {
  classroom: ['download'],
};
</script>
<template>
  <div class="permission-list-wrapper">
    <div class="title">{{ $t('authorization.permissionList.title') }}</div>
    <div class="permission-list-content">
      <v-expansion-panels
        v-if="!isEmpty(defaultKeys)"
        class="overflow-scrollbar permission-list"
        :multiple="true"
      >
        <PermissionItem
          v-for="groupPermission in Object.keys(defaultKeys)"
          :key="groupPermission"
          :name="groupPermission"
          :permission-keys="defaultKeys[groupPermission]"
          :disabled-keys="disabledKeys[groupPermission] || []"
          :related-keys-with-basic-detail="
            relatedKeysWithBasicDetail[groupPermission] || []
          "
          :related-keys-with-view-syllabus="
            relatedKeysWithViewSyllabus[groupPermission] || []
          "
        />
      </v-expansion-panels>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.permission-list-wrapper {
  margin-top: 24px;
  border-radius: 8px;
  box-shadow: 0px 2px 9px 0px #32324724;
  background-color: $color-white;
}

.title {
  font-size: 18px;
  font-weight: 600;
  line-height: 27px;
  color: $color-text-black;
  padding: 16px 16px 4px 16px;
}
.permission-list-content {
  height: calc(100vh - v-bind(offset) - 189px);
}
.permission-list {
  overflow-y: auto;
  max-height: 100%;
  border-radius: 8px;
}

:deep(.v-expansion-panel) {
  border-radius: 0;
  .v-expansion-panel-title {
    font-weight: 500;
    color: $color-neutral-1;
    font-size: 16px;
    line-height: 24px;
    padding: 16px 16px 8px 16px;
    justify-content: flex-end;
    flex-direction: row-reverse;
    gap: 6px;
    .v-expansion-panel-title__icon {
      margin-inline-start: 0;
      font-size: 10.67px;
    }
  }

  .v-expansion-panel-text__wrapper {
    padding: 16px 12px;
    margin-top: 12px;
    margin-left: 26px;
  }

  &:not(:first-child)::after {
    border-top-style: none !important;
  }
  .v-expansion-panel-title__overlay {
    width: calc(100% - 24px) !important;
    background-color: transparent;
    opacity: 1;
    left: 16px;
  }
  &:hover {
    .v-expansion-panel-title__overlay {
      opacity: 1;
    }
  }
}

:deep(.v-expansion-panel:not(:last-child)) {
  .v-expansion-panel-title__overlay {
    border-bottom: 1px solid $color-neutral-6;
  }
}

:deep(.v-expansion-panel--active) {
  margin-top: 0 !important;
  > button.v-expansion-panel-title--active {
    min-height: 48px !important;
  }

  .v-expansion-panel-title__overlay {
    width: calc(100% - 24px) !important;
    border-bottom: 1px solid $color-neutral-6;
    background-color: transparent;
    opacity: 1;
    left: 16px;
  }
  &:hover {
    .v-expansion-panel-title__overlay {
      opacity: 1;
    }
  }
}

:deep(.v-expansion-panel--after-active) {
  margin-top: 0px !important;
}
</style>
