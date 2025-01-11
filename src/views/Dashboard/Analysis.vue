<script setup lang="ts">
import PanelGroup from './components/PanelGroup.vue'
import { ElRow, ElCol } from 'element-plus'
import tableCoach from './components/tableCoach.vue'
import tableRecord from './components/tableRecord.vue'
import MonthlySalesChart from './components/MonthlySalesChart.vue'
import { ref } from 'vue'
const loading = ref(true)
</script>

<template>
  <PanelGroup />
  <ElRow :gutter="20" justify="space-between">
    <ElCol :span="24">
      <MonthlySalesChart />
    </ElCol>
    <ElCol :xl="10" :lg="10" :md="24" :sm="24" :xs="24">
      <tableCoach :loading="loading" :data="[]" :columns="[]" />
    </ElCol>
    <ElCol :xl="14" :lg="14" :md="24" :sm="24" :xs="24">
      <tableRecord :loading="loading" :data="[]" :columns="[]" />
    </ElCol>
  </ElRow>
</template>
