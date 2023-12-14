import { common, app } from '@/common/locale';
import error from '@/features/errors/locale';
import { teacher, timekeeping } from '@/features/teacher/locale';
import student from '@/features/student/locale';
import manager from '@/features/manager/locale';
import auth from '@/features/auth/locale';
import subjects from '../../features/subject/locale';
import courses from '@/features/courses/locale';
import classroom from '@/features/classroom/locale';
import lesson from '@/features/lesson/locale';
import scheduleTracking from '@/features/schedule-tracking/locale';
import syllabus from '@/features/syllabus/locale';
import {
  authorization,
  PaymentMethod,
  PromotionProgramme,
  Settings,
} from '@/features/setting/locale';
import { yupVi } from '../yup/locale/vi/vi';
import { yupEn } from '../yup/locale/en/en';
import { yupFieldsVi } from '../yup/locale/vi/fields.vi';
import { yupFieldsEn } from '../yup/locale/en/fields.en';
import { userProfile } from '@/features/auth/locale';
import { registration } from '@/features/registration/locale';
import { tuitionFee } from '@/features/tuition-fee/locale';
const messages = {
  vi: {
    app: app.vi,
    common: common.vi,
    yup: yupVi,
    yupFields: yupFieldsVi,
    error: error.vi,
    teacher: teacher.vi,
    student: student.vi,
    manager: manager.vi,
    auth: auth.vi,
    courses: courses.vi,
    subjects: subjects.vi,
    classroom: classroom.vi,
    lesson: lesson.vi,
    scheduleTracking: scheduleTracking.vi,
    syllabus: syllabus.vi,
    timekeeping: timekeeping.vi,
    settings: Settings.vi,
    authorization: authorization.vi,
    userProfile: userProfile.vi,
    registration: registration.vi,
    tuitionFee: tuitionFee.vi,
    promotionProgramme: PromotionProgramme.vi,
    paymentMethod: PaymentMethod.vi,
  },
  en: {
    app: app.en,
    common: common.en,
    yup: yupEn,
    yupFields: yupFieldsEn,
    error: error.en,
    teacher: teacher.en,
    student: student.en,
    manager: manager.en,
    auth: auth.en,
    courses: courses.en,
    subjects: subjects.en,
    classroom: classroom.en,
    lesson: lesson.en,
    scheduleTracking: scheduleTracking.en,
    syllabus: syllabus.en,
    settings: Settings.en,
    authorization: authorization.en,
    userProfile: userProfile.en,
    registration: registration.en,
    tuitionFee: tuitionFee.en,
    promotionProgramme: PromotionProgramme.en,
    paymentMethod: PaymentMethod.en,
  },
};

export default messages;
