import classroomForm from '@/features/classroom/locale/vi/form.vi';
import coursesForm from '@/features/courses/locale/vi/form.vi';
import lessonForm from '@/features/lesson/locale/vi/form.vi';
import managerForm from '@/features/manager/locale/vi/form.vi';
import { paymentMethodFormEn } from '@/features/setting/locale/en/payment-method.en';
import { promotionFormEn } from '@/features/setting/locale/en/promotion-programme.en';
import { authorizationForm } from '@/features/setting/locale/vi/authorization.vi';
import studentForm from '@/features/student/locale/vi/form.vi';
import subjectForm from '@/features/subject/locale/vi/form.vi';
import { syllabusForm } from '@/features/syllabus/locale/vi/syllabus.vi';
import teacherDetail from '@/features/teacher/locale/vi/form.vi';
import { tuitionFeeForm } from '@/features/tuition-fee/locale';

export const yupFieldsEn = {
  name: 'Tên',
  role: 'Vai trò',
  nameBusiness: 'Tên doanh nghiệp/nhà trường',
  contractCode: 'Mã số hợp đồng',
  email: 'Email',
  subjectEmail: 'Tiêu đề',
  detail: 'Nội dung',
  phone: 'Số điện thoại',
  oldPassword: 'Mật khẩu hiện tại',
  password: 'Mật khẩu',
  confirmPassword: 'Nhập lại mật khẩu',
  confirmNewPassword: 'Nhập lại mật khẩu mới',
  signingDate: 'Ngày ký hợp đồng',
  birthDate: 'Ngày sinh',
  dob: 'Ngày sinh',
  gender: 'Giới tính',
  educationalBackground: 'Bằng cấp / chứng chỉ',
  institution: 'Đơn vị công tác',
  teachingSubjects: 'Học phần giảng dạy',
  teacherRole: 'Vai trò',
  subjects: 'học phần',
  workUnit: 'Đơn vị công tác',
  avatar: 'Ảnh đại diện',

  picName: 'Họ tên',
  picEmail: 'Email',
  picPhone: 'Số điện thoại',
  picDob: 'Ngày sinh',
  picIdentity: 'CCCD/CMT/Passport',
  repass: 'Nhập lại mật khẩu',
  taxCode: 'Mã số thuế',
  contractNo: 'Mã số hợp đồng',
  leName: 'Họ tên',
  leDob: 'Ngày sinh',
  LeIdentity: 'CCCD/CMT/Passport',
  lePhone: 'Số điện thoại',
  leEmail: 'Email',
  domains: 'Lĩnh vực đào tạo',
  tenant: 'Tên miền',

  course: 'Khóa học',
  startDate: 'Ngày khai giảng',
  endDate: 'Ngày bế giảng',
  students: 'Danh sách học viên',

  student: 'Học viên',
  manager: 'Quản trị viên',
  reason: 'Mô tả',
  link: 'Đường dẫn',
  courseType: 'Tên hình thức',
  evaluationType: 'Tên xếp loại',
  evaluationCriteria: 'Tên tiêu chí',
  CriteriaType: 'Kiểu dữ liệu',
  content: 'Nội dung',

  // landing page
  memo: 'Lời nhắn',

  // Setting
  recipe: 'Công thức',
  typeScore: 'Thang điểm',
  nameScore: 'Tên thang điểm',
  score: 'Điểm',

  // courses
  examinationName: 'Tên bài kiểm tra',
  examinationCode: 'Mã bài kiểm tra',
  dateTimekeeping: 'Ngày chốt công',

  ...managerForm,
  ...coursesForm,
  ...classroomForm,
  ...subjectForm,
  ...lessonForm,
  ...teacherDetail,
  ...studentForm,
  authorizationForm,
  syllabusForm,
  tuitionFeeForm: tuitionFeeForm.en,
  promotion: promotionFormEn,
  paymentMethodForm: paymentMethodFormEn,
};
