<script setup lang="ts">
defineProps<{
  items: Item[];
}>();

interface Item {
  icon?: string;
  title?: string;
  description?: string[];
}
</script>

<template>
  <v-card class="wrapper py-0">
    <div class="item" v-for="(item, index) in items" :key="index">
      <div class="info-icon">
        <img class="mr-3" :src="item.icon" alt="" />
      </div>
      <div class="info-content">
        <div class="content-title">{{ item.title }}</div>
        <span
          v-for="(subject, index) in item?.description"
          :key="index"
          class="content-desc"
        >
          <span class="subject">
            {{ subject }}
          </span>
        </span>
      </div>
    </div>
  </v-card>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  background-color: #f3f4f8;
  .item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px 0;
    border-bottom: 1px solid #e1e3e9;
  }
  div.item:last-of-type {
    border-bottom: none;
  }
  .content-title {
    font-size: 18px;
    font-weight: 600;
    color: #343458;
    margin-bottom: 14px;
  }
  .subject {
    display: inline-block;
    width: 300px;
    font-size: 16px;
    color: #464962;
    border-right: 2px solid #adaeba;
    padding-right: 10px;
    margin-right: 30px;
    margin-bottom: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
