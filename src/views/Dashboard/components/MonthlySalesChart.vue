<script setup lang="ts">
import { ElCard, ElSkeleton, ElSelect, ElOption } from 'element-plus'
import { Echart } from '@/components/Echart'
import { lineOptions } from '../echarts-data'
import { ref, reactive, computed } from 'vue'
import { getMonthlySalesApi } from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

const loading = ref(true)
const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption

// 年份选择相关
const currentYear = ref(new Date().getFullYear())
const yearOptions = computed(() => {
  const startYear = 2024
  const endYear = new Date().getFullYear()
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index)
})

// 获取月度销售数据
const getMonthlySales = async () => {
  loading.value = true

  // 分别获取收入和支出数据
  const incomeRes = await getMonthlySalesApi(currentYear.value, 'INCOME').catch(() => {})
  const expenseRes = await getMonthlySalesApi(currentYear.value, 'EXPENSE').catch(() => {})

  // 准备图表数据
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  set(
    lineOptionsData,
    'xAxis.data',
    months.map((m) => `${m}月`)
  )

  // 处理收入数据
  let incomeData = new Array(12).fill(0)
  if (incomeRes && incomeRes.data) {
    incomeData = incomeRes.data.Data || new Array(12).fill(0)
  }

  // 处理支出数据
  let expenseData = new Array(12).fill(0)
  if (expenseRes && expenseRes.data) {
    expenseData = expenseRes.data.Data || new Array(12).fill(0)
  }

  // 设置图表系列数据
  set(lineOptionsData, 'series', [
    {
      name: '收入',
      smooth: true,
      type: 'line',
      data: incomeData,
      animationDuration: 2800,
      animationEasing: 'cubicInOut'
    },
    {
      name: '支出',
      smooth: true,
      type: 'line',
      data: expenseData,
      animationDuration: 2800,
      animationEasing: 'quadraticOut'
    }
  ])

  // 设置tooltip显示盈利
  set(lineOptionsData, 'tooltip', {
    trigger: 'axis',
    formatter: function (params) {
      const monthIndex = params[0].dataIndex
      const income = incomeData[monthIndex] || 0
      const expense = expenseData[monthIndex] || 0
      const profit = income - expense

      let result = `${params[0].axisValue}<br/>`
      params.forEach((item) => {
        result += `${item.marker} ${item.seriesName}: ${item.value.toFixed(2)}<br/>`
      })
      result += `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#91cc75;"></span> 盈利: ${profit.toFixed(2)}`

      return result
    }
  })

  loading.value = false
}

// 年份变化处理
const handleYearChange = () => {
  getMonthlySales()
}

getMonthlySales()
</script>

<template>
  <ElCard shadow="hover" class="mb-20px">
    <template #header>
      <div class="card-header">
        <span>{{ t('analysis.monthlySales') }}</span>
        <ElSelect v-model="currentYear" class="year-select" @change="handleYearChange">
          <ElOption v-for="year in yearOptions" :key="year" :label="year" :value="year" />
        </ElSelect>
      </div>
    </template>
    <ElSkeleton :loading="loading" animated :rows="4">
      <Echart :options="lineOptionsData" :height="350" />
    </ElSkeleton>
  </ElCard>
</template>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.year-select {
  width: 120px;
}
</style>
