import { ErrorCode } from '@/common/constants';

const SettingsVi = {
  courseTitle: 'Cài đặt hình thức khóa học',
  timekeepingTitle: 'Cài đặt ngày chốt công',
  courseTable: {
    option: 'Hình thức',
    action: 'Hành động',
  },
  course: {
    create: 'Tạo mới hình thức khóa học',
    update: 'Chỉnh sửa hình thức khóa học',
    courseType: {
      label: 'Tên hình thức',
      placeholder: 'Nhập tên hình thức',
    },
  },
  evaluationTitle: 'Cài đặt đánh giá',
  evaluationList: {
    title: 'Xếp loại đánh giá',
    create: 'Tạo mới xếp loại đánh giá',
    update: 'Chỉnh sửa xếp loại đánh giá',
    evaluationType: {
      label: 'Tên xếp loại',
      placeholder: 'Nhập tên xếp loại',
    },
  },
  evaluationCriteriaTotal: 'Tổng số {total} tiêu chí đánh giá',
  evaluationClassifiedTotal: 'Tổng số {total} xếp loại đánh giá',
  courseTypeTotal: 'Tổng số {total} hình thức khóa học',
  evaluationItem: {
    title: 'Tiêu chí đánh giá',
    titleList: 'Danh sách nội dung',
    create: 'Tạo mới tiêu chí đánh giá',
    update: 'Chỉnh sửa tiêu chí đánh giá',
    createRecipe: 'Thêm cài đặt',
    createContent: 'Thêm mới',
    createScore: 'Thêm thang điểm',
    table: {
      name: 'Tên tiêu chí',
      course: 'Khóa học',
      description: 'Mô tả',
      status: 'Trạng thái',
      isStatus: 'Sử dụng',
      isNotStatus: 'Không sử dụng',
      action: 'Hành động',
    },
    statusOptions: {
      all: 'Tất cả trạng thái',
      isStatus: 'Sử dụng',
      isNotStatus: 'Không sử dụng',
    },
    form: {
      name: {
        label: 'Tên tiêu chí',
        placeholder: 'Nhập tên tiêu chí',
      },
      status: {
        label: 'Đưa vào đánh giá',
      },
      description: {
        label: 'Mô tả',
        placeholder: 'Nhập mô tả',
      },
      type: {
        label: 'Kiểu dữ liệu',
        placeholder: 'Chọn kiểu dữ liệu',
      },
      typeOptions: {
        recipe: 'Công thức',
        list: 'Danh sách',
      },
      content: {
        label: 'Nội dung',
        placeholder: 'Nhập nội dung',
      },
      course: {
        label: 'Khóa học',
        placeholder: 'Chọn khóa học',
      },
      typeScore: {
        label: 'Thang điểm',
        placeholder: 'Chọn thang điểm',
      },
      recipe: {
        label: 'Công thức',
        placeholder: 'Nhập công thức',
      },
      isApplyAllCourse: {
        label: 'Tất cả khóa học',
      },
    },
  },
  typeScore: {
    text: 'Chữ',
    number: 'Số',
    name: {
      label: 'Tên thang điểm',
      placeholder: 'Nhập tên thang điểm',
    },
    score: {
      label: 'Điểm',
      placeholder: 'Nhập điểm',
    },
    tooltip: 'Ví dụ: Lấy từ {from} <= x < {to} , [{from}, {to})',
    tooltipLast: 'Ví dụ: Lấy từ {from} <= x <= {to} , [{from}, {to}]',
  },
  success: {
    courseTypeCreate: 'Thêm mới hình thức khóa học thành công',
    courseTypeUpdate: 'Cập nhật hình thức khóa học thành công',
    courseTypeDelete: 'Xóa hình thức khóa học thành công',
    evaluationCreate: 'Thêm mới xếp loại đánh giá thành công',
    evaluationUpdate: 'Cập nhật xếp loại đánh giá thành công',
    evaluationDelete: 'Xóa xếp loại đánh giá thành công',
    evaluationItemCreate: 'Thêm mới tiêu chí đánh giá thành công',
    evaluationItemUpdate: 'Cập nhật tiêu chí đánh giá thành công',
    evaluationItemDelete: 'Xóa tiêu chí đánh giá thành công',
    timekeepingUpdate: 'Cập nhật ngày chốt công thành công',
  },
  error: {
    courseTypeCreate: 'Thêm mới hình thức khóa học không thành công',
    courseTypeUpdate: 'Cập nhật hình thức khóa học không thành công',
    courseTypeDelete: 'Xóa hình thức khóa học không thành công',
    evaluationCreate: 'Thêm mới xếp loại đánh giá không thành công',
    evaluationUpdate: 'Cập nhật xếp loại đánh giá không thành công',
    evaluationDelete: 'Xóa xếp loại đánh giá không thành công',
    evaluationItemCreate: 'Thêm mới tiêu chí đánh giá không thành công',
    evaluationItemUpdate: 'Cập nhật tiêu chí đánh giá không thành công',
    evaluationItemDelete: 'Xóa tiêu chí đánh giá không thành công',
    timekeepingUpdate: 'Cập nhật ngày chốt công không thành công',
    createCourseType: {
      [ErrorCode.ITEM_ALREADY_EXIST]: {
        name: 'Tên hình thức đã tồn tại',
      },
    },
    createEvaluation: {
      [ErrorCode.ITEM_ALREADY_EXIST]: {
        name: 'Tên xếp loại đã tồn tại',
      },
    },
    createEvaluationItem: {
      [ErrorCode.VALIDATE]: {
        formulaNameScore: 'Tên thang điểm đã tồn tại',
        course: 'Khóa học đã tồn tại',
      },
      [ErrorCode.ITEM_ALREADY_EXIST]: {
        name: 'Tên tiêu chí đã tồn tại',
      },
    },
    updateEvaluationItem: {
      [ErrorCode.VALIDATE]: {
        formulaNameScore: 'Tên thang điểm đã tồn tại',
        course: 'Khóa học đã tồn tại',
      },
      [ErrorCode.ITEM_ALREADY_EXIST]: {
        name: 'Tên tiêu chí đã tồn tại',
      },
    },
  },
  confirmation: {
    deleteEvaluationItem: 'Bạn có chắc chắn muốn xóa {total} tiêu chí đánh giá đã chọn?',
    deleteEvaluationType: 'Bạn có chắc chắn muốn xóa {total} xếp loại đánh giá đã chọn?',
    deleteCourseType: 'Bạn có chắc chắn muốn xóa {total} hình thức khóa học đã chọn?',
  },
  validate: {
    formula: 'Công thức không hợp lệ',
  },
};

export default SettingsVi;
