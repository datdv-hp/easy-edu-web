<script lang="ts" setup>
import InputText from '@/components/base/InputText.vue';
import { useField, useForm } from 'vee-validate';
const emit = defineEmits<{
  (event: 'getInputText', value: string): void;
}>();
const props = defineProps({
  placeholder: {
    type: String,
  },
  buttonTitle: {
    type: String,
    required: true,
  },
});
useForm({
  initialValues: {
    input: '',
  },
});
const { value: inputValue } = useField<string>('input');
const handleClickSearch = () => {
  emit('getInputText', inputValue.value);
};
</script>
<template>
  <div class="search-wrapper">
    <InputText
      name="input"
      :placeholder="props.placeholder"
      class="search-input"
      @keydown.enter="handleClickSearch"
    />
    <v-btn
      @click="handleClickSearch"
      color="primary"
      class="search-btn"
      prepend-icon="mdi-magnify "
      >{{ props.buttonTitle }}</v-btn
    >
  </div>
</template>
<style lang="scss" scoped>
.search-wrapper {
  display: flex;
  align-items: center;
  padding: 22px 0;
  background-color: $color-white;
  .search-input {
    flex: 1;
    :deep(.v-field__field) {
      align-items: center;
      height: 50px;
    }
  }
  .search-btn {
    height: 50px;
    width: 160px;
    margin: 0 16px;
  }
}
</style>
