export enum TuitionStatus {
  COMPLETED = 'COMPLETED',
  PARTIAL_PAID = 'PARTIAL_PAID',
  NOT_PAID = 'NOT_PAID',
  OVER_DUE = 'OVER_DUE',
}

export const TuitionStatusColor = {
  [TuitionStatus.COMPLETED]: '#439f6e',
  [TuitionStatus.PARTIAL_PAID]: '#2f80ed',
  [TuitionStatus.NOT_PAID]: '#ebbc2e',
  [TuitionStatus.OVER_DUE]: '#ed3a3a',
};

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
