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
import { ref, h } from 'vue'
import { ElTag } from 'element-plus'
// import { BaseButton } from '@/components/Button'
import { getAccountingPageByType, addAccounting } from '@/api/finance'
import { useTable } from '@/hooks/web/useTable'
import AddDialog from './addDialog.vue'
import { useUserStore } from '@/store/modules/user'
import { FINANCE_TYPE_DICT, getTagType } from '../utils/dict'
import { convertDateTime } from '../utils/convertDateTime'

// 创建备注映射，同时支持大写和小写键
const remarkMap: Record<string, string> = {}
Object.entries(FINANCE_TYPE_DICT).forEach(([key, value]) => {
  remarkMap[key] = value
  remarkMap[key.toUpperCase()] = value
})

const { tableRegister, tableState } = useTable({
  fetchDataApi: async () => {
    const res: any = await getTableList()
    return {
      list: res,
      total: res.data.Total
    }
  }
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
    label: 'id'
  },
  {
    field: 'Username',
    label: '使用者'
  },
  {
    field: 'Description',
    label: '描述'
  },
  {
    field: 'Date',
    label: '时间',
    formatter: (row: any) => convertDateTime(row.Date)
  },
  {
    field: 'Amount',
    label: '总额',
    sortable: true
  },
  {
    field: 'Remark',
    label: '备注',
    formatter: (row: any) => {
      const remarkText = remarkMap[row.Remark] || row.Remark
      return h(ElTag, { type: getTagType(row.Remark) }, () => remarkText)
    }
  }
]
const loading = ref(true)

const userStore = useUserStore()

let tableDataList = ref<TableData[]>([])

const getTableList = async () => {
  loading.value = true
  const res: any = await getAccountingPageByType({
    Type: 'EXPENSE',
    Page: currentPage.value,
    Size: pageSize.value
  })
  if (res) {
    total.value = res.data.Total
    loading.value = false
    tableDataList.value = res.data.AccountingInfo
  }
}

getTableList()

const showDialog = ref(false)

const handleSave = async (formData: any) => {
  formData.Amount = Number(formData.Amount)
  formData.UserID = userStore.getUserInfo?.ID
  const res: any = await addAccounting(formData)
  if (res) {
    getTableList()
  }
  showDialog.value = false
}

const handleCancel = () => {
  console.log('取消操作')
  showDialog.value = false
}

const handleShowDialog = () => {
  console.log('Show dialog')
  showDialog.value = true
}
</script>

<template>
  <ContentWrap title="支出表" :message="t('tableDemo.tableDes')">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="handleShowDialog">添加</el-button>
    </div>
    <Table
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :columns="columns"
      :data="tableDataList"
      :loading="loading"
      :defaultSort="{ prop: 'display_time', order: 'descending' }"
      @register="tableRegister"
      :pagination="{
        total
      }"
    />
    <AddDialog title="录入支出" :visible="showDialog" @save="handleSave" @cancel="handleCancel" />
  </ContentWrap>
</template>
