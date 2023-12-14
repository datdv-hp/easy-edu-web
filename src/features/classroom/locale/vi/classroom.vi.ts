import { ErrorCode } from '@/common/constants';

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
      teacher: 'Thêm giảng viên',
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
        placeholder: 'Nhập tên lớp học',
      },
      students: {
        label: 'Thêm học viên',
        placeholder: 'Thêm học viên',
      },
      teachers: {
        label: 'Chọn giảng viên',
        placeholder: 'Chọn giảng viên',
      },
      syllabus: {
        label: 'Chọn giáo trình',
        placeholder: 'Chọn giáo trình',
      },
      paymentStartAt: {
        label: 'Ngày bắt đầu thu học phí',
        placeholder: 'Ngày bắt đầu thu học phí',
      },
      paymentEndAt: {
        label: 'Ngày kết thúc thu học phí',
        placeholder: 'Ngày kết thúc thu học phí',
      },
    },
  },
  status: {
    coming: 'Chưa khai giảng',
    opening: 'Đang hoạt động',
    finished: 'Đã kết thúc',
  },
  table: {
    index: 'STT',
    id: 'ID',
    name: 'Lớp học',
    course: 'Khóa học',
    startDate: 'Ngày khai giảng',
    endDate: 'Ngày bế giảng',
    totalStudents: 'Tổng số học viên',
    status: 'Trạng thái',
    studentName: 'Tên học viên',
  },
  notification: {
    success: {
      create: 'Tạo mới lớp học thành công',
      edit: 'Cập nhật lớp học thành công',
      delete: 'Xóa lớp học thành công',
      setting: 'Cài đặt thành công',
    },
    error: {
      nameExisted: 'Lớp đã tồn tại',
      errorCreate: 'Tạo mới lớp không thành công',
      errorEdit: 'Cập nhật không thành công',
      delete: 'Xóa lớp học không thành công',
      setting: 'Cài đặt không thành công',
    },
  },
  get: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Lớp học không tồn tại',
    },
  },
  create: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      course: 'Khóa học không tồn tại',
    },
  },
  update: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      id: 'Cập nhật lớp không thành công. Vì lớp học không tồn tại',
      participants: 'Học viên không tồn tại',
    },
    [ErrorCode.CONFLICT]: {
      studentHasLesson: 'Cập nhật lớp học không thành công. Vì học viên đang có buổi học',
    },
  },
  delete: {
    [ErrorCode.ITEM_NOT_FOUND]: {
      classroom: 'Xóa lớp học không thành công. Vì lớp học không tồn tại',
    },
    [ErrorCode.ITEM_ALREADY_EXIST]: {
      lesson: 'Xóa lớp học không thành công. Vì lớp học đang có buổi học',
    },
  },
  total: 'Tổng số %{total} lớp học',
  deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa {total} lớp đã chọn?',
  deleteConfirmMessageModal: 'Bạn có chắc chắn muốn xóa lớp này?',
  noDataStudent: 'Hiện chưa có học viên nào',
  noDataCourse: 'Hiện chưa có khóa học nào',
  startDateRequired: 'Ngày khai giảng là bắt buộc',
  endDateRequired: 'Ngày bế giảng là bắt buộc',
  detail: {
    headerBar: {
      title: 'Chi tiết lớp học ({id})',
      studentAndCourseTitle: 'Học phần',
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
      checkIn: 'Điểm danh & chấm công',
      studentAndCourseList: 'Học phần',
      generalAssessment: 'Đánh giá chung',
      syllabusList: 'Danh sách giáo trình',
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
  syllabusList: {
    title: 'Danh sách giáo trình ({name})',
    total: 'Tổng số {total} giáo trình',
    table: {
      index: 'STT',
      name: 'Tên giáo trình',
      numberOfLectures: 'Số lượng bài giảng',
    },
  },
  studentAndSubjectPage: {
    totalStudents: 'Tổng số {total} học viên',
  },
  notFound: 'Không tìm thấy lớp học',
};
