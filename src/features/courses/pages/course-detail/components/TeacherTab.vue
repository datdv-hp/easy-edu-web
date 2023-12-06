<script lang="ts" setup>
import { TableBase } from '@/components';
import { useCourseDetail } from '@/features/courses/store';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const store = useCourseDetail();
const route = useRoute();
onMounted(async () => {
  store.getDetailTeachers(route.params.id as string);
});
</script>
<template>
  <TableBase :is-empty="!store.teacherList?.length">
    <template #thead>
      <tr>
        <th class="text-left ws-nowrap minW-50px w-10">
          {{ $t('courses.detail.teacher.id') }}
        </th>

        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.teacher.name') }}
        </th>
        <th class="text-left ws-nowrap minW-200px">
          {{ $t('courses.detail.teacher.email') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.teacher.phone') }}
        </th>
        <th class="text-left ws-nowrap">
          {{ $t('courses.detail.teacher.degree') }}
        </th>
      </tr>
    </template>
    <template #tbody>
      <tr v-for="(item, index) in store.teacherList" :key="index">
        <td class="ws-nowrap">
          {{ item.code }}
        </td>
        <td class="ws-nowrap">
          {{ item.name }}
        </td>
        <td class="ws-nowrap">
          {{ item.email }}
        </td>
        <td class="ws-nowrap">
          {{ item.phone }}
        </td>
        <td class="ws-nowrap">
          {{ item.teacherDetail?.degree ? item.teacherDetail.degree : '' }}
        </td>
      </tr>
    </template>
  </TableBase>
</template>
<style lang="scss" scoped>
:deep(.v-table__wrapper) {
  height: calc(100vh - 60px - 32px - 388px - 16px - 16px - 56px - 16px + 120px);
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}
</style>
