<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { Echart } from '@/components/Echart'
import { barOptions, lineOptions } from './echarts-data'
import { ref, reactive } from 'vue'
import { getWeeklyUserActivityApi } from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
import tableorder from './components/tableorder.vue'
const { t } = useI18n()

const loading = ref(true)

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

// 周活跃量
const getWeeklyUserActivity = async () => {
  const res = await getWeeklyUserActivityApi().catch(() => {})
  if (res) {
    set(
      barOptionsData,
      'xAxis.data',
      res.data.map((v) => t(v.name))
    )
    set(barOptionsData, 'series', [
      {
        name: t('analysis.activeQuantity'),
        data: res.data.map((v) => v.value),
        type: 'bar'
      }
    ])
  }
}

const lineOptionsData = reactive<EChartsOption>(lineOptions) as EChartsOption

const getAllApi = async () => {
  await Promise.all([getWeeklyUserActivity()])
  loading.value = false
}

getAllApi()
// import DefaultTable from '../Components/Table/DefaultTable.vue'
</script>

<template>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :span="24">
      <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated :rows="4">
          <Echart :options="lineOptionsData" :height="350" />
        </ElSkeleton>
      </ElCard>
    </ElCol>

    <ElCol :span="24">
      <tableorder :loading="loading" :data="[]" :columns="[]" />
    </ElCol>
  </ElRow>
</template>
