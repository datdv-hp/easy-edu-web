export enum TuitionStatus {
    COMPLETED = 'COMPLETED',
    PARTIAL_PAID = 'PARTIAL_PAID',
    NOT_PAID = 'NOT_PAID',
    OVER_DUE = 'OVER_DUE',
}

export enum PromotionPriority {
    LOWEST = 1,
    LOW = 2,
    MEDIUM = 3,
    HIGH = 4,
    HIGHEST = 5,
}

export enum PromotionType {
    FIXED_AMOUNT = 'FIXED_AMOUNT',
    PERCENTAGE = 'PERCENTAGE',
}

export const MAX_NUMBER_OF_PROMOTIONS = 5;
