export default {
  list: 'Danh sách lớp học',
  form: {
    title: {
      create: 'Tạo mới lớp học',
      edit: 'Chỉnh sửa lớp học',
      infoTitle: 'Thông tin lớp học',
      time: 'Thời gian học',
      student: 'Thêm học viên',
      color: 'Chọn màu hiển thị',
    },
    buttons: {
      save: 'Lưu',
      cancel: 'Hủy',
    },
    fields: {
      course: {
        label: 'Khóa học',
        placeholder: 'Chọn khóa học',
      },
      startDate: {
        label: 'Ngày khai giảng',
        placeholder: 'Ngày khai giảng',
      },
      endDate: {
        label: 'Ngày bế giảng',
        placeholder: 'Ngày bế giảng',
      },
      name: {
        label: 'Tên lớp học',
        placeholder: 'Tên lớp học',
      },
      students: {
        label: 'Thêm học viên',
        placeholder: 'Thêm học viên',
      },
    },
  },
  status: {
    upcoming: 'Chưa khai giảng',
    inprogress: 'Đang hoạt động',
    concluded: 'Đã kết thúc',
  },
  table: {
    id: 'Mã lớp',
    name: 'Tên',
    course: 'Khóa học',
    startDate: 'Ngày khai giảng',
    endDate: 'Ngày bế giảng',
    totalStudents: 'Tổng số học viên',
    status: 'Trạng thái',
  },
  notification: {
    success: {
      create: 'Tạo mới thành công',
      edit: 'Cập nhật thành công',
    },
    error: {
      nameExisted: 'Lớp đã tồn tại',
      errorCreate: 'Tạo lớp không thành công',
      errorEdit: 'Cập nhật không thành công',
    },
  },
  total: 'Tổng số %{total} lớp học',
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} lớp đã chọn?',
  detail: {
    headerBar: {
      title: 'Chi tiết lớp học ({id})',
    },
    cardTitle: 'Thông tin lớp học',
    info: {
      id: 'ID',
      totalSutdents: 'Tổng số học viên',
      name: 'Tên lớp học',
      totalLessons: 'Tổng số buổi học',
      course: 'Khóa học',
      numberOfRemainLessons: 'Số buổi học chưa diễn ra',
      startDate: 'Ngày khai giảng',
      numberOfFinishedLessons: 'Số buổi học đã kết thúc',
      endDate: 'Ngày bế giảng',
    },
    buttons: {
      checkIn: 'Điểm danh và chấm công',
      studentAndCourseList: 'Học phần',
      generalAssessment: 'Đánh giá chung',
    },
  },
  timekeepingPage: {
    title: 'Danh sách điểm danh',
    table: {
      no: 'STT',
      id: 'ID',
      studentName: 'Tên học viên',
      teacherName: 'Tên giảng viên',
      attended: 'Số buổi học có mặt',
      noAttended: 'Số buổi vắng',
    },
    totalStudents: 'Tổng số {total} học viên',
    totalTeachers: 'Tổng số {total} giảng viên',
    listType: {
      student: 'Học viên',
      teacher: 'Giảng viên',
    },
  },
  notFound: 'Classroom not found',
};
