<script lang="ts" setup>
import {
  scrollToIdElement,
  showErrorNotification,
  showSuccessNotification,
} from '@/common/helpers';
import { IResponseError } from '@/common/interfaces';
import { BaseDialog, InputText, InputTextarea, SingleSelect } from '@/components';
import { useField, useForm } from 'vee-validate';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { CriteriaType, StatusEvaluationCriteriaType, TypeScore } from '../constant';
import { settingEvaluationCriteriaFormSchema } from '../schema';
import { settingEvaluationApiService } from '../services/settingEvaluation.api';
import { useSettingEvaluationItemDialog } from '../stores/setting-evaluation-item-dialog.store';
import { useSettingEvaluationItemStore } from '../stores/settingEvaluationItem.store';
import SettingEvaluationItemFormula from './SettingEvaluationItemFormula.vue';
import SettingEvaluationItemList from './SettingEvaluationItemList.vue';
import { ErrorCode } from '@/common/constants';
import { isEqual } from 'lodash';

const { t } = useI18n();
const dialogStore = useSettingEvaluationItemDialog();
const store = useSettingEvaluationItemStore();

const { value: status, setValue: setStatus } = useField<boolean>('status');
const refEvaluationContents = ref<Element>();
const refEvaluationFormulas = ref<Element>();
const propsList = ref<{
  isForAllCourse?: boolean;
  contents?: string[];
  listContents?: { courseId?: string; contents?: string[] }[];
}>({});
const cloneData = ref();
const listUpdate = ref();
const formulaUpdate = ref();

const propsFormula = ref<{
  formula?: any[];
}>({ formula: [] });

const { meta, values, handleSubmit, resetForm, setFieldValue, validate, setFieldError } =
  useForm({
    validationSchema: settingEvaluationCriteriaFormSchema,
  });

onMounted(async () => {
  if (dialogStore.isUpdate) {
    const res = await dialogStore.getDetail();
    if (res?.success) {
      setFieldValue('name', res.data.name);
      setFieldValue('description', res.data.description);
      setStatus(
        res.data.status === StatusEvaluationCriteriaType.FOLLOWING ? true : false,
      );
      setFieldValue('type', res.data.type);
      cloneData.value = {
        name: res.data.name,
        type: res.data.type,
        description: res.data.description,
        status: res.data.status === StatusEvaluationCriteriaType.FOLLOWING ? true : false,
      };
      if (res.data.type === CriteriaType.LIST) {
        listUpdate.value = res.data.evaluationCriteriaSettingDetailListType;
        if (listUpdate.value?.[0]?.isForAllCourse) {
          propsList.value.isForAllCourse = true;
          propsList.value.contents = listUpdate.value?.[0]?.contents;
          propsList.value.listContents = [];
        } else {
          propsList.value.isForAllCourse = false;
          propsList.value.contents = [];
          propsList.value.listContents = listUpdate.value?.map((item) => {
            return {
              courseId: item.courseId,
              contents: item.contents,
            };
          });
        }
      }
      if (res.data.type === CriteriaType.FORMULA) {
        formulaUpdate.value = res.data.evaluationCriteriaSettingDetailFormulaType;
        propsFormula.value.formula = (formulaUpdate.value as [])?.map((formula: any) => {
          const data = {
            courseId: formula?.courseId as string,
            typeScore: formula?.type as TypeScore,
            recipe: formula?.formula as string,
            criteria: formula.criteria as [],
          };
          return data;
        });
      }
      validate();
    }
  }
});

const typeOptions = computed(() => {
  return [
    {
      value: CriteriaType.FORMULA,
      title: t('settings.evaluationItem.form.typeOptions.recipe'),
    },
    {
      value: CriteriaType.LIST,
      title: t('settings.evaluationItem.form.typeOptions.list'),
    },
  ];
});

// Validation

const validEvaluationContents = computed(() => {
  return values.type === CriteriaType.LIST
    ? (refEvaluationContents.value as any)?.meta?.valid
    : true;
});

const validEvaluationRecipes = computed(() => {
  return values.type === CriteriaType.FORMULA
    ? (refEvaluationFormulas.value as any)?.meta?.valid &&
        validEvaluationRecipeScores.value
    : true;
});

const validEvaluationRecipeScores = computed(() => {
  if (!(refEvaluationFormulas.value as any)?.formulaScore) return true;
  return ((refEvaluationFormulas.value as any)?.formulaScore as [])?.every(
    (item: any) => item?.meta?.valid === true,
  );
});

const isChangeContents = computed(
  () => (refEvaluationContents.value as any)?.isChangeForm,
);

const isChangeFormulas = computed(
  () => (refEvaluationFormulas.value as any)?.isChangeForm,
);

const isChangeScores = computed(() => {
  if (!(refEvaluationFormulas.value as any)?.formulaScore) return false;
  return ((refEvaluationFormulas.value as any)?.formulaScore as [])?.some(
    (item: any) => item?.isChangeForm,
  );
});

const isChangeForm = computed(() => {
  return !isEqual(cloneData.value, {
    ...values,
    description: values.description === '' ? undefined : values.description,
    status: status.value,
  });
});

const checkValidateForm = async () => {
  const [resRecipesValidate, resContentsValidate] = await Promise.all([
    (refEvaluationFormulas.value as any)?.validate(),
    (refEvaluationContents.value as any)?.validate(),
  ]);

  let validRecipeScores;
  if (values.type === CriteriaType.FORMULA) {
    if ((refEvaluationFormulas.value as any)?.formulaScore) {
      const resRecipeScores = await Promise.all([
        ...((refEvaluationFormulas.value as any).formulaScore as any[]).map(
          (item: any) => {
            return item?.validate();
          },
        ),
      ]);
      validRecipeScores = resRecipeScores?.every((item: any) => item?.valid === true);
    } else {
      validRecipeScores = true;
    }
  }
  return values.type === CriteriaType.FORMULA
    ? resRecipesValidate?.valid && validRecipeScores
    : values.type === CriteriaType.LIST
    ? resContentsValidate?.valid
    : true;
};

//

const handleApiEvaluationItem = handleSubmit(async () => {
  const isValidForm = await checkValidateForm();
  if (!isValidForm) return;

  const formData = {
    ...values,
    status: status.value
      ? StatusEvaluationCriteriaType.FOLLOWING
      : StatusEvaluationCriteriaType.UN_FOLLOWING,
  };

  if (values.type === CriteriaType.FORMULA) {
    const formulaDetails = (refEvaluationFormulas.value as any)?.form?.formulas?.map(
      (recipe: any) => {
        return {
          courseId: recipe.courseId,
          type: recipe.typeScore,
          formula: recipe.recipe,
          id: (
            (formulaUpdate.value as [])?.find(
              (e: any) => e.courseId === recipe.courseId,
            ) as any
          )?._id,
        };
      },
    );

    (refEvaluationFormulas.value as any)?.formulaScore?.map((item: any) => {
      formulaDetails[item?.form.index].criteria = item?.form?.scores?.map(
        (score: any) => {
          return {
            name: score.name,
            maxScores: Number(score.to),
          };
        },
      );
    });
    Object.assign(formData, {
      formulaDetails,
    });
  }

  if (values.type === CriteriaType.LIST) {
    const data = {
      listDetail: (refEvaluationContents.value as any)?.form?.isForAllCourse
        ? {
            isForAllCourse: (refEvaluationContents.value as any)?.form?.isForAllCourse,
            contents: (refEvaluationContents.value as any)?.form?.contents?.filter(
              (item) => item !== '',
            ),
            id: listUpdate.value?.[0]._id,
          }
        : {
            isForAllCourse: (refEvaluationContents.value as any)?.form?.isForAllCourse,
            courseAndContents: (
              refEvaluationContents.value as any
            )?.form?.listContents?.map((item) => {
              return {
                ...item,
                contents: item?.contents?.filter((i) => i !== ''),
                id: (
                  (listUpdate.value as [])?.find(
                    (e: any) => e.courseId === item.courseId,
                  ) as any
                )?._id,
              };
            }),
          },
    };
    Object.assign(formData, data);
  }
  if (dialogStore.isUpdate) {
    const res = await settingEvaluationApiService.updateEvaluation(
      dialogStore.currentId,
      formData,
    );
    if (res?.success) {
      dialogStore.close();
      await store.getList();
      showSuccessNotification(t('settings.success.evaluationItemUpdate'));
    } else if (res.errors?.length) {
      handleCreateErrors(res.errors[0]);
    } else {
      showErrorNotification(t('settings.success.evaluationItemUpdate'));
    }
  } else {
    const res = await settingEvaluationApiService.createEvaluation(formData);
    if (res?.success) {
      dialogStore.close();
      store.getList();
      showSuccessNotification(t('settings.success.evaluationItemCreate'));
    } else if (res.errors?.length) {
      handleCreateErrors(res.errors[0]);
    } else {
      showErrorNotification(t('settings.success.evaluationItemCreate'));
    }
  }
});

const handleCreateErrors = (error: IResponseError) => {
  const errorCode = error.errorCode;
  const errorKey = error.key;
  const i18nKey = `settings.error.${
    dialogStore.isUpdate ? `updateEvaluationItem` : `createEvaluationItem`
  }.${errorCode}.${errorKey}`;
  switch (errorCode) {
    case ErrorCode.VALIDATE:
      if (errorKey?.includes(`formulaDetails`) && !errorKey?.includes(`criteria`)) {
        const array = errorKey.split('.');
        if (array?.[1]) {
          scrollToIdElement(`formulas.${array[1]}`);
        }
        (refEvaluationFormulas.value as any)?.setFieldError(
          `formulas[${array[1]}].courseId`,
          t(
            `settings.error.${
              dialogStore.isUpdate ? `updateEvaluationItem` : `createEvaluationItem`
            }.${errorCode}.course`,
          ),
        );
      } else if (errorKey?.includes(`formulaDetails`) && errorKey?.includes(`criteria`)) {
        const array = errorKey.split('.');
        if (array?.[1]) {
          scrollToIdElement(`formulas.${array[1]}`);
        }
        (refEvaluationFormulas.value as any)?.formulaScore?.[0]?.setFieldError(
          `scores[${array[3]}].name`,
          t(
            `settings.error.${
              dialogStore.isUpdate ? `updateEvaluationItem` : `createEvaluationItem`
            }.${errorCode}.formulaNameScore`,
          ),
        );
      } else if (
        errorKey?.includes(`listDetail`) &&
        errorKey?.includes(`courseAndContents`) &&
        !errorKey?.includes(`contents`)
      ) {
        const array = errorKey.split('.');
        if (array?.[2]) {
          scrollToIdElement(`listContents.${array[2]}`);
        }
        (refEvaluationContents.value as any)?.setFieldError(
          `listContents[${array[2]}].courseId`,
          t(
            `settings.error.${
              dialogStore.isUpdate ? `updateEvaluationItem` : `createEvaluationItem`
            }.${errorCode}.course`,
          ),
        );
      } else {
        showErrorNotification(
          t(
            `settings.error.${
              dialogStore.isUpdate ? `evaluationItemUpdate` : `evaluationItemCreate`
            }`,
          ),
        );
      }
      break;
    case ErrorCode.ITEM_ALREADY_EXIST:
      if (errorKey === 'name') {
        scrollToIdElement(`criterialName`);
        setFieldError('name', t(i18nKey));
      } else {
        showErrorNotification(
          t(
            `settings.error.${
              dialogStore.isUpdate ? `evaluationItemUpdate` : `evaluationItemCreate`
            }`,
          ),
        );
      }
      break;
    default:
      showErrorNotification(
        t(
          `settings.error.${
            dialogStore.isUpdate ? `evaluationItemUpdate` : `evaluationItemCreate`
          }`,
        ),
      );
      break;
  }
};

onBeforeUnmount(() => {
  resetForm();
});
</script>
<template>
  <BaseDialog
    @close="dialogStore.close"
    :loading="dialogStore.isSubmitting"
    :disabled="
      !meta.valid ||
      !validEvaluationContents ||
      !validEvaluationRecipes ||
      (dialogStore.isUpdate
        ? !(isChangeForm || isChangeContents || isChangeFormulas || isChangeScores)
        : false)
    "
    :title="t(`settings.evaluationItem.${dialogStore.isUpdate ? 'update' : 'create'}`)"
    @submit="handleApiEvaluationItem"
    :max-width="1000"
  >
    <v-row>
      <v-col cols="6" id="criterialName">
        <InputText
          name="name"
          :label="$t('settings.evaluationItem.form.name.label')"
          :placeholder="$t('settings.evaluationItem.form.name.placeholder')"
          is-required
        />
      </v-col>
      <v-col cols="6" class="d-flex align-center">
        <div class="checkbox">
          <v-checkbox v-model="status" class="checkbox-item" />
          <span class="checkbox-text">{{
            $t('settings.evaluationItem.form.status.label')
          }}</span>
        </div>
      </v-col>
      <v-col cols="12">
        <InputTextarea
          name="description"
          :label="$t('settings.evaluationItem.form.description.label')"
          :placeholder="$t('settings.evaluationItem.form.description.placeholder')"
          :rows="3"
        />
      </v-col>
      <v-col cols="12">
        <SingleSelect
          name="type"
          :label="$t('settings.evaluationItem.form.type.label')"
          :items="typeOptions"
          :placeholder="$t('settings.evaluationItem.form.type.placeholder')"
          :clearable="true"
          :is-required="true"
          :disabled="dialogStore.isUpdate"
        />
      </v-col>
    </v-row>
    <SettingEvaluationItemList
      v-if="values.type === CriteriaType.LIST"
      ref="refEvaluationContents"
      :is-for-all-course="propsList.isForAllCourse as boolean"
      :contents="propsList.contents as string[]"
      :list-contents="propsList.listContents as []"
    />
    <SettingEvaluationItemFormula
      v-if="values.type === CriteriaType.FORMULA"
      ref="refEvaluationFormulas"
      :formulas="propsFormula.formula"
    />
  </BaseDialog>
</template>

<style lang="scss" scoped>
.checkbox {
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  :deep(.v-input) {
    flex: 0;
  }
  .checkbox-item {
    height: 40px;
    display: flex;
    align-items: center;
    margin-right: 12px;
  }
  .checkbox-text {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
