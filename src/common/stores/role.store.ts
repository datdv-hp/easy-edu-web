import { defineStore } from 'pinia';
import { computed } from 'vue';
import localStorageAuthService from '../storages/authStorage';

export const useRole = defineStore('role-store', () => {
  const _role = computed(() => {
    const role = localStorageAuthService.getUserRole();
    return role;
  });
  const teacher = computed(() => {
    return _role.value.teacher;
  });

  const student = computed(() => {
    return _role.value.student;
  });

  const manager = computed(() => {
    return _role.value.manager;
  });

  const classroom = computed(() => {
    return _role.value.classroom;
  });

  const course = computed(() => {
    return _role.value.course;
  });

  const lesson = computed(() => {
    return _role.value.lesson;
  });

  const user = computed(() => {
    return _role.value.user;
  });

  const schedule = computed(() => {
    return _role.value.schedule;
  });

  const subject = computed(() => {
    return _role.value.subject;
  });

  const timekeeping = computed(() => {
    return _role.value.timekeeping;
  });

  const role = computed(() => {
    return _role.value.role;
  });

  const syllabus = computed(() => {
    return _role.value.syllabus;
  });

  const courseFormSetting = computed(() => {
    return _role.value.courseFormSetting;
  });

  const evaluationClassifiedSetting = computed(() => {
    return _role.value.evaluationClassifiedSetting;
  });
  const evaluationCriteriaSetting = computed(() => {
    return _role.value.evaluationCriteriaSetting;
  });
  const settingTimekeeping = computed(() => {
    return _role.value.settingTimekeeping;
  });

  return {
    teacher,
    student,
    manager,
    course,
    classroom,
    lesson,
    user,
    schedule,
    subject,
    timekeeping,
    role,
    syllabus,
    courseFormSetting,
    evaluationClassifiedSetting,
    evaluationCriteriaSetting,
    settingTimekeeping,
  };
});
