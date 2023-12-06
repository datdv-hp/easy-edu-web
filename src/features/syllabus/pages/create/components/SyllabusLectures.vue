<script lang="ts" setup>
import syllabusIcon from '@/assets/icons/syllabus';
import { FORM_VALIDATION } from '@/common/constants';
import { BaseButton, InputText } from '@/components';
import { ISyllabusLecture } from '@/features/syllabus/interfaces';
import { computed } from 'vue';
import SyllabusLectureFiles from './SyllabusLectureFiles.vue';
import SyllabusLectureLinks from './SyllabusLectureLinks.vue';
import { useSyllabusStore } from '@/features/syllabus/stores';

interface Props {
  name?: string;
  lectures?: ISyllabusLecture[];
  isShowAdd?: boolean;
}
const store = useSyllabusStore();

const props = withDefaults(defineProps<Props>(), {
  name: 'lectures',
  isShowAdd: true,
});
const emit = defineEmits<{
  (e: 'addLecture'): void;
  (e: 'removeLecture', index: number): void;
  (e: 'changeSubject', index: number, value?: string): void;
}>();
const isShowDelete = computed(() => props.lectures && props.lectures.length > 1);

function onAddLecture() {
  emit('addLecture');
}
function removeLecture(index: number) {
  if (hasErrors(index)) {
    const errorIndexes = store.lectureErrorIndexes?.filter((idx) => idx !== index);
    store.setLectureErrorIndexes(errorIndexes);
  }
  emit('removeLecture', index);
}

function hasErrors(index: number) {
  return store.lectureErrorIndexes?.includes(index);
}
</script>
<template>
  <label class="large-form-label mb-0">
    {{ $t('syllabus.form.lecture.label') }}
    <span class="mark-required">*</span>
  </label>
  <div
    v-for="(_, index) in lectures"
    :key="index"
    class="bg-color-1 px-5 py-5 rounded--1_5 mt-3"
  >
    <v-row :id="`syllabus-lectures-${index}`">
      <v-col>
        <v-row>
          <v-col cols="12" class="py-2 d-flex justify-space-between">
            <span class="subLabel">{{
              $t('syllabus.form.lecture.subLabel', { index: index + 1 })
            }}</span>
            <img
              v-show="isShowDelete"
              class="cursor-pointer"
              width="20"
              :src="syllabusIcon.deleteRed"
              @click="() => removeLecture(index)"
            />
          </v-col>
          <v-col cols="12" class="py-2">
            <InputText
              :name="`${props.name}[${index}].name`"
              :label="$t('syllabus.form.lectureName.label')"
              :placeholder="$t('syllabus.form.lectureName.placeholder')"
              :max-length="FORM_VALIDATION.textMaxLength"
              :is-required="true"
            />
          </v-col>
          <v-col cols="12" class="py-2">
            <div class="text-form-label">
              {{ $t('syllabus.form.lectureSyllabus.label') }}
              <span class="mark-required">*</span>
            </div>
            <SyllabusLectureFiles :name="`${props.name}[${index}].files`" />
            <SyllabusLectureLinks :name="`${props.name}[${index}].referenceLinks`" />
            <div class="error-message" v-if="hasErrors(index)">
              <span class="mark-required">
                {{ $t('syllabus.form.message.lectureEmpty') }}</span
              >
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
  <v-row v-if="isShowAdd">
    <v-col cols="12" class="d-flex justify-center mt-3">
      <BaseButton
        :label="$t('syllabus.button.addMoreLecture')"
        variant="text"
        left-icon="mdi-plus"
        size="extra-small"
        @click="onAddLecture"
      />
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
.mark-required {
  color: $color-red;
}
.subLabel {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: $color-text-black;
}

.addLecture {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 16px;
  color: $color-primary-1;
  font-size: 14px;
  cursor: pointer;
}

.error-message {
  margin-top: 4px;
  color: #ed3a3a;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
}
</style>
