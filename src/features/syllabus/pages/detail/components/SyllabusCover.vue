<script lang="ts" setup>
import syllabusIcons from '@/assets/icons/syllabus';
import { useSyllabusDetail } from '@/features/syllabus/stores';

const store = useSyllabusDetail();
</script>
<template>
  <v-card class="pa-0" height="374px" width="100%">
    <v-card-text class="cover-wrapper h-100 pa-0">
      <v-img
        :src="store.detail?.image || syllabusIcons.defaultCover"
        :lazy-src="syllabusIcons.defaultCover"
        width="100%"
        height="100%"
        :cover="!!store.detail?.image"
        class="mx-auto"
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
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.default-cover {
  align-self: center;
  justify-self: center;
}
.cover-wrapper {
  display: grid;

  .upload-btn {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 74px;
    display: none;
    transition: display ease-in-out 0.2s;
  }

  &:hover {
    .upload-btn {
      display: block;
    }
  }
}
</style>
