<script setup lang="ts">
import SideBar from './components/sidebar/SideBar.vue';
</script>

<template>
  <v-app>
    <SideBar />
    <v-main>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
:deep(v-layout),
:deep(.v-navigation-drawer) {
  height: 100vh !important;
  border-right: 1px solid #e9e9eb;
}

:deep(.v-navigation-drawer) {
  position: fixed !important;
}
</style>
