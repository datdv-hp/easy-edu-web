import { FORM_VALIDATION, Regex } from '@/common/constants';
import yup from '@/plugins/yup';

export const CreateSubjectFormSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required()
    .label('subject.name')
    .max(FORM_VALIDATION.textMaxLength),
  description: yup
    .string()
    .optional()
    .max(FORM_VALIDATION.textAreaMaxLength)
    .label('subject.description'),
  subjectCode: yup
    .string()
    .trim()
    .required()
    .matches(FORM_VALIDATION.codeRegExp, {
      message: 'subjects.validate.regexSubjectCode',
    })
    .max(FORM_VALIDATION.codeMaxLength)
    .label('subject.subjectCode'),
  documents: yup
    .array()
    .of(
      yup.object({
        name: yup.string().max(FORM_VALIDATION.textMaxLength),
        link: yup
          .string()
          .matches(Regex.URL)
          .transform((value) => {
            if (!value) return undefined;
            return value;
          })
          .max(FORM_VALIDATION.textMaxLength)
          .label('link'),
      }),
    )
    .optional()
    .label('subject.documents'),
});
