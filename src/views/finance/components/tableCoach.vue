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
import { getAccountingPageByType } from '@/api/finance'
import { useTable } from '@/hooks/web/useTable'

const { tableRegister, tableState } = useTable({
    fetchDataApi: async () => {
        const res: any = await getTableList()
        return {
            list: res,
            total: res.data.Total,
        }
    },

})
const { total, pageSize, currentPage } = tableState

const { t } = useI18n()

const columns: TableColumn[] = [
    {
        field: '排名',
        label: '排名',
        type: 'index'
    },
    {
        field: 'ID',
        label: 'id',
    },
    {
        field: 'Username',
        label: '教练'
    },
    {
        field: 'Description',
        label: '描述',
        sortable: true
    },

    {
        field: 'Amount',
        label: '总额',
        sortable: true
    },
    {
        field: 'Remark',
        label: '备注',
    },
]

const loading = ref(true)

let tableDataList = ref<TableData[]>([])

const getTableList = async () => {
    loading.value = true
    const res: any = await getAccountingPageByType(
        {
            Page: currentPage.value,
            Size: pageSize.value,
        }
    )

    if (res) {
        total.value = res.data.Total

        loading.value = false
        tableDataList.value = res.data.AccountingInfo
    }
}

getTableList()


</script>

<template>
    <ContentWrap title="教练教学情况" :message="t('tableDemo.tableDes')">
        <Table v-model:currentPage="currentPage" v-model:pageSize="pageSize" :columns="columns" :data="tableDataList"
            :loading="loading" :defaultSort="{ prop: 'display_time', order: 'descending' }" @register="tableRegister"
            :pagination="{
        total
    }" />
    </ContentWrap>
</template>
