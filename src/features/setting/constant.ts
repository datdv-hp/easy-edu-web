export enum CriteriaType {
  FORMULA = 'FORMULA',
  LIST = 'LIST',
}

export enum StatusEvaluationCriteriaType {
  FOLLOWING = 'FOLLOWING',
  UN_FOLLOWING = 'UN_FOLLOWING',
}

export enum CriteriaApplyType {
  COURSE = 'COURSE',
  LESSON = 'LESSON',
}

export enum TypeScore {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
}

export enum TimeKeepingType {
  CUTOFF_DATE = 'CUTOFF_DATE',
  END_OF_MONTH = 'END_OF_MONTH',
}

// Promotion Programme
export enum PromotionType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  PERCENTAGE = 'PERCENTAGE',
}

export enum PromotionStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  EXPIRED = 'EXPIRED',
}

export enum CurrencySuffix {
  VND = 'VND',
}

export enum PromotionValueSuffix {
  PERCENTAGE = '%',
  FIXED_AMOUNT = CurrencySuffix.VND,
  undefined = '%',
}
