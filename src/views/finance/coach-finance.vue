<script setup lang="ts">
import { ElRow, ElCol } from 'element-plus'
import { ref } from 'vue'

const loading = ref(true)

// 每月销售总额
// import DefaultTable from '../Components/Table/DefaultTable.vue'
import tableCoach from './components/tableCoach.vue'
// import tableRecord from '../Components/Table/tableRecord.vue'
</script>

<template>
  <ElRow :gutter="20" justify="space-between">
    <ElCol :span="24">
      <!-- <ElCard shadow="hover" class="mb-20px">
        <ElSkeleton :loading="loading" animated>
          <Echart :options="pieOptionsData" :height="300" />
        </ElSkeleton>
      </ElCard> -->
      <tableCoach :loading="loading" :data="[]" :columns="[]" />
    </ElCol>
  </ElRow>
</template>
