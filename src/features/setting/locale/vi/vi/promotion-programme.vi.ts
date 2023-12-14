const PromotionProgrammeVi = {
    list: 'Danh sách chương trình khuyến mại',
    total: 'Tổng số {total} chương trình khuyến mại',
    table: {
        name: 'Tên bộ chương trình',
        course: 'Khóa học',
        value: 'Phần trăm/Số tiền',
        usedCount: 'Số lượng áp dụng',
        startDate: 'Ngày bắt đầu',
        endDate: 'Ngày kết thúc',
        status: 'Trạng thái',
    },
    form: {
        name: 'Tên chương trình khuyến mại',
        description: 'Mô tả',
        type: 'Loại khuyến mãi',
        value: {
            PERCENTAGE: 'Phần trăm',
            FIXED_AMOUNT: 'Số tiền',
            undefined: 'Phần trăm',
        },
        applyForCourses: 'Áp dụng cho khóa học',
        times: 'Số lượng',
        startDate: 'Ngày bắt đầu',
        endDate: 'Ngày kết thúc',
        placeholder: {
            name: 'Nhập tên chương trình khuyến mại',
            description: 'Nhập mô tả',
            value: {
                PERCENTAGE: 'Nhập phần trăm',
                FIXED_AMOUNT: 'Nhập số tiền',
                undefined: 'Nhập phần trăm',
            },
            applyForCourses: 'Chọn khóa học',
            times: 'Nhập số lượng',
            startDate: 'Ngày bắt đầu',
            endDate: 'Ngày kết thúc',
        },
        create: {
            title: 'Tạo chương trình khuyến mại',
        },
        update: {
            title: 'Chỉnh sửa chương trình khuyến mại',
        },
    },
    info: {
        title: 'Thông tin chương trình khuyến mại',
    },
    studentList: {
        title: 'Danh sách học sinh áp dụng chương trình',
        total: 'Tổng số {total} học sinh',
        table: {
            index: 'ID',
            name: 'Tên học sinh',
            course: 'Khóa học',
        },
    },
    deleteConfirmMessageTotal:
        'Bạn có chắc chắn muốn xóa {total} chương trình khuyến mại đã chọn?',
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa chương trình khuyến mại này?',
    success: {
        delete: 'Xoá chương trình khuyến mại thành công',
        create: 'Tạo chương trình khuyến mại thành công',
        update: 'Cập nhật chương trình khuyến mại thành công',
    },
    error: {
        delete: 'Xoá chương trình khuyến mại Không thành công',
        create: 'Tạo chương trình khuyến mại Không thành công',
        update: 'Cập nhật chương trình khuyến mại Không thành công',
        existedName: 'Tên chương trình khuyến mại đã tồn tại',
        notFound: 'Chương trình khuyến mại không tồn tại',
    },
    getError: {},
    deleteError: {},
    updateError: {},
    createError: {},
    status: {
        UPCOMING: 'Sắp diễn ra',
        ONGOING: 'Đang diễn ra',
        EXPIRED: 'Đã kết thúc',
    },
    type: {
        PERCENTAGE: 'Giảm theo phần trăm',
        FIXED_AMOUNT: 'Giảm theo số tiền',
    },
};

export const promotionFormVi = {
    name: 'Tên chương trình khuyến mại',
    description: 'Mô tả',
    type: 'Loại khuyến mãi',
    value: {
        percentage: 'Phần trăm',
        fixedAmount: 'Số tiền',
    },
    applyForCourses: 'Áp dụng cho khóa học',
    times: 'Số lượng',
    startDate: 'Ngày bắt đầu',
    endDate: 'Ngày kết thúc',
};
export default PromotionProgrammeVi;
