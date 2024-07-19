<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { getTableListApi } from '@/api/table'
import { TableData } from '@/api/table/types'
import { ref } from 'vue'
// import { ElTag } from 'element-plus'
// import { BaseButton } from '@/components/Button'

interface Params {
    pageIndex?: number
    pageSize?: number
}

const { t } = useI18n()

const columns: TableColumn[] = [
    {
        field: 'NO',
        label: '序号',
        type: 'index'
    },
    {
        field: 'OrderNo',
        label: '订单号'
    },
    {
        field: 'CourseName',
        label: '内容',
    },
    {
        field: 'display_time',
        label: t('tableDemo.displayTime'),
        sortable: true
    },
    {
        field: 'buyer',
        label: '购买者',
    },
    {
        field: 'pageviews',
        label: '金额',
        sortable: true
    },

]

const loading = ref(true)

let tableDataList = ref<TableData[]>([])

const getTableList = async (params?: Params) => {
    const res = await getTableListApi(
        params || {
            pageIndex: 1,
            pageSize: 10
        }
    )
        .catch(() => { })
        .finally(() => {
            loading.value = false
        })
    if (res) {
        tableDataList.value = res.data.list
    }
}

getTableList()

// const actionFn = (data: any) => {
//   console.log(data)
// }
</script>

<template>
    <ContentWrap :title="t('analysis.CoachsituationRanking')" :message="t('tableDemo.tableDes')">
        <Table :columns="columns" :data="tableDataList" :loading="loading"
            :defaultSort="{ prop: 'display_time', order: 'descending' }" />
    </ContentWrap>
</template>
