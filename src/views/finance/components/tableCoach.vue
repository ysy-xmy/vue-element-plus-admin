<script setup lang="tsx">
//@ts-ignore

import { ContentWrap } from '@/components/ContentWrap'
//@ts-ignore
import { useI18n } from '@/hooks/web/useI18n'
//@ts-ignore
import { Table, TableColumn } from '@/components/Table'
//@ts-ignore
import { getTableListApi } from '@/api/table'
//@ts-ignore
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
        field: '排名',
        label: '排名',
        type: 'index'
    },
    {
        field: '教练',
        label: '教练'
    },
    {
        field: '授课总节数',
        label: '授课总节数',
        sortable: true
    },
    // {
    //   field: 'display_time',
    //   label: t('tableDemo.displayTime'),
    //   sortable: true
    // },
    // {
    //   field: 'importance',
    //   label: t('tableDemo.importance'),
    //   formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
    //     return h(
    //       ElTag,
    //       {
    //         type: cellValue === 1 ? 'success' : cellValue === 2 ? 'warning' : 'danger'
    //       },
    //       () =>
    //         cellValue === 1
    //           ? t('tableDemo.important')
    //           : cellValue === 2
    //             ? t('tableDemo.good')
    //             : t('tableDemo.commonly')
    //     )
    //   }
    // },
    {
        field: 'pageviews',
        label: '应结课程费',
        sortable: true
    }
    // {
    //   field: 'action',
    //   label: t('tableDemo.action'),
    //   slots: {
    //     default: (data) => {
    //       return (
    //         <BaseButton type="primary" onClick={() => actionFn(data)}>
    //           {t('tableDemo.action')}
    //         </BaseButton>
    //       )
    //     }
    //   }
    // }
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
    <ContentWrap title="教练教学情况" :message="t('tableDemo.tableDes')">
        <Table :columns="columns" :data="tableDataList" :loading="loading"
            :defaultSort="{ prop: 'display_time', order: 'descending' }" />
    </ContentWrap>
</template>
