<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElSkeleton, ElSelect, ElOption, ElEmpty } from 'element-plus'
import { Echart } from '@/components/Echart'
import { pieOptionsexpense, pieOptionsincome } from './echarts-data'
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
const selectedYear = ref<number>(2024)

const pieIncomeOptions = reactive<EChartsOption>(pieOptionsincome) as EChartsOption
const pieExpenseOptions = reactive<EChartsOption>(pieOptionsexpense) as EChartsOption

const getYearPercent = async (type: 'INCOME' | 'EXPENSE', year?: number, month?: number) => {
  const params = {
    year: year || selectedYear.value,
    type,
    month: month || undefined
  }

  const res = await getYearPercentApi(params).catch(() => {})
  if (res) {
    const targetOptions = type === 'INCOME' ? pieIncomeOptions : pieExpenseOptions
    const hasData = res.data && res.data.length > 0

    // 添加年份到标题
    const titleSuffix = year ? ` ${year}年` : ''
    targetOptions.title = {
      ...targetOptions.title,
      text: hasData
        ? `${titleSuffix}${type === 'INCOME' ? '收入' : '支出'}分布图`
        : `暂无${type === 'INCOME' ? '收入' : '支出'}数据`
    }

    set(
      targetOptions,
      'legend.data',
      hasData ? res.data.map((v) => FINANCE_TYPE_DICT[v.Remake] || v.Remake) : []
    )

    targetOptions.series![0].data = hasData
      ? res.data.map((v) => ({
          name: FINANCE_TYPE_DICT[v.Remake] || `${v.Remake} (${v.Percent}%)`,
          value: v.Percent
        }))
      : []
  }
}

const getAllApi = async () => {
  await Promise.all([
    getYearPercent('INCOME', selectedYear.value, selectedMonth.value),
    getYearPercent('EXPENSE', selectedYear.value, selectedMonth.value)
  ])
  loading.value = false
}

// 监听年份和月份变化
watch([selectedYear, selectedMonth], () => {
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
          <span class="mr-10px">选择年份:</span>
          <ElSelect
            v-model="selectedYear"
            placeholder="选择年份"
            style="width: 120px; margin-right: 20px"
          >
            <ElOption
              v-for="year in Array.from(
                { length: new Date().getFullYear() - 2019 },
                (_, i) => 2020 + i
              )"
              :key="year"
              :label="`${year}年`"
              :value="year"
            />
          </ElSelect>
          <span class="mr-10px">选择月份:</span>
          <ElSelect v-model="selectedMonth" placeholder="全部月份" style="width: 120px" clearable>
            <ElOption v-for="month in 12" :key="month" :label="`${month}月`" :value="month" />
          </ElSelect>
        </div>

        <ElRow :gutter="20">
          <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <ElSkeleton :loading="loading" animated :rows="4">
              <template #default>
                <div v-if="pieIncomeOptions.series?.[0]?.data?.length">
                  <Echart :options="pieIncomeOptions" :height="350" />
                </div>
                <el-empty v-else description="暂无收入数据" :image-size="100" />
              </template>
            </ElSkeleton>
          </ElCol>

          <ElCol :xl="12" :lg="12" :md="24" :sm="24" :xs="24">
            <ElSkeleton :loading="loading" animated :rows="4">
              <template #default>
                <div v-if="pieExpenseOptions.series?.[0]?.data?.length">
                  <Echart :options="pieExpenseOptions" :height="350" />
                </div>
                <el-empty v-else description="暂无支出数据" :image-size="100" />
              </template>
            </ElSkeleton>
          </ElCol>
        </ElRow>
      </ElCard>
    </ElCol>

    <ElCol :span="24">
      <tableincome :loading="loading" :data="[]" :columns="[]" />
    </ElCol>

    <div class="mb-20px w-full"></div>

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
