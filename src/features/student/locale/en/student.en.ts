const studentEn = {
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
    code: 'ID',
  },
  notification: {
    error: {
      emailOrPhoneExisted: 'Email hoặc số điện thoại đã tồn tại',
      create: 'Thêm mới học viên không thành công',
      edit: 'Cập nhật học viên không thành công',
      delete: 'Xóa học viên không thành công',
      deleteNotExistedStudent: 'Học viên không tồn tại',
      deleteStudentHasLesson:
        'Học viên đang có buổi học',
      createNotExistedCourse:
        'Có khóa học không tồn tại',
      createNotExistedSubject:
        'Có học phần không tồn tại',
    },
    success: {
      createStudent: 'Thêm mới học viên thành công',
      editStudent: 'Cập nhật học viên thành công',
      delete: 'Xóa học viên thành công',
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
      },
      courses: {
        id: 'ID',
        title: 'Thông tin học tập',
        name: 'Khóa học',
        class: 'Lớp học',
        state: 'Trạng thái',
      },
    },
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa học viên này?',
  },
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} học viên đã chọn?',
};

export default studentEn;
