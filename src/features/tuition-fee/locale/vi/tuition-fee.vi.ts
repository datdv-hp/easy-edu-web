import { CurrencySuffix } from '@/features/setting/constant';
import { TuitionStatus } from '../../constants';
export const tuitionFeeVi = {
    list: 'Quản lý học phí',
    total: 'Tổng số {total} bản ghi',
    table: {
        id: 'ID',
        studentName: 'Học sinh',
        className: 'Lớp học',
        courseName: 'Khóa học',
        startDate: 'Hạn thanh toán từ',
        endDate: 'Hạn thanh toán đến',
        originalValue: 'Học phí ban đầu',
        discountValue: 'Tổng số tiền khuyến mãi',
        value: 'Học phí cần thanh toán',
        paidValue: 'Đã thanh toán',
        shortageValue: 'Còn thiếu',
        status: 'Trạng thái học phí',
        counselor: 'Nhân viên tư vấn',
        action: 'Hành động',
    },
    filter: {
        classroom: 'Lớp học',
        status: 'Trạng thái học phí',
        startDate: 'Hạn thanh toán từ',
        endDate: 'Hạn thanh toán đến',
        counselor: 'Nhân viên tư vấn',
        placeholder: {
            classroom: 'Chọn lớp học',
            status: 'Chọn trạng thái học phí',
            startDate: 'YYYY-MM-DD',
            endDate: 'YYYY-MM-DD',
            counselor: 'Chọn nhân viên tư vấn',
        },
    },
    detail: {
        title: 'Chi tiết học phí',
        basicInfo: {
            title: 'Thông tin cơ bản',
            student: 'Học sinh',
            classroom: 'Lớp học',
            course: 'Khóa học',
            originalValue: 'Học phí ban đầu',
            counselor: 'Nhân viên tư vấn',
            startDate: 'Hạn thanh toán từ',
            endDate: 'Hạn thanh toán đến',
            placeholder: {
                startDate: 'YYYY-MM-DD',
                endDate: 'YYYY-MM-DD',
            },
        },
        promotionProgramme: {
            title: 'Chương trình khuyến mãi',
            total: 'Tổng số tiền khuyến mãi: {total}',
            apply: 'Chương trình khuyến mãi áp dụng',
            priority: 'Độ ưu tiên',
            promotionValue: 'Số tiền khuyến mãi',
            noApply: 'Không có chương trình khuyến mãi nào được áp dụng',
            placeholder: {
                name: 'Chọn chương trình khuyến mãi',
                priority: 'Chọn độ ưu tiên',
            },
        },
        payment: {
            title: 'Thanh toán',
            value: 'Học phí cần thanh toán',
            paidValue: 'Đã thanh toán',
            shortageValue: 'Còn thiếu',
        },
        paymentHistory: {
            title: 'Lịch sử thanh toán',
            total: 'Tổng số {total} bản ghi',
            index: 'STT',
            paidValue: 'Số tiền đã thanh toán',
            method: 'Phương thức thanh toán',
            date: 'Ngày thanh toán',
            editDate: 'Ngày chỉnh sửa',
        },
    },
    form: {
        payment: {
            value: 'Học phí cần thanh toán',
            paidValue: 'Đã thanh toán',
            shortageValue: 'Còn thiếu',
            paymentMethod: 'Phương thức thanh toán',
            paymentDate: 'Ngày đóng học phí',
            payValue: 'Thanh toán',
            placeholder: {
                paymentDate: 'Chọn ngày đóng học phí',
                paymentMethod: 'Chọn phương thức thanh toán',
                payValue: `0 ${CurrencySuffix.VND}`,
            },
        },
    },
    dialog: {
        paymentTitle: 'Thanh toán',
    },
    status: {
        [TuitionStatus.COMPLETED]: 'Hoàn thành',
        [TuitionStatus.PARTIAL_PAID]: 'Đang thiếu',
        [TuitionStatus.NOT_PAID]: 'Chưa đóng',
        [TuitionStatus.OVER_DUE]: 'Quá hạn',
        undefined: 'Chưa đóng',
    },
    error: {
        payment: 'Thanh toán không thành công',
        update: 'Cập nhật thông tin học phí không thành công',
    },
    success: {
        payment: 'Thanh toán thành công',
        update: 'Cập nhật thông tin học phí thành công',
    },
    paymentError: {},
};