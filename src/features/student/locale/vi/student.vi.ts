import { ErrorCode } from '@/common/constants';

const studentVi = {
  form: {
    title: {
      create: 'Tạo mới học viên',
      edit: 'Chỉnh sửa học viên',
    },
    level: {
      label: 'Cấp học',
      placeholder: 'Chọn cấp học',
    },
    courses: {
      label: 'Khóa học',
      placeholder: 'Chọn khóa học',
    },
    subjects: {
      label: 'Học phần',
      placeholder: 'Chọn học phần',
    },
    courseDetail: {
      label: 'Chi tiết khóa học',
    },
    addOtherCourse: 'Thêm khóa học khác',
    presenter: {
      label: 'Nhân viên tư vấn',
      placeholder: 'Chọn nhân viên tư vấn',
    },
    code: 'ID',
  },
  notification: {
    error: {
      emailOrPhoneExisted: 'Email hoặc số điện thoại đã tồn tại',
      create: 'Thêm mới học viên không thành công',
      edit: 'Cập nhật học viên không thành công',
      delete: 'Xóa học viên không thành công',
    },
    success: {
      createStudent: 'Thêm mới học viên thành công',
      editStudent: 'Cập nhật học viên thành công',
      delete: 'Xóa học viên thành công',
    },
  },
  get: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      student: 'Học viên không tồn tại',
    },
  },
  create: {
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      email: 'Email đã tồn tại',
      phone: 'Số điện thoại đã tồn tại',
    },
    [ErrorCode.ITEM_INVALID]: {
      course: 'Có khóa học không tồn tại',
      subjects: 'Có học phần không tồn tại',
    },
  },
  update: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      student: 'Học viên không tồn tại',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      phone: 'Số điện thoại đã tồn tại',
    },
    [ErrorCode.UNPROCESSABLE_ENTITY]: {
      email: 'Không được thay đổi email',
    },
    [ErrorCode.CONFLICT]: {
      lesson: 'Học viên đang có buổi học',
      course: 'Khóa học đang có buổi học',
    },
  },
  delete: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      student: 'Học viên không tồn tại',
    },
    [ErrorCode.CONFLICT]: {
      lesson: 'Học viên đang có buổi học',
    },
  },
  list: 'Danh sách học viên',
  search: 'Tìm kiếm',
  course: 'Khóa học',
  addStudent: 'Tạo mới',
  totalStudents: 'Tổng số %{total} học viên',
  page: 'Trang',
  table: {
    id: 'ID',
    name: 'Họ và tên',
    courses: 'Khóa học',
    phone: 'Số điện thoại',
    email: 'Email',
    state: 'Trạng thái',
  },

  detail: {
    bar: {
      title: 'Chi tiết học viên',
      delete: 'Xóa',
      edit: 'Chỉnh sửa',
    },
    info: {
      basic: {
        title: 'Thông tin cơ bản',
        academicLevel: 'Cấp học',
        studyingSubjects: 'Khóa học',
        code: 'Mã số học viên',
        role: 'Vai trò',
      },
      courses: {
        id: 'ID',
        title: 'Thông tin lớp học',
        name: 'Khóa học',
        class: 'Lớp học',
        state: 'Trạng thái',
        startDate: 'Ngày khai giảng',
        endDate: 'Ngày bế giảng',
      },
    },
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa học viên này?',
  },
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} học viên đã chọn?',
};

export default studentVi;
