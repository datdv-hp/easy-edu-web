const teacherEn = {
  list: 'Danh sách giảng viên',
  search: 'Tìm kiếm',
  course: 'Học phần',
  addTeacher: 'Tạo mới',
  total: 'Tổng số %{total} giảng viên',
  totalClasses: 'Tổng số %{total} lớp học',
  page: 'Trang',
  subject: 'Học phần',
  table: {
    id: 'ID',
    name: 'Họ và tên',
    terms: 'Học phần giảng dạy',
    skill: 'Kỹ năng',
    phone: 'Số điện thoại',
    email: 'Email',
    state: 'Trạng thái',
  },
  form: {
    title: {
      create: 'Tạo mới giảng viên',
      edit: 'Chỉnh sửa giảng viên',
      infoTitle: 'Thông tin giảng viên',
    },
    roles: {
      title: 'Chức vụ',
      cumTeacher: 'Kiêm nhiệm Giảng viên',
      teacher: 'Giảng viên',
      manager: 'Quản trị viên',
    },
    teacherId: {
      label: 'Giảng viên_ID',
    },
    teachingSubjects: {
      label: 'Học phần giảng dạy',
      placeholder: 'Chọn học phần giảng dạy',
    },
    workUnit: {
      label: 'Đơn vị công tác',
      placeholder: 'Đơn vị công tác',
    },
    skill: {
      label: 'Kỹ năng',
      placeholder: 'Kỹ năng',
    },
  },
  avatarCropper: {
    title: 'Chỉnh sửa ảnh đại diện',
    buttons: {
      crop: 'Cắt ảnh',
      cancel: 'Hủy',
      new: 'Tải ảnh lên',
    },
  },
  detail: {
    bar: {
      title: 'Chi tiết giảng viên',
    },
    info: {
      basic: {
        title: 'Thông tin cơ bản',
        academicLevel: 'Trình độ học vấn',
        workingUnit: 'Đơn vị công tác',
        teachingSubjects: 'Môn dạy',
        skill: 'Kỹ năng',
      },
      courses: {
        id: 'ID',
        title: 'Thông tin khóa học',
        name: 'Khóa học giảng dạy',
        class: 'Lớp học',
        state: 'Trạng thái',
      },
      rating: {
        title: 'Kết quả đánh giá',
        save: 'Lưu',
        class: 'Lớp học',
        subject: {
          title: 'Học phần',
          placeholder: 'Chọn học phần',
        },
        student: {
          title: 'Học viên',
          placeholder: 'Chọn học viên',
        },
        manager: {
          title: 'Quản trị viên',
          placeholder: 'Chọn quản trị viên',
        },
        comment: {
          title: 'Nội dung nhận xét',
          placeholder: 'Chọn nội dung',
        },
        action: 'Hành động',
      },
    },
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa giảng viên này?',
  },
  notification: {
    error: {
      emailOrPhoneExisted: 'Email hoặc số điện thoại đã tồn tại',
      errorCreate: 'Thêm mới giảng viên không thành công',
      errorEdit: 'Cập nhật giảng viên không thành công',
    },
    success: {
      create: 'Thêm mới giảng viên thành công',
      edit: 'Cập nhật giảng viên thành công',
    },
  },
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} giảng viên đã chọn?',
  classStatus: {
    no_start: 'Chưa khai giảng',
    started: 'Đang hoạt động',
    finished: 'Đã kết thúc',
  },
};

export default teacherEn;
