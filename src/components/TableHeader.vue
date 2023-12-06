<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  total: {
    type: Number,
    required: false,
  },
  page: {
    type: Number,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  showDelete: {
    type: Boolean,
    default: false,
  },
  leftTitle: {
    type: String,
    required: false,
  },
  extensionHeight: {
    type: String,
    required: false,
  },
  bgColor: {
    type: String,
    required: false,
  },
  showTotal: {
    type: Boolean,
    required: false,
    default: true,
  },
  wrapperClass: {
    type: String,
    required: false,
    default: '',
  },
});

const emit = defineEmits(['changePage', 'removeItems']);
const pageInput = ref(props.page);

const updatePage = (value) => {
  emit('changePage', value);
};

const remove = () => {
  emit('removeItems');
};

const onUpdateInput = (_page: string) => {
  const parsedPage = parseInt(_page.replace(/[+-]/g, ''));
  pageInput.value = !isNaN(parsedPage) ? parsedPage : 1;
};

const filter = (evt: KeyboardEvent) => {
  if (!evt.target) return;
  const expect = (evt.target as HTMLInputElement).value.toString() + evt.key.toString();
  if (!/^[1-9]+[0-9]*$/.test(expect)) {
    evt.preventDefault();
  } else {
    return true;
  }
};

const onEnter = () => {
  if (pageInput.value !== props.page) {
    updatePage(pageInput.value);
  }
};

watch(
  () => props.page,
  (value) => {
    pageInput.value = value;
  },
);
</script>

<template>
  <div class="table-header">
    <div class="d-flex justify-space-between align-center height">
      <div>
        <slot name="prepend">
          <v-icon
            v-if="showDelete"
            class="delete-icon"
            icon="$custom.trash"
            @click="remove"
          />
          <span v-if="leftTitle" class="left-title">{{ leftTitle }}</span>
        </slot>
      </div>
      <slot name="append">
        <div v-if="showTotal" class="pagination d-flex align-center">
          <span class="ws-nowrap overflow-hidden">{{ title }}</span>
          <template v-if="total && total > 1">
            <span class="ms-3">{{ $t('app.page') }}</span>
            <v-text-field
              :model-value="page"
              variant="outlined"
              @update:model-value="(value: string) => onUpdateInput(value)"
              @keypress="(evt: KeyboardEvent) => filter(evt)"
              @keydown.enter="onEnter"
              hide-details
            />
            <span class="mr-3 ws-nowrap separate">/ {{ total }}</span>
            <v-pagination
              :model-value="page"
              total-visible="0"
              :length="total"
              @update:model-value="updatePage"
            ></v-pagination>
          </template>
        </div>
      </slot>
    </div>
    <div v-if="!!extensionHeight" class="w-100" :style="{ height: extensionHeight }">
      <slot name="extension"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-ellipsis {
  text-overflow: ellipsis;
}

.height {
  height: 40px;
}
.left-title {
  height: 60px;
  font-family: 'Be Vietnam Pro';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  margin-left: 12px;
  color: $color-text-black;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.table-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: v-bind(bgColor);

  // box-shadow: inset 0px -1px 0px rgba(0, 0, 0, 0.08);
  padding: 9px 24px;
}

:deep(.v-pagination__item) {
  display: none;
}

:deep(.v-data-table__th) {
  background-color: $color-neutral-7 !important;
}

:deep(.v-data-table-header__content),
.pagination {
  height: 40px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #1b1b33;
}

:deep(.v-pagination__list) {
  margin-bottom: 0;
}

:deep(.v-pagination__prev) {
  width: 32px;
  height: 32px;
  border: 1px solid $color-neutral-6;
  border-radius: 8px;
  background-color: $color-white;
}

:deep(.v-pagination__next) {
  width: 32px;
  height: 32px;
  border: 1px solid $color-neutral-6;
  border-radius: 8px;
  background-color: $color-white;
}

:deep(.v-btn--icon.v-btn--density-default) {
  height: 30px;
}

:deep(.v-btn__overlay) {
  transition: 0.2s ease;
}

.pagination {
  :deep(.v-text-field) {
    margin: 0 6px;
    input {
      font-size: 14px;
    }

    .v-field__input {
      text-align: center;
      height: 32px;
      min-height: 32px;
      border-radius: 8px;
      padding: 8px;
    }
  }
}
.delete-icon {
  transition: color 0.1s linear;
  &:hover {
    color: $color-text-black;
  }
}
</style>
