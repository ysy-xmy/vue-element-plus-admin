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
import { ref, h, computed } from 'vue'
import { ElTag, ElSelect, ElOption } from 'element-plus'
// import { BaseButton } from '@/components/Button'
import { getAccountingPageByType } from '@/api/finance'
import { useTable } from '@/hooks/web/useTable'
import { FINANCE_TYPE_DICT, getTagType } from '../utils/dict'
import { convertDateTime } from '../utils/convertDateTime'

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

// 创建备注映射，同时支持大写和小写键
const remarkMap: Record<string, string> = {}
Object.entries(FINANCE_TYPE_DICT).forEach(([key, value]) => {
  remarkMap[key] = value
  remarkMap[key.toUpperCase()] = value
})

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
    label: '购买者'
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

// 月份筛选相关
const currentMonth = ref('')
const months = computed(() => {
  const uniqueMonths = new Set<string>()
  const currentYear = new Date().getFullYear()

  // 添加当前年份的所有月份
  for (let i = 1; i <= 12; i++) {
    const monthStr = i < 10 ? `0${i}` : `${i}`
    uniqueMonths.add(`${currentYear}-${monthStr}`)
  }

  // 从数据中提取月份
  allTableData.value.forEach((item) => {
    if (item.Date) {
      const date = new Date(item.Date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthStr = month < 10 ? `0${month}` : `${month}`
      uniqueMonths.add(`${year}-${monthStr}`)
    }
  })

  return Array.from(uniqueMonths).sort().reverse()
})

// 存储所有数据
const allTableData = ref<TableData[]>([])
// 筛选后的数据
const tableDataList = ref<TableData[]>([])

// 筛选数据
const filterDataByMonth = () => {
  if (!currentMonth.value) {
    // 如果没有选择月份，显示所有数据
    tableDataList.value = [...allTableData.value]
  } else {
    // 筛选指定月份的数据
    tableDataList.value = allTableData.value.filter((item) => {
      if (!item.Date) return false
      const date = new Date(item.Date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const monthStr = month < 10 ? `0${month}` : `${month}`
      const itemMonth = `${year}-${monthStr}`
      return itemMonth === currentMonth.value
    })
  }

  // 更新总数
  total.value = tableDataList.value.length
}

const getTableList = async () => {
  loading.value = true
  const params: any = {
    Type: 'INCOME',
    Page: currentPage.value,
    Size: pageSize.value
  }

  const res: any = await getAccountingPageByType(params)
  if (res) {
    loading.value = false
    allTableData.value = res.data.AccountingInfo
    // 应用筛选
    filterDataByMonth()
  }
}

// 监听月份变化
const handleMonthChange = () => {
  currentPage.value = 1 // 重置到第一页
  filterDataByMonth()
}

getTableList()
</script>

<template>
  <ContentWrap title="收入表" :message="t('tableDemo.tableDes')">
    <div class="filter-container" style="margin-bottom: 20px">
      <el-select
        v-model="currentMonth"
        placeholder="选择月份"
        clearable
        style="width: 200px; margin-right: 10px"
        @change="handleMonthChange"
      >
        <el-option v-for="month in months" :key="month" :label="month" :value="month" />
      </el-select>
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
  </ContentWrap>

  <!--  -->
</template>
