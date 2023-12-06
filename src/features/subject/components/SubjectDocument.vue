<script setup lang="ts">
import InputText from '@/components/base/InputText.vue';
import { useField } from 'vee-validate';
import { IDocument } from '../interfaces';
import { BaseIconButton } from '@/components';
import { computed } from 'vue';
const { value: documents } = useField<IDocument[]>('documents', undefined, {
  initialValue: [{ name: '', link: '' }],
});

const limitDocuments = 10;

const addDocument = () => {
  if (!documents.value) {
    documents.value = [];
  }
  if (documents.value.length >= limitDocuments) return;
  documents.value.push({ name: '', link: '' });
};
const removeDocument = (index: number) => {
  if (documents.value?.length <= 1) {
    documents.value = [];
    return;
  }
  documents.value.splice(index, 1);
};

const iconDocumentAction = computed(() => (index: number) => {
  if (index === 0 && documents.value.length < limitDocuments) {
    return 'mdi-plus-circle';
  }
  return 'mdi-close-circle';
});

const isFirstTestDocument = (index: number) => {
  return index === 0;
};

const onClickDocumentActionButton = (index: number) => {
  if (isFirstTestDocument(index) && documents.value.length < limitDocuments) {
    addDocument();
  } else {
    removeDocument(index);
  }
};
</script>
<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-4">
        <span class="fz-4_5 fw-600 text--black">{{
          $t('subjects.create.documentTitle')
        }}</span>
      </v-col>
    </v-row>

    <v-row v-for="(item, index) of documents" :key="index">
      <v-col cols="11">
        <v-row>
          <v-col cols="6">
            <InputText
              :name="`documents[${index}].name`"
              :label="index === 0 ? $t('subjects.create.document.name.label') : ''"
              :placeholder="$t('subjects.create.document.name.placeholder')"
              v-model="item.name"
            />
          </v-col>
          <v-col cols="6">
            <InputText
              :label="index === 0 ? $t('subjects.create.document.link.label') : ''"
              :name="`documents[${index}].link`"
              :placeholder="$t('subjects.create.document.link.placeholder')"
              v-model="item.link"
              clearable
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="1" class="text-center d-flex align-end">
        <BaseIconButton
          :icon="iconDocumentAction(index)"
          @click="onClickDocumentActionButton(index)"
          size="medium"
          :state="
            isFirstTestDocument(index) && documents.length < limitDocuments
              ? 'default'
              : 'error'
          "
          variant="secondary"
        />
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-btn) {
  &:focus {
    box-shadow: none !important;
    background-color: #fff !important;
  }
}
</style>
