<script lang="ts" setup>
import { useRole } from '@/common/stores/role.store';
import { BaseButton, LoadingOverlay, TableHeader } from '@/components';
import { useAuthorizationStore } from '@/features/setting/stores';
import { debounce } from 'lodash';
import { computed, ref } from 'vue';
import { VVirtualScroll } from 'vuetify/lib/components/index.mjs';
import { IRoleInfo } from '../../../interfaces';
import { RoleType } from '@/common/constants';

const emit = defineEmits(['change-detail', 'createRole']);
const store = useAuthorizationStore();
const role = useRole();

const listInstance = ref<VVirtualScroll | null>(null);
const roleListWrapper = ref<HTMLElement | null>(null);
const roleListObj = computed(() => {
  const _roleList = {};
  (store.list || []).forEach((item) => {
    const type = item.type;
    if (!_roleList[type]) {
      _roleList[type] = [];
    }
    _roleList[type].push(item);
  });
  return _roleList as Record<string, IRoleInfo[]>;
});

const handleScroll = debounce(async (event: Event) => {
  const eventTarget = event.target as HTMLElement;
  const isAtBottom =
    eventTarget.scrollTop + eventTarget.clientHeight === eventTarget.scrollHeight;
  if (!isAtBottom) {
    return;
  }
  const currentPage = store.roleListQuery.page as number;
  const isAbleGetList = currentPage < store.totalPages;
  if (isAbleGetList) {
    store.setPage(currentPage + 1);
    store.getList(false);
  }
}, 100);

// Hooks
function handleMountedList() {
  if (!listInstance.value) return;
  roleListWrapper.value = listInstance.value.$el as HTMLElement;
  if (roleListWrapper.value) {
    roleListWrapper.value.addEventListener('scroll', handleScroll);
  }
}
function handleBeforeUnmountList() {
  roleListWrapper.value?.removeEventListener('scroll', handleScroll);
}
// Hooks end

const isActive = (id: string) => {
  return id === store.selectedId;
};

function viewDetail(id: string) {
  if (id === store.selectedId) return;
  emit('change-detail', id);
}

function handleSearchRole() {
  store.setKeyword(store.roleListQuery.keyword?.trim());
  store.getList();
}

function onClickCreateRole() {
  emit('createRole');
}

const filter = (evt: KeyboardEvent) => {
  if (!evt.target) return;
  const input = evt.target as HTMLInputElement;
  const cursorPosition = input.selectionStart;
  if ((cursorPosition === 0 && evt.key === ' ') || input.value.length >= 255) {
    evt.preventDefault();
  } else {
    return true;
  }
};
</script>
<template>
  <TableHeader class="table-header" :show-delete="false" :show-total="false">
    <template #prepend>
      <span class="title">{{ $t('authorization.roleList.title') }}</span>
    </template>
    <template #append>
      <BaseButton
        v-if="role.role?.create && !store.isCreating"
        left-icon="mdi-plus"
        is-only-icon
        size="xx-small"
        :is-circle="true"
        @click="onClickCreateRole"
      />
    </template>
  </TableHeader>
  <div class="list-wrapper">
    <div class="mb-5">
      <v-text-field
        class="search mx-4 mb-2"
        variant="outlined"
        :placeholder="$t('common.search')"
        density="compact"
        v-model="store.roleListQuery.keyword"
        hide-details
        @keydown.enter.stop="handleSearchRole"
        @click:append-inner.stop="handleSearchRole"
        prepend-inner-icon="mdi-magnify"
        clearable
        @keypress="(evt: KeyboardEvent) => filter(evt)"
      />
    </div>

    <v-list
      ref="listInstance"
      :style="{ height: 'calc(100vh - 229px)' }"
      v-model:opened="store.openedRoleTypes"
      @vue:mounted="handleMountedList"
      @vue:before-unmount="handleBeforeUnmountList"
    >
      <v-list-group
        v-for="(type, index) in Object.values(RoleType)"
        :key="index"
        :value="type"
      >
        <template #activator="{ props }">
          <v-list-item
            density="compact"
            v-bind="props"
            :title="$t(`authorization.roleType.${type.toLowerCase()}`)"
          />
        </template>
        <v-list-item
          density="compact"
          v-for="(item, _index) in roleListObj[type] || []"
          :key="_index"
          :active="isActive(item.id)"
          @click="viewDetail(item.id)"
          :title="item.name"
        >
          <template #title="{ title }">
            <v-tooltip open-delay="180" :text="item.name" location="right">
              <template #activator="{ props }">
                <div class="role-title" v-bind="props">{{ title }}</div>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
        <div
          v-if="!roleListObj[type]?.length && !store.isFetching"
          class="d-flex align-center justify-center fz-3_5 py-2"
        >
          <div>
            {{ $t('common.noDataText') }}
          </div>
        </div>
      </v-list-group>
    </v-list>

    <LoadingOverlay :loading="store.isFetching" />
  </div>
</template>
<style lang="scss" scoped>
:deep(.v-list-group__header) {
  .v-list-item-title {
    font-weight: 500;
    letter-spacing: 0;
  }
}
:deep(.v-list-item:not(.v-list-group__header)) {
  .v-list-item__overlay {
    background-color: unset;
  }
  &.v-list-item--active {
    background-color: $color-primary-4;
    position: relative;
    ::after {
      content: '';
      position: absolute;
      height: 100%;
      top: 0;
      width: 3px;
      right: 0;
      border-radius: 0px 8px 8px 0px;
      z-index: 1;
      background-color: $color-primary-1;
    }
  }
}

:deep(.v-text-field) {
  .v-field__input {
    min-height: 32px;
  }
}

:deep(.mdi-magnify) {
  background-image: url('@/assets/icons/search.svg');
  background-position: center;
  opacity: 1;
  &::before {
    content: '';
  }
}

.list-wrapper {
  position: relative;
  // border: thin solid #00000014;
  border-top: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.title {
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: $color-text-black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-title {
  font-size: 500;
}
.role-title {
  display: inline-block;
  color: $color-text-black;
  font-size: 14px;
  margin-top: 6px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table-header {
  padding: 16px !important;
  border: none;
}
</style>
