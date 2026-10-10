<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Echart } from '@/components/Echart'
import type { EChartsOption } from 'echarts'
import { getOverview, type Overview } from '@/api/admin'
import { errorText } from '@/views/Operations/shared'
import '@/views/Operations/operations.css'

const router = useRouter()
const days = ref(7)
const data = ref<Overview>()
const loading = ref(false)
const error = ref('')
const load = async () => {
  loading.value = true
  error.value = ''
  data.value = undefined
  try {
    data.value = await getOverview(days.value)
  } catch (e) {
    error.value = errorText(e)
  } finally {
    loading.value = false
  }
}
const metrics = computed(() => [
  {
    label: '小程序用户',
    value: data.value?.users,
    note: `近 ${days.value} 天新增 ${data.value?.newUsers ?? '—'} 人`
  },
  {
    label: '训练计划',
    value: data.value?.plans,
    note: `累计已完成 ${data.value?.completedPlans ?? '—'} 次`
  },
  {
    label: `近 ${days.value} 天 AI 请求`,
    value: data.value?.aiRuns,
    note: `失败 ${data.value?.aiFailures ?? '—'} 次，可前往 AI 使用排查`
  },
  {
    label: '有带教学员的教练',
    value: data.value?.trainingCoaches,
    note: '根据实际带教关系统计，排除自己的训练'
  }
])
const completion = computed(() =>
  data.value?.periodPlans
    ? Math.round((data.value.periodCompletedPlans / data.value.periodPlans) * 100)
    : 0
)
const chart = computed<EChartsOption>(() => ({
  color: ['#167b6b', '#83c5b5', '#667de8'],
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0, data: ['训练计划', '已完成计划', 'AI 请求'] },
  grid: { left: 16, right: 18, top: 24, bottom: 52, containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: data.value?.trend.map((x) => x.date.slice(5)) || []
  },
  yAxis: { type: 'value', minInterval: 1 },
  series: [
    {
      name: '训练计划',
      type: 'line',
      smooth: true,
      data: data.value?.trend.map((x) => x.plans) || []
    },
    {
      name: '已完成计划',
      type: 'line',
      smooth: true,
      data: data.value?.trend.map((x) => x.completedPlans) || []
    },
    {
      name: 'AI 请求',
      type: 'line',
      smooth: true,
      data: data.value?.trend.map((x) => x.aiRuns) || []
    }
  ]
}))
onMounted(load)
</script>

<template>
  <div class="ops-page" v-loading="loading">
    <div class="ops-header">
      <div
        ><div class="ops-eyebrow">轻律 · 运营工作台</div><h1>每一次训练，都看得见</h1
        ><p>关注用户的训练习惯、AI 使用情况与教练工具使用。</p></div
      >
      <div class="ops-filters" style="margin-bottom: 0">
        <el-radio-group v-model="days" @change="load" :disabled="loading"
          ><el-radio-button :value="7">近 7 天</el-radio-button
          ><el-radio-button :value="30">近 30 天</el-radio-button></el-radio-group
        >
        <el-button @click="load" :disabled="loading">刷新</el-button>
      </div>
    </div>
    <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" />
    <div class="ops-metrics"
      ><div v-for="metric in metrics" :key="metric.label" class="ops-metric"
        ><div class="label">{{ metric.label }}</div
        ><div class="value">{{ metric.value?.toLocaleString() ?? '—' }}</div
        ><div class="note">{{ metric.note }}</div></div
      ></div
    >
    <div class="ops-columns">
      <section class="ops-panel"
        ><h2>训练与 AI 趋势</h2
        ><p class="hint"
          >训练按计划日期统计，已完成为该日期计划的当前状态；AI
          按请求发起日期统计。时区：北京时间。</p
        ><Echart v-if="data" :options="chart" height="320px" /><el-empty
          v-else
          description="等待加载运营数据"
      /></section>
      <section class="ops-panel"
        ><h2>训练使用情况</h2><p class="hint">近 {{ days }} 天</p
        ><el-progress
          v-if="data"
          type="dashboard"
          :percentage="completion"
          color="#167b6b"
          style="display: block; text-align: center; margin: 20px 0"
        /><p class="hint"
          >已完成 {{ data?.periodCompletedPlans ?? '—' }} / {{ data?.periodPlans ?? '—' }} 个计划</p
        ><el-divider /><p
          >登录用户 <strong>{{ data?.activeUsers ?? '—' }}</strong></p
        ><p class="hint">统计周期内有登录记录的用户</p
        ><p
          >公共动作 <strong>{{ data?.builtinActions ?? '—' }}</strong> · 自定义动作
          <strong>{{ data?.customActions ?? '—' }}</strong></p
        ></section
      >
    </div>
    <section class="ops-panel"
      ><h2>常用工作</h2
      ><div class="ops-filters" style="margin-top: 18px; margin-bottom: 0"
        ><el-button @click="router.push('/permission/user')">查看用户</el-button
        ><el-button @click="router.push('/training/plans')">查询训练计划</el-button
        ><el-button @click="router.push('/ai/runs')">查看 AI 请求</el-button
        ><el-button @click="router.push('/resource/course-list')">维护动作库</el-button
        ><el-button @click="router.push('/system/systemconfig')">配置小程序</el-button></div
      ></section
    >
  </div>
</template>
