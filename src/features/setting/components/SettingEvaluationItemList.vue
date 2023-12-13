<script setup lang="ts">
import icons from '@/assets/icons';
import { BaseAutoComplete, BaseButton, BaseIconButton, InputText } from '@/components';
import { useForm } from 'vee-validate';
import { computed, onBeforeUnmount, ref } from 'vue';
import { IEvaluationItemContent } from '../interfaces';
import { settingListContent } from '../schema';
import { useSettingEvaluationItemStore } from '../stores/settingEvaluationItem.store';
import { onMounted } from 'vue';
import { useSettingEvaluationItemDialog } from '../stores/setting-evaluation-item-dialog.store';
import { isEqual } from 'lodash';

const props = withDefaults(
  defineProps<{
    isForAllCourse?: boolean;
    contents?: string[];
    listContents?: [];
  }>(),
  {},
);

const store = useSettingEvaluationItemStore();
const dialogStore = useSettingEvaluationItemDialog();
const {
  values: form,
  setFieldValue,
  meta,
  validate,
  resetForm,
  setFieldError,
} = useForm<IEvaluationItemContent>({
  initialValues: {
    isForAllCourse: true,
    contents: [''],
    listContents: [],
  },
  validationSchema: settingListContent,
});

const isApplyAll = ref<boolean>(true);
const limit = 10;
const cloneData = ref();

const handleChangeApplyAll = () => {
  setFieldValue('isForAllCourse', isApplyAll.value);
  if (!isApplyAll.value) {
    onAddListContentDetail();
  }
  if (isApplyAll.value) {
    onAddEvaluationItemList();
    setFieldValue('listContents', undefined as any);
  }
};

// Options

const courseOptionsFilter = computed(() => {
  return store.coursesOptions.filter(
    (courseOption) =>
      !form?.listContents?.some((content) => content.courseId === courseOption.value),
  );
});

const courseOptionsItem = (index: number) => {
  return store.coursesOptions?.find(
    (courseOption) => courseOption.value === form.listContents?.[index].courseId,
  );
};

// parents
const onDeleteEvaluationItemList = (index: number) => {
  form.contents.splice(index, 1);
};

const onAddEvaluationItemList = () => {
  if (!form.contents) form.contents = [];
  if (form.contents.length >= limit) return;
  const newData = form.contents;
  newData.push('');
  setFieldValue('contents', newData);
};

const isShowDeleteContentsDetail = computed(() => form.listContents.length > 1);

// children

const onAddListContentDetail = () => {
  if (!form.listContents) form.listContents = [];
  if (form.listContents.length >= limit) return;
  const newData = form.listContents;
  newData.push({
    courseId: undefined,
    contents: [''],
  });
  setFieldValue('listContents', newData);
};

const removeListContentDetail = (index: number) => {
  const newData = form.listContents;
  newData.splice(index, 1);
  setFieldValue('listContents', newData);
};

// children contents

const onAddListContentDetailChildren = (index: number, _index: number) => {
  if (!form.listContents[index].contents) form.listContents[index].contents = [];
  if (form.listContents[index].contents.length >= limit) return;
  const newData = form.listContents[index].contents;
  newData.push('');
  setFieldValue(`listContents.${index}.contents`, newData);
};

const removeListContentDetailChildren = (index: number, _index: number) => {
  const newData = form.listContents[index].contents;
  newData.splice(_index, 1);
  setFieldValue(`listContents.${index}.contents`, newData);
};

//

onMounted(() => {
  if (dialogStore.isUpdate) {
    isApplyAll.value = props.isForAllCourse;
    setFieldValue('isForAllCourse', props.isForAllCourse);
    if (props.contents?.length) {
      setFieldValue('contents', props.contents as string[]);
    }
    if (props.listContents?.length) {
      setFieldValue('listContents', props.listContents as []);
    }
    const data = {
      isForAllCourse: props.isForAllCourse,
      listContents: props.listContents as [],
    };
    if (props.isForAllCourse) {
      Object.assign(data, {
        contents: props.contents as string[],
      });
    }
    cloneData.value = data;
  }
});

const isChangeForm = computed(() => {
  return !isEqual(cloneData.value, form);
});

defineExpose({ form, meta, validate, setFieldError, isChangeForm });

onBeforeUnmount(() => {
  resetForm();
});
</script>
<template>
  <v-row>
    <v-col cols="6" class="d-flex align-center">
      <div class="checkbox">
        <v-checkbox
          v-model="isApplyAll"
          class="checkbox-item"
          @update:model-value="handleChangeApplyAll"
        />
        <span class="checkbox-text">{{
          $t('settings.evaluationItem.form.isApplyAllCourse.label')
        }}</span>
      </div>
    </v-col>
  </v-row>

  <div class="wrapper" v-if="isApplyAll">
    <v-row>
      <v-col
        cols="12"
        class="d-flex align-start gap-4"
        v-for="(_, index) in form.contents"
        :key="index"
      >
        <InputText
          :name="`contents[${index}]`"
          :label="index === 0 ? $t('settings.evaluationItem.titleList') : undefined"
          :placeholder="$t('settings.evaluationItem.form.content.placeholder')"
        />
        <BaseIconButton
          v-if="index !== 0"
          :icon="'mdi-close-circle'"
          size="medium"
          :state="'error'"
          variant="secondary"
          @click="onDeleteEvaluationItemList(index)"
        />
        <div class="btn-fake" v-if="index === 0"></div>
      </v-col>
      <BaseButton
        :label="$t('settings.evaluationItem.createContent')"
        left-icon="mdi-plus"
        variant="text"
        size="small"
        @click="onAddEvaluationItemList()"
      />
    </v-row>
  </div>

  <v-row class="pa-3 mt-0" v-if="!isApplyAll">
    <v-col
      cols="12"
      class="bg-color-1 px-5 py-6 rounded--1_5 mt-4"
      v-for="(listContent, index) in form.listContents"
      :key="index"
    >
      <v-row :id="`listContents.${index}`">
        <div class="recipe-delete" v-if="isShowDeleteContentsDetail">
          <div class="delete-icon">
            <v-img
              class="cursor-pointer"
              width="20"
              :src="icons.deleteRed"
              @click="() => removeListContentDetail(index)"
            />
          </div>
        </div>
        <v-col cols="6" class="align-start">
          <BaseAutoComplete
            :label="$t('settings.evaluationItem.form.course.label')"
            :placeholder="$t('settings.evaluationItem.form.course.placeholder')"
            :name="`listContents[${index}].courseId`"
            :items="
              [...courseOptionsFilter, courseOptionsItem(index)].filter(
                (item) => item !== undefined,
              ) || []
            "
            :is-required="true"
          />
        </v-col>
        <v-col :cols="12">
          <div class="wrapper">
            <v-col
              cols="12"
              class="d-flex align-end gap-4"
              v-for="(_, _index) in listContent.contents"
              :key="_index"
            >
              <InputText
                :name="`listContents[${index}].contents[${_index}]`"
                :label="
                  _index === 0 ? $t('settings.evaluationItem.titleList') : undefined
                "
                :placeholder="$t('settings.evaluationItem.form.content.placeholder')"
              />
              <BaseIconButton
                v-if="Number(_index) !== 0"
                :icon="'mdi-close-circle'"
                size="medium"
                :state="'error'"
                variant="secondary"
                @click="removeListContentDetailChildren(index, Number(_index))"
              />
              <div class="btn-fake" v-if="Number(_index) === 0"></div>
            </v-col>
            <BaseButton
              :label="$t('settings.evaluationItem.createContent')"
              left-icon="mdi-plus"
              variant="text"
              size="small"
              @click="onAddListContentDetailChildren(index, index as number)"
            />
          </div>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-row v-if="!isApplyAll">
    <v-col cols="12" class="d-flex justify-center">
      <BaseButton
        :label="$t('settings.evaluationItem.createRecipe')"
        variant="text"
        left-icon="mdi-plus"
        size="extra-small"
        @click="onAddListContentDetail"
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

.wrapper {
  margin-top: 10px;
  padding-left: 20px;
  border-left: 1px solid $color-border-focus-secondary;
}

.btn-fake {
  width: 52px;
  height: 48px;
}

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

:deep(.status-container) {
  position: relative;
}

:deep(.error-message) {
  position: absolute;
  top: 0;
}
</style>
