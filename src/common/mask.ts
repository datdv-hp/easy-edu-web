import { type MaskOptions } from 'maska';

export const nameMask: MaskOptions = {
  mask: '@',
  tokens: {
    '@': {
      pattern: /[^[\]\\|'";:/?.>,<)(_=+!@#$%^&*`~0-9-]/,
      multiple: true,
    },
  },
  eager: true,
};

export const nameMaskWithNumber: MaskOptions = {
  mask: '@',
  tokens: {
    '@': {
      pattern: /[^[\]\\|'";:/?.>,<)(_=+!@#$%^&*`~-]/,
      multiple: true,
    },
  },
  eager: true,
};

export const taxCodeMask: MaskOptions = {
  mask: '#',
  tokens: {
    '#': {
      pattern: /[0-9-]/,
      multiple: true,
    },
  },
  eager: true,
};

export const contractMask: MaskOptions = {
  mask: '@',
  tokens: {
    '@': {
      pattern: /[^[\]\\|'";:/?.>,<)(_=+!@#$%^&*`~-]/,
      multiple: true,
    },
  },
  eager: true,
};

export const identityMask: MaskOptions = {
  mask: '*',
  tokens: {
    '*': {
      pattern: /[0-9a-zA-Z]/,
      multiple: true,
      transform: (c) => c.toUpperCase(),
    },
  },
  eager: true,
};

export const phoneMask: MaskOptions = {
  mask: '### #### ###',
  eager: true,
};

export const scoreMask: MaskOptions = {
  mask: '#',
  tokens: {
    '#': {
      pattern: /[0-9.]/,
      multiple: true,
    },
  },
  eager: true,
};
