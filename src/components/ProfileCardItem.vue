<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description?: string | number;
  color?: string;
}>();

const colorStyle = {
  primary: '#6D79E8',
  info: '#0099FF',
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#FF4D4F',
};

const backgroundColorStyle = {
  primary: '#F2F1FF',
  info: '#E0F3FF',
  success: '#eaf8e3',
  warning: '#fef5e2',
  error: '#FFE9E9',
};
</script>

<template>
  <div
    class="wrapper"
    :style="{ backgroundColor: `${backgroundColorStyle[color as string]}` }"
  >
    <div class="content pa-4">
      <div
        class="content-icon"
        :style="{ backgroundColor: `${colorStyle[color as string]}` }"
      >
        <img :src="icon" alt="" />
      </div>
      <div class="info">
        <span class="info-description"> {{ description }}</span>
        <span class="info-title">{{ title }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  border-radius: 14px;
  min-width: 220px;
  max-width: 420px;
}
.content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .content-icon {
    min-width: 40px;
    min-height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24px;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .info {
    min-height: 80px;
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    .info-title {
      display: block;
      font-size: 14px;
    }
    .info-description {
      display: block;
      font-size: 24px;
      font-weight: 500;
      color: '#1B1B33';
      margin-bottom: 10px;
    }
  }
}
</style>
