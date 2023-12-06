<script setup lang="ts">
import AvatarDefault from '@/assets/images/avatar-default.png';

defineProps({
  avatar: String,
  name: String,
});
</script>

<template>
  <div class="d-flex align-center">
    <v-avatar size="100" class="mr-6">
      <v-img alt="Avatar" :src="avatar || AvatarDefault"></v-img>
    </v-avatar>
    <!-- <span class="name">{{ name }} </span> -->
  </div>
</template>

<style scoped lang="scss">
.name {
  text-transform: uppercase;
  color: $color-text-black;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
}
</style>
