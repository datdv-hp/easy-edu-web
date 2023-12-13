<script lang="ts" setup>
import { EllipsisTableData, TableBase, TableHeader } from '@/components';
import { calculateTableIndex } from '@/features/classroom/helpers';
import { usePromotionProgrammeDetail } from '@/features/setting/stores/promotion-programme-detail';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const detail = usePromotionProgrammeDetail();
const route = useRoute();
function updatePage(value: number) {
    detail.setPage(value);
    detail.getStudentList(route.params.id as string);
}

onMounted(() => {
    detail.getStudentList(route.params.id as string);
});
</script>
<template>
    <v-card class="mx-4 mt-4">
        <v-card-text>
            <div class="profile-title mt-0 mb-4">
                {{ $t('promotionProgramme.studentList.title') }}
            </div>
            <TableHeader
                :total="detail.totalPages"
                @change-page="updatePage"
                :page="detail.listQuery.page || 1"
                :title="
                    $t('promotionProgramme.studentList.total', { total: detail.total })
                "
            />
            <TableBase
                :is-empty="!detail.total && !detail.isFetching"
                :loading="detail.isFetching"
            >
                <template #thead>
                    <tr>
                        <th class="text-left ws-nowrap minW-100px w-10">
                            {{ $t('promotionProgramme.studentList.table.index') }}
                        </th>
                        <th class="text-left ws-nowrap minW-300px w-45">
                            {{ $t('promotionProgramme.studentList.table.name') }}
                        </th>
                        <th class="text-left ws-nowrap minW-300px w-45">
                            {{ $t('promotionProgramme.studentList.table.course') }}
                        </th>
                    </tr>
                </template>
                <template #tbody>
                    <tr v-for="(item, index) in detail.list" :key="index">
                        <td class="ws-nowrap">
                            {{
                                calculateTableIndex(
                                    index,
                                    detail.listQuery?.page,
                                    detail.listQuery?.limit,
                                )
                            }}
                        </td>

                        <EllipsisTableData :text="item.student" />
                        <EllipsisTableData :text="item.course" />
                    </tr>
                </template>
            </TableBase>
        </v-card-text>
    </v-card>
</template>
<style lang="scss" scoped>
:deep(.v-table__wrapper) {
    height: unset;
    min-height: calc((100vh - $offset-table-height-without-tab) / 2);
    max-height: calc(100vh - $offset-table-height-without-tab);
}
</style>
