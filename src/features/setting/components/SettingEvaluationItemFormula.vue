<script setup lang="ts">
import icons from '@/assets/icons';
import { BaseAutoComplete, BaseButton, InputText } from '@/components';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { TypeScore } from '../constant';
import { IEvaluationItemRecipe } from '../interfaces/setting-evaluation.interfaces';
import { settingListRecipe } from '../schema';
import { useSettingEvaluationItemStore } from '../stores/settingEvaluationItem.store';
import SettingEvaluationItemFormulaScore from './SettingEvaluationItemFormulaScore.vue';
import { useSettingEvaluationItemDialog } from '../stores/setting-evaluation-item-dialog.store';
import { isEqual, debounce } from 'lodash';
import { courseApiService } from '@/features/courses/services/courses.api';
import { ICourseExam } from '@/features/teacher/interfaces';
import * as formulajs from '@formulajs/formulajs';

const props = withDefaults(
  defineProps<{
    formulas?: {
      courseId: string;
      typeScore: TypeScore;
      recipe: string;
      criteria: [];
    }[];
  }>(),
  {},
);

const { t } = useI18n();
const store = useSettingEvaluationItemStore();
const dialogStore = useSettingEvaluationItemDialog();
const examList = ref<Record<any, ICourseExam[]>>({});
const isShowSuggestionList = ref<Record<any, boolean>>({});

const {
  values: form,
  setFieldValue,
  meta,
  validate,
  setFieldError,
} = useForm<{ formulas: IEvaluationItemRecipe[] }>({
  initialValues: {
    formulas: [
      {
        courseId: undefined,
        typeScore: undefined,
        recipe: undefined,
      },
    ],
  },
  validationSchema: settingListRecipe,
});

const cloneData = ref();

onMounted(() => {
  if (dialogStore.isUpdate) {
    const data = props?.formulas?.map((formula) => {
      return {
        courseId: formula.courseId as string,
        typeScore: formula.typeScore as TypeScore,
        recipe: formula.recipe as string,
      };
    });
    cloneData.value = data;
    setFieldValue('formulas', data as IEvaluationItemRecipe[]);
  }
  const formulaKeys = Object.keys(formulajs);
  formulaKeys.forEach((key) => {
    window[key] = formulajs[key];
  });
});

const courseOptionsFilter = computed(() => {
  return store.coursesOptions.filter(
    (courseOption) =>
      !form?.formulas?.some((formula) => formula.courseId === courseOption.value),
  );
});

const courseOptionsItem = (index: number) => {
  return store.coursesOptions?.find(
    (courseOption) => courseOption.value === form.formulas?.[index].courseId,
  );
};

const isChangeForm = computed(() => !isEqual(cloneData.value, form.formulas));

const refFormulaScore = ref<Element>();
const formulaScore = computed(() => refFormulaScore.value);

const onAddCourseDetail = () => {
  if (!form.formulas) form.formulas = [];
  const newData = form.formulas;
  newData.push({
    courseId: undefined,
    typeScore: undefined,
    recipe: undefined,
  });
  setFieldValue('formulas', newData);
};

const removeCourse = (index: number) => {
  const newData = form.formulas;
  newData.splice(index, 1);
  setFieldValue('formulas', newData);
};

const TypeScoreOptions = computed(() => {
  const options = Object.values(TypeScore).map((item) => ({
    title: t(`settings.typeScore.${item.toLowerCase()}`),
    value: item,
  }));
  return options;
});

const handleChangeCourse = async (index: number) => {
  const res = await courseApiService.getDetailExams(
    form.formulas?.[index].courseId as string,
  );
  if (res?.success) {
    Object.assign(examList.value, { [index]: res.data.exams });
    if (form.formulas?.[index]?.recipe) {
      handelCheckValidFormula(index);
    }
  }
};

const handelCheckValidFormula = (index: number) => {
  try {
    let formula = form.formulas?.[index].recipe;
    examList.value?.[index]?.map((item) => {
      if (formula?.includes(item.code)) {
        formula = formula.replace(new RegExp(item.code, 'g'), ' 10 ');
      }
    });
    const result = eval(formula as string);
    if (Number(result) || Number(result) === 0) {
      setFieldError(`formulas[${index}].recipe` as any, undefined);
    } else {
      debounce(() => {
        setFieldError(`formulas[${index}].recipe` as any, t('settings.validate.formula'));
      }, 50)();
    }
  } catch (error) {
    debounce(() => {
      setFieldError(`formulas[${index}].recipe` as any, t('settings.validate.formula'));
    }, 50)();
  }
};

const handleFocusFormula = (index: number) => {
  Object.assign(isShowSuggestionList.value, { [index]: true });
};

const handleBlurFormula = (index: number) => {
  debounce(() => {
    Object.assign(isShowSuggestionList.value, { [index]: false });
  }, 200)();
};

const isActiveSuggestion = (index: number, code: string) => {
  return form.formulas?.[index]?.recipe?.includes(code) ? 'active' : '';
};

const handleClickSuggestion = (index: number, code: string) => {
  const newData = form.formulas?.[index]?.recipe
    ? form.formulas?.[index]?.recipe + `${code}`
    : `${code}`;
  setFieldValue(`formulas.${index}.recipe`, newData);
  handelCheckValidFormula(index);
};

const isShowDelete = computed(() => form.formulas.length > 1);

defineExpose({
  form,
  meta,
  validate,
  setFieldValue,
  setFieldError,
  isChangeForm,
  formulaScore,
});
</script>
<template>
  <div
    v-for="(_, index) in form.formulas"
    :key="index"
    class="bg-color-1 px-5 py-6 rounded--1_5 mt-6"
  >
    <v-row class="align-center" :id="`formulas.${index}`">
      <div class="recipe-delete" v-if="isShowDelete">
        <div class="delete-icon">
          <v-img
            class="cursor-pointer"
            width="20"
            :src="icons.deleteRed"
            @click="() => removeCourse(index)"
          />
        </div>
      </div>
      <v-col cols="12">
        <v-row>
          <v-col cols="6" class="align-start">
            <BaseAutoComplete
              :label="$t('settings.evaluationItem.form.course.label')"
              :placeholder="$t('settings.evaluationItem.form.course.placeholder')"
              :name="`formulas[${index}].courseId`"
              :items="
                [...courseOptionsFilter, courseOptionsItem(index)].filter(
                  (item) => item !== undefined,
                ) || []
              "
              :is-required="true"
              @change="handleChangeCourse(index)"
            />
          </v-col>
          <v-col cols="6" class="align-start">
            <BaseAutoComplete
              :name="`formulas[${index}].typeScore`"
              :label="$t('settings.evaluationItem.form.typeScore.label')"
              :placeholder="$t('settings.evaluationItem.form.typeScore.placeholder')"
              :items="TypeScoreOptions"
              :is-required="true"
            />
          </v-col>
          <v-col :cols="12" v-if="_.typeScore === TypeScore.TEXT">
            <SettingEvaluationItemFormulaScore
              ref="refFormulaScore"
              :index="index"
              :scores="$props.formulas?.[index]?.criteria as any[]"
            />
          </v-col>
          <v-col cols="12" class="align-start">
            <InputText
              :name="`formulas[${index}].recipe`"
              :label="$t('settings.evaluationItem.form.recipe.label')"
              :placeholder="$t('settings.evaluationItem.form.recipe.placeholder')"
              :is-required="true"
              @change="handelCheckValidFormula(index)"
              @blur="handleBlurFormula(index)"
              @focus="handleFocusFormula(index)"
            />
            <div
              class="suggestion"
              v-show="isShowSuggestionList?.[index] && examList?.[index]?.length"
            >
              <v-list>
                <v-list-item
                  v-for="(item, _index) in examList[index]"
                  :key="_index"
                  :class="isActiveSuggestion(index, item.code)"
                  @click="() => handleClickSuggestion(index, item.code)"
                >
                  <v-list-item-title>{{ item.code }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
  <v-row>
    <v-col cols="12" class="d-flex justify-center mt-3">
      <BaseButton
        :label="$t('settings.evaluationItem.createRecipe')"
        variant="text"
        left-icon="mdi-plus"
        size="extra-small"
        @click="onAddCourseDetail"
      />
    </v-col>
  </v-row>
</template>

<style scoped lang="scss">
:deep(.v-btn) {
  border: none !important;
}
.recipe-delete {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: right;
  .delete-icon {
    width: 24px !important;
    margin-right: 12px;
  }
}

.suggestion {
  .active {
    color: $color-primary-1 !important;
  }
}
</style>
