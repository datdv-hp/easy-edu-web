<script lang="ts" setup>
import logo from '@/assets/images/logo.svg';
import { ISidebarGroup } from '@/common/interfaces';
import { useSidebarStore } from '@/common/stores';
import UserAvatar from '@/components/UserAvatar.vue';
import { ComputedRef, onMounted, ref } from 'vue';
import { VListGroup, VMenu } from 'vuetify/lib/components/index.mjs';
import SubGroupWrapper from './SubGroupWrapper.vue';
import { sidebarItems } from './sidebar';

const sidebarStore = useSidebarStore();
const rail = ref(sidebarStore.rail);
const width = ref(300);
let sidebar: ComputedRef<ISidebarGroup[]>;

onMounted(() => {
  sidebar = sidebarItems();
});

const toggleCollapse = () => {
  if (!rail.value) {
    width.value = 60;
    setTimeout(() => {
      rail.value = !rail.value;
    }, 240);
  } else {
    width.value = 300;
    rail.value = !rail.value;
  }
  sidebarStore.setRail(rail.value);
};
</script>

<template>
  <v-navigation-drawer
    class="sidebar"
    v-model:rail="rail"
    :rail-width="60"
    :permanent="true"
    :width="width"
  >
    <v-list class="py-0">
      <v-list-item class="text-center" :class="{ 'px-2': rail }">
        <v-img :src="logo" :lazy-src="logo" :height="54"></v-img>
      </v-list-item>
    </v-list>
    <v-list class="sidebar-items pr-0" :nav="true" :lines="false" color="primary">
      <template v-for="(group, groupIndex) in sidebar" :key="groupIndex">
        <template v-if="group.groupName">
          <v-list-subheader
            :class="{ 'mt-4': groupIndex }"
            v-show="!rail"
            :title="group.groupName"
          />
          <v-divider v-if="groupIndex" class="mx-auto my-4" :length="48" v-show="rail" />
        </template>
        <template v-for="(item, _) in group.items" :key="_">
          <component
            v-if="item.subItems?.length"
            :is="rail ? VMenu : VListGroup"
            offset="12"
            location="right top"
          >
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="item.title" :prepend-icon="item.icon">
                <v-tooltip
                  v-if="rail"
                  activator="parent"
                  open-delay="150"
                  :text="item.title"
                />
              </v-list-item>
            </template>
            <SubGroupWrapper :is-rail="rail">
              <v-list-item
                v-for="(subItem, subIndex) in item.subItems"
                :key="subIndex"
                :to="{ name: subItem.routeName }"
                :title="subItem.title"
              />
            </SubGroupWrapper>
          </component>
          <v-list-item
            v-else
            :prepend-icon="item.icon"
            :title="item.title"
            :to="{ name: item.routeName }"
          >
            <v-tooltip
              v-if="rail"
              activator="parent"
              open-delay="150"
              :text="item.title"
            />
          </v-list-item>
        </template>
      </template>
    </v-list>
    <UserAvatar class="user-info" location="right" />
    <v-icon
      class="sidebar-collapse"
      :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
      size="24"
      @click="toggleCollapse"
    />
  </v-navigation-drawer>
</template>
<style lang="scss" scoped>
.sidebar {
  position: relative;
  text-align: left;
  transition: all 0.24s linear !important;

  .sidebar-collapse {
    position: absolute;
    width: 26px;
    height: 26px;
    top: 17px;
    right: 0;
    display: flex;
    align-items: center;
    border-radius: 50%;
    transform: translateX(50%);
    background-color: $color-white;
    border: 1px solid #e1e3e9;
    box-shadow:
      0px 1px 3px 0px #130a2e21,
      0px 3px 14px 0px #130a2e08,
      0px 8px 32px 0px #130a2e12,
      0px 30px 84px 0px #130a2e14 !important;
    transition: all 0.4s ease-in;
    cursor: pointer;
    &:hover {
      transform: scale(1.2) translateX(40%);
    }
  }
}

:deep(.v-list-item) {
  color: $color-text-black;
  .v-list-item__prepend {
    .v-icon {
      opacity: 0.8;
      font-size: 20px;
    }
  }
}

.sidebar-items {
  height: calc(100vh - 122px);
  overflow-y: scroll;
  padding-right: 4px !important;
  scrollbar-gutter: stable;
  &::-webkit-scrollbar {
    visibility: hidden;
    background-color: #fff;
    width: 4px;
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    visibility: hidden;
    background-color: $color-neutral-6;
    border-radius: 6px;
  }

  &:hover::-webkit-scrollbar-thumb {
    visibility: visible;
  }
}
.user-info {
  background-color: $color-white;
  height: 60px;
  box-shadow:
    0px 1px 3px 0px #130a2e21,
    0px 3px 14px 0px #130a2e08,
    0px 8px 32px 0px #130a2e12,
    0px 30px 84px 0px #130a2e14 !important;
}
</style>
