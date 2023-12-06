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

<style lang="scss" scoped></style>
