<script setup lang="ts">
import icons from '@/assets/icons';
import { BaseAutoComplete, BaseButton } from '@/components';
import { useStudentStore } from '@/features/student/stores';
import { cloneDeep } from 'lodash';
import { useField } from 'vee-validate';
import { computed } from 'vue';

const store = useStudentStore();
interface ICourseDetail {
  courseId?: string;
  subjectIds?: string[];
}

const {
  value: courses,
  resetField,
  validate,
} = useField<ICourseDetail[]>('studentDetail.courses', undefined, {
  initialValue: [
    {
      courseId: undefined,
      subjectIds: undefined,
    },
  ],
});

const onAddCourseDetail = () => {
  if (!courses.value) {
    resetField();
    return;
  }
  courses.value.push({
    courseId: undefined,
    subjectIds: undefined,
  });
};

const removeCourse = (index: number) => {
  courses.value.splice(index, 1);
  validate();
};

const courseOptions = computed(() => (index: number) => {
  const _courses = cloneDeep(store.courses || []);
  return _courses.filter((course) =>
    courses.value.every(
      (item) =>
        item.courseId !== course.value ||
        course.value === courses.value?.[index].courseId,
    ),
  );
});

const onChangeCourse = (index: number, value?: string) => {
  if (!value) {
    courses.value[index].subjectIds = [];
    return;
  }
  courses.value[index].subjectIds = undefined;
};

const onChangeSubjects = (value: string[], index: number) => {
  if (!value?.length) {
    courses.value[index].subjectIds = undefined;
  }
};
const isShowDelete = computed(() => courses.value.length > 1);
</script>
<template>
  <div
    v-for="(_, index) in courses"
    :key="index"
    class="bg-color-1 px-5 py-6 rounded--1_5 mt-6"
  >
    <v-row class="align-center">
      <v-col>
        <v-row>
          <v-col cols="6" class="align-start">
            <BaseAutoComplete
              :label="$t('student.form.courses.label')"
              :placeholder="$t('student.form.courses.placeholder')"
              :name="`studentDetail.courses[${index}].courseId`"
              :items="courseOptions(index)"
              :is-required="true"
              @change="(value?: string) => onChangeCourse(index, value)"
            />
          </v-col>
          <v-col cols="6" class="align-start">
            <BaseAutoComplete
              :name="`studentDetail.courses[${index}].subjectIds`"
              :label="$t('student.form.subjects.label')"
              :placeholder="$t('student.form.subjects.placeholder')"
              :items="store.subjectsByCourse(courses?.[index]?.courseId)"
              :multiple="true"
              :is-disabled="!courses[index].courseId"
              @change="(value: string[]) => onChangeSubjects(value, index)"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="1" class="mt-6" v-show="isShowDelete">
        <v-img
          class="cursor-pointer"
          width="20"
          :src="icons.deleteRed"
          @click="() => removeCourse(index)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <BaseAutoComplete
          :name="`studentDetail.courses[${index}].presenterId`"
          :label="$t('student.form.presenter.label')"
          :placeholder="$t('student.form.presenter.placeholder')"
          :items="store.presenterOptions"
          :is-disabled="!courses[index].courseId"
        />
      </v-col>
    </v-row>
  </div>
  <v-row>
    <v-col cols="12" class="d-flex justify-center mt-3">
      <BaseButton
        :label="$t('student.form.addOtherCourse')"
        variant="text"
        left-icon="mdi-plus"
        size="extra-small"
        @click="onAddCourseDetail"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
:deep(.status-container) {
  position: relative;
}

:deep(.error-message) {
  position: absolute;
  top: 0;
}
</style>
