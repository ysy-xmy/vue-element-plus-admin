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
import { convertDateTime } from '../utils/convertDateTime'

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
        field: 'NO',
        label: '序号',
        type: 'index'
    },
    {
        field: 'ID',
        label: 'id'
    },
    {
        field: 'Username',
        label: '购买者',
    },

    {
        field: 'Description',
        label: '描述',
    },
    {
        field: 'Amount',
        label: '金额',
        sortable: true
    },
    {
        field: 'Date',
        label: '日期',
        sortable: true

    }

]
const loading = ref(true)

let tableDataList = ref<TableData[]>([])

const getTableList = async () => {
    loading.value = true
    const res: any = await getAccountingPageByType(
        {
            Type: 'INCOME',
            Remark: 'COURSE_INCOME',
            Page: currentPage.value,
            Size: pageSize.value,
        }
    )
    if (res) {
        total.value = res.data.Total
        loading.value = false
        tableDataList.value = res.data.AccountingInfo.map((item: any) => {
            return {
                ID: item.ID,
                Username: item.Username,
                Description: item.Description,
                Amount: Number(item.Amount),
                Date: convertDateTime(item.Date),
            }
        })
    }
}

getTableList()


</script>

<template>
    <ContentWrap title="课程销量" :message="t('tableDemo.tableDes')">
        <Table v-model:currentPage="currentPage" v-model:pageSize="pageSize" :columns="columns" :data="tableDataList"
            :loading="loading" :defaultSort="{ prop: 'display_time', order: 'descending' }" @register="tableRegister"
            :pagination="{
        total
    }" />
    </ContentWrap>
</template>
