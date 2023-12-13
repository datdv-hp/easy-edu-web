<script lang="ts" setup>
import HeaderBar from '@/layouts/components/header/HeaderBar.vue';
import { onMounted } from 'vue';
import { useRegistrationStore } from '../../stores';
import RegistrationList from './component/RegistrationList.vue';
import SearchBar from './component/SearchBar.vue';
import DialogStudent from '@/features/student/components/DialogStudent.vue';
import { useStudentDialog } from '@/features/student/stores';

const store = useRegistrationStore();
const studentDialog = useStudentDialog();
onMounted(() => {
  store.getList();
});
</script>
<template>
  <HeaderBar :title="$t('registration.list')"> </HeaderBar>
  <SearchBar />
  <RegistrationList />
  <DialogStudent v-if="studentDialog.isOpen" />
</template>

<style lang="scss" scoped></style>
