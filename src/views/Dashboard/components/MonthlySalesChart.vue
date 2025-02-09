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
  const res = await getMonthlySalesApi(currentYear.value).catch(() => {})
  if (res) {
    // 按月份分组数据
    const monthlyData = res.data.reduce(
      (acc, curr) => {
        if (!acc[curr.Month]) {
          acc[curr.Month] = { income: 0, expense: 0 }
        }
        acc[curr.Month][curr.AccountingType] = curr.TotalAmount
        return acc
      },
      {} as Record<number, { income: number; expense: number }>
    )

    // 准备图表数据
    const months = Array.from({ length: 12 }, (_, i) => i + 1)
    set(
      lineOptionsData,
      'xAxis.data',
      months.map((m) => `${m}月`)
    )
    set(lineOptionsData, 'series', [
      {
        name: '收入',
        smooth: true,
        type: 'line',
        data: months.map((m) => monthlyData[m]?.income || 0),
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      },
      {
        name: '支出',
        smooth: true,
        type: 'line',
        data: months.map((m) => monthlyData[m]?.expense || 0),
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    ])
  } else {
    // 设置空数据状态
    set(
      lineOptionsData,
      'xAxis.data',
      Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
    )
    set(lineOptionsData, 'series', [
      {
        name: '收入',
        smooth: true,
        type: 'line',
        data: new Array(12).fill(0),
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      },
      {
        name: '支出',
        smooth: true,
        type: 'line',
        data: new Array(12).fill(0),
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    ])
  }
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
