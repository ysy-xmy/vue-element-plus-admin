<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElSkeleton, ElSelect, ElOption } from 'element-plus'
import { Echart } from '@/components/Echart'
import { pieOptionsexpense, pieOptionsincome, corporateLineOptions } from './echarts-data'
import { ref, reactive, watch } from 'vue'
import { getYearPercentApi } from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import tableincome from './components/tableincome.vue'
import tableexpense from './components/tableexpense.vue'
import MonthlySalesChart from '../Dashboard/components/MonthlySalesChart.vue'
import { FINANCE_TYPE_DICT } from './utils/dict'

const loading = ref(true)
const selectedMonth = ref<number | undefined>()

const pieIncomeOptions = reactive<EChartsOption>(pieOptionsincome) as EChartsOption
const pieExpenseOptions = reactive<EChartsOption>(pieOptionsexpense) as EChartsOption

const getYearPercent = async (type: 'INCOME' | 'EXPENSE', year?: number, month?: number) => {
  const params = {
    year,
    type,
    month: month || undefined
  }

  const res = await getYearPercentApi(params).catch(() => {})
  if (res) {
    const targetOptions = type === 'INCOME' ? pieIncomeOptions : pieExpenseOptions

    // 添加年份到标题
    const titleSuffix = year ? ` ${year}年` : ''
    targetOptions.title = {
      ...targetOptions.title,
      text: `${titleSuffix}${type === 'INCOME' ? '收入' : '支出'}分布图`
    }

    set(
      targetOptions,
      'legend.data',
      res.data.map((v) => FINANCE_TYPE_DICT[v.Remake] || v.Remake)
    )

    targetOptions.series![0].data = res.data.map((v) => ({
      name: FINANCE_TYPE_DICT[v.Remake] || `${v.Remake} (${v.Percent}%)`,
      value: v.Percent
    }))
  }
}

const corporateLineOption = reactive<EChartsOption>(corporateLineOptions) as EChartsOption

const getAllApi = async () => {
  await Promise.all([
    getYearPercent('INCOME', 2024, selectedMonth.value),
    getYearPercent('EXPENSE', 2024, selectedMonth.value)
  ])
  loading.value = false
}

// 添加月份变化监听
watch(selectedMonth, () => {
  loading.value = true
  getAllApi()
})

getAllApi()
// import DefaultTable from '../Components/Table/DefaultTable.vue'
// import tableRecord from '../Components/Table/tableRecord.vue'
</script>

<template>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :span="24">
      <MonthlySalesChart />
    </ElCol>

    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <div class="filter-header mb-20px">
          <span class="mr-10px">选择月份:</span>
          <ElSelect v-model="selectedMonth" placeholder="全部月份" style="width: 120px" clearable>
            <ElOption v-for="month in 12" :key="month" :label="`${month}月`" :value="month" />
          </ElSelect>
        </div>

        <ElRow :gutter="20">
          <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <ElSkeleton :loading="loading" animated :rows="4">
              <template #default>
                <Echart :options="pieIncomeOptions" :height="350" />
              </template>
            </ElSkeleton>
          </ElCol>

          <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <ElSkeleton :loading="loading" animated :rows="4">
              <template #default>
                <Echart :options="pieExpenseOptions" :height="350" />
              </template>
            </ElSkeleton>
          </ElCol>
        </ElRow>
      </ElCard>
    </ElCol>

    <ElCol :span="24">
      <tableincome :loading="loading" :data="[]" :columns="[]" />
    </ElCol>
    <ElCol :span="24">
      <tableexpense :loading="loading" :data="[]" :columns="[]" />
    </ElCol>
  </ElRow>
</template>

<style scoped>
.filter-header {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}
</style>
