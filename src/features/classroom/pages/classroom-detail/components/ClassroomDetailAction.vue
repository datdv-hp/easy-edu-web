<script setup lang="ts">
import Icons from '@/assets/icons';
import { PageName } from '@/common/constants';
import { useRole } from '@/common/stores/role.store';
import CardButton from '@/components/CardButton.vue';
import { useClassroomStore } from '@/features/classroom/stores';
import router from '@/plugins/vue-router';

const store = useClassroomStore();
const role = useRole();

function goTo(page: PageName) {
  if (!store.detail?.id) return;
  router.push({
    name: page,
    params: {
      id: store.detail?.id,
    },
  });
}
</script>

<template>
  <div class="wrapper">
    <v-row class="pa-4">
      <v-col cols="6" lg="4" v-if="role.classroom?.viewSyllabus">
        <CardButton
          :title="$t('classroom.detail.buttons.syllabusList')"
          :icon="Icons.rating"
          @handle-click="goTo(PageName.CLASSROOM_SYLLABUS_LIST_PAGE)"
        />
      </v-col>
      <v-col
        cols="6"
        lg="4"
        v-if="role.classroom?.viewTimeKeeping || role.classroom?.viewAttendance"
      >
        <CardButton
          :title="$t('classroom.detail.buttons.checkIn')"
          :icon="Icons.timekeepingButton"
          @handle-click="goTo(PageName.CLASSROOM_TIMEKEEPING_PAGE)"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  margin-bottom: 10px;
}
</style>
