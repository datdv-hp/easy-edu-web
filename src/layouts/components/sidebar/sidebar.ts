import { PageName } from '@/common/constants';
import type { ISidebarGroup } from '@/common/interfaces';
import { useRole } from '@/common/stores';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export const sidebarItems = () => {
  const { t } = useI18n();
  const role = useRole();

  const viewSettingPermission = computed(
    () =>
      role.role?.view ||
      role.courseFormSetting?.view ||
      role.evaluationClassifiedSetting?.view ||
      role.evaluationCriteriaSetting?.view ||
      role.settingTimekeeping?.view,
  );

  const _sidebarItems = computed<ISidebarGroup[]>(() =>
    [
      {
        groupName: t('app.sidebar.userManagement.groupName'),
        items: [
          {
            title: t('app.sidebar.userManagement.manager.name'),
            icon: '$sidebar.manager',
            routeName: PageName.MANAGER_LIST_PAGE,
            activeRouteNames: [PageName.MANAGER_LIST_PAGE, PageName.MANAGER_DETAIL_PAGE],
            role: role?.manager?.view,
          },
          {
            title: t('app.sidebar.userManagement.teacher.name'),
            icon: '$sidebar.teacher',
            routeName: PageName.TEACHER_LIST_PAGE,
            activeRouteNames: [PageName.TEACHER_LIST_PAGE, PageName.TEACHER_DETAIL_PAGE],
            role: role?.teacher?.view,
          },
          {
            title: t('app.sidebar.userManagement.student.name'),
            icon: '$sidebar.student',
            routeName: PageName.STUDENT_LIST_PAGE,
            activeRouteNames: [PageName.STUDENT_LIST_PAGE, PageName.STUDENT_DETAIL_PAGE],
            role: role?.student?.view,
          },
        ].filter((item) => item.role),
        role: role?.student?.view || role?.teacher?.view || role?.manager?.view,
      },
      {
        groupName: t('app.sidebar.trainingManagement.groupName'),
        items: [
          {
            title: t('app.sidebar.trainingManagement.course.name'),
            icon: '$sidebar.course',
            routeName: PageName.COURSE_LIST_PAGE,
            activeRouteNames: [PageName.COURSE_LIST_PAGE, PageName.COURSE_DETAIL_PAGE],
            role: role?.course?.view || role.course?.viewPersonal,
          },
          {
            title: t('app.sidebar.trainingManagement.subject.name'),
            icon: '$sidebar.subject',
            routeName: PageName.SUBJECT_LIST_PAGE,
            activeRouteNames: [PageName.SUBJECT_LIST_PAGE],
            role: role?.subject?.view,
          },
          {
            title: t('app.sidebar.trainingManagement.syllabus.name'),
            icon: '$sidebar.syllabus',
            routeName: PageName.SYLLABUS_LIST_PAGE,
            activeRouteNames: [
              PageName.SYLLABUS_LIST_PAGE,
              PageName.SYLLABUS_CREATE_PAGE,
              PageName.SYLLABUS_DETAIL_PAGE,
            ],
            role: role?.syllabus?.view || role.syllabus?.viewPersonal,
          },
        ].filter((item) => item.role),
        role:
          role?.subject?.view ||
          role?.course?.view ||
          role.course?.viewPersonal ||
          role.syllabus?.view,
      },
      {
        groupName: t('app.sidebar.teaching.groupName'),
        items: [
          {
            title: t('app.sidebar.teaching.classroom.name'),
            icon: '$sidebar.classroom',
            routeName: PageName.CLASSROOM_LIST_PAGE,
            activeRouteNames: [
              PageName.CLASSROOM_LIST_PAGE,
              PageName.CLASSROOM_DETAIL_PAGE,
              PageName.CLASSROOM_TIMEKEEPING_PAGE,
              PageName.CLASSROOM_SYLLABUS_LIST_PAGE,
            ],
            role: role?.classroom?.view || role?.classroom?.viewPersonal,
          },
          {
            title: t('app.sidebar.teaching.lesson.name'),
            icon: '$sidebar.lesson',
            routeName: PageName.LESSON_LIST_PAGE,
            activeRouteNames: [PageName.LESSON_LIST_PAGE, PageName.LESSON_DETAIL_PAGE],
            role: role?.lesson?.view || role.lesson?.viewPersonal,
          },
        ].filter((item) => item.role),
        role:
          role?.lesson?.view ||
          role.lesson?.viewPersonal ||
          role?.classroom?.view ||
          role.classroom?.viewPersonal,
      },
      {
        groupName: t('app.sidebar.schedule.groupName'),
        items: [
          {
            title: t('app.sidebar.userManagement.manager.schedule'),
            icon: '$sidebar.schedule',
            routeName: PageName.SCHEDULE_TRACKING_PAGE,
            activeRouteNames: [PageName.SCHEDULE_TRACKING_PAGE],
            role: role.schedule?.view || role.schedule?.viewPersonal,
          },
          {
            title: t('app.sidebar.userManagement.teacher.timekeeping'),
            icon: '$sidebar.timekeeping',
            routeName: PageName.TIMEKEEPING_PAGE,
            activeRouteNames: [PageName.TIMEKEEPING_PAGE],
            role: role?.timekeeping?.view || role.timekeeping?.viewPersonal,
          },
        ].filter((item) => item.role),
        role:
          role.schedule?.view ||
          role.schedule?.viewPersonal ||
          role?.timekeeping?.view ||
          role.timekeeping?.viewPersonal,
      },
      {
        items: [
          {
            title: t('app.sidebar.setting.groupName'),
            icon: '$sidebar.setting',
            subItems: [
              {
                title: t('app.sidebar.setting.userRole.name'),
                routeName: PageName.SETTING_USER_AUTHORIZATION,
                activeRouteNames: [PageName.SETTING_USER_AUTHORIZATION],
                role: role.role?.view,
              },
              {
                title: t('app.sidebar.setting.course.name'),
                routeName: PageName.SETTING_COURSE_PAGE,
                activeRouteNames: [PageName.SETTING_COURSE_PAGE],
                role: role.courseFormSetting?.view,
              },
              {
                title: t('app.sidebar.setting.evaluation.name'),
                routeName: PageName.SETTING_EVALUATION_PAGE,
                activeRouteNames: [PageName.SETTING_EVALUATION_PAGE],
                role:
                  role.evaluationClassifiedSetting?.view ||
                  role.evaluationCriteriaSetting?.view,
              },
              {
                title: t('app.sidebar.setting.timekeeping.name'),
                routeName: PageName.SETTING_TIMEKEEPING_PAGE,
                activeRouteNames: [PageName.SETTING_TIMEKEEPING_PAGE],
                role: role.settingTimekeeping?.view,
              },
            ].filter((item) => item.role),
            role: viewSettingPermission.value,
          },
        ].filter((item) => item.role),
        role: viewSettingPermission.value,
      },
    ].filter((group) => group.role),
  );
  return _sidebarItems;
};
