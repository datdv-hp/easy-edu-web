<script lang="ts" setup>
import syllabusIcons from '@/assets/icons/syllabus';
import { PageName } from '@/common/constants';
import { LoadingOverlay } from '@/components';
import { useClassroomSyllabusStore } from '@/features/classroom/stores';
import router from '@/plugins/vue-router';

const store = useClassroomSyllabusStore();

function goToDetail(id: string) {
  router.push({
    name: PageName.SYLLABUS_DETAIL_PAGE,
    params: {
      id,
    },
  });
}
</script>
<template>
  <v-container class="syllabus-list-container px-0 pt-0" fluid>
    <v-row>
      <v-col
        v-for="card in store.list"
        :key="card.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
        xxl="1"
      >
        <v-card
          width="100%"
          class="syllabus-card pa-2 rounded--4"
          @click.stop="goToDetail(card.id)"
        >
          <v-img
            :lazy-src="syllabusIcons.lectureDefault"
            :src="card.image || syllabusIcons.lectureDefault"
            class="align-end mx-auto rounded--4"
            :height="194"
            cover
          >
            <template v-slot:placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular
                  color="grey-lighten-4"
                  indeterminate
                ></v-progress-circular>
              </div>
            </template>
          </v-img>
          <v-card-item class="pt-2 mt-4">
            <v-card-title class="syllabus-name">
              <v-tooltip :text="card.name" open-delay="150">
                <template #activator="{ props }">
                  <div class="text" v-bind="props">{{ card.name }}</div>
                </template>
              </v-tooltip>
            </v-card-title>
            <v-card-subtitle class="total-lectures">
              <span>{{
                $t('syllabus.list.grid.numberOfLectures', {
                  number: card.numberOfLectures,
                })
              }}</span>
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
    <div
      v-if="!store.list.length && !store.isFetching"
      class="h-100 d-flex align-center justify-center"
    >
      <div>{{ $t('common.noDataText') }}</div>
    </div>
    <LoadingOverlay :loading="store.isFetching" />
  </v-container>
</template>
<style lang="scss" scoped>
.syllabus-card {
  box-shadow: 0px 0px 1px 0px #0c1a4b3d;
}
.syllabus-name {
  font-size: 18px;
  font-weight: 600;
  line-height: 27px;
  color: $color-text-black;
  margin-bottom: 8px;

  .text {
    max-width: 100%;
    width: fit-content;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.total-lectures {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: $color-neutral-3;
  padding: 0;
}
</style>
