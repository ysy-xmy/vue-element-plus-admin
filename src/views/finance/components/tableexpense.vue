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

// 月份筛选相关
const currentMonth = ref('')
const months = computed(() => {
  const uniqueMonths = new Set<string>()

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

  // 按月份从一月份开始排序
  return Array.from(uniqueMonths).sort((a, b) => {
    const [yearA, monthA] = a.split('-').map(Number)
    const [yearB, monthB] = b.split('-').map(Number)
    return yearA === yearB ? monthA - monthB : yearB - yearA
  })
})

// 存储所有数据
const allTableData = ref<TableData[]>([])
// 筛选后的数据
const tableDataList = ref<TableData[]>([])

const filterData = () => {
  tableDataList.value = allTableData.value.filter((item) => {
    const matchesMonth =
      !currentMonth.value ||
      (item.Date && new Date(item.Date).toISOString().slice(0, 7) === currentMonth.value)
    const matchesRemark = !selectedRemark.value || item.Remark === selectedRemark.value
    const matchesUsername = !selectedUsername.value || item.Username === selectedUsername.value

    return matchesMonth && matchesRemark && matchesUsername
  })

  // 更新总数
  total.value = tableDataList.value.length
}

// 监听筛选变化
const handleFilterChange = () => {
  currentPage.value = 1 // 重置到第一页
  filterData()
}

// 监听月份变化
const handleMonthChange = () => {
  handleFilterChange()
}

// 监听类型变化
const handleRemarkChange = () => {
  handleFilterChange()
}

// 监听用户名变化
const handleUsernameChange = () => {
  handleFilterChange()
}

const getTableList = async () => {
  loading.value = true
  const params: any = {
    Type: 'EXPENSE',
    Page: currentPage.value,
    Size: pageSize.value
  }

  const res: any = await getAccountingPageByType(params)
  if (res) {
    loading.value = false
    allTableData.value = res.data.AccountingInfo
    // 应用筛选
    filterData()
    // 更新月份选项
    months.value = months.value // 直接使用计算属性
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

const remarkOptions = Object.entries(FINANCE_TYPE_DICT)
  .filter(([key]) => key.endsWith('_expense')) // 只保留支出相关的类型
  .map(([key, value]) => ({ value: key, label: value }))

const selectedRemark = ref('')

const usernameOptions = computed(() => {
  const uniqueUsernames = new Set<string>()
  allTableData.value.forEach((item) => {
    if (item.Username) {
      uniqueUsernames.add(item.Username)
    }
  })
  return Array.from(uniqueUsernames).map((username) => ({ value: username, label: username }))
})

const selectedUsername = ref('')
</script>

<template>
  <ContentWrap title="支出表" :message="t('tableDemo.tableDes')">
    <div
      class="filter-container"
      style="margin-bottom: 20px; display: flex; justify-content: space-between"
    >
      <div>
        <el-select
          v-model="currentMonth"
          placeholder="选择月份"
          clearable
          style="width: 200px; margin-right: 10px"
          @change="handleMonthChange"
        >
          <el-option v-for="month in months" :key="month" :label="month" :value="month" />
        </el-select>

        <el-select
          v-model="selectedRemark"
          placeholder="选择类型"
          clearable
          style="width: 200px; margin-right: 10px"
          @change="handleRemarkChange"
        >
          <el-option
            v-for="option in remarkOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <el-select
          v-model="selectedUsername"
          placeholder="选择用户名"
          clearable
          style="width: 200px; margin-right: 10px"
          @change="handleUsernameChange"
        >
          <el-option
            v-for="option in usernameOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

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
