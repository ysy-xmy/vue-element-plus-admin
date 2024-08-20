<script setup lang="ts">
import { ElRow, ElCol, ElCard, ElSkeleton } from 'element-plus'
import { Echart } from '@/components/Echart'
import { pieOptions, barOptions, lineOptions } from './echarts-data'
import { ref, reactive } from 'vue'
import {
    getUserAccessSourceApi,
    getWeeklyUserActivityApi,
    getMonthlySalesApi
} from '@/api/dashboard/analysis'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { useI18n } from '@/hooks/web/useI18n'
import tableorder from './components/tableorder.vue'
const { t } = useI18n()

const loading = ref(true)

const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption

// 用户来源
const getUserAccessSource = async () => {
    const res = await getUserAccessSourceApi().catch(() => { })
    if (res) {
        set(
            pieOptionsData,
            'legend.data',
            res.data.map((v) => t(v.name))
        )
        pieOptionsData!.series![0].data = res.data.map((v) => {
            return {
                name: t(v.name),
                value: v.value
            }
        })
    }
}

const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

// 周活跃量
const getWeeklyUserActivity = async () => {
    const res = await getWeeklyUserActivityApi().catch(() => { })
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

// 每月销售总额
const getMonthlySales = async () => {
    const res = await getMonthlySalesApi().catch(() => { })
    if (res) {
        set(
            lineOptionsData,
            'xAxis.data',
            res.data.map((v) => t(v.name))
        )
        set(lineOptionsData, 'series', [
            // {
            //     name: t('analysis.estimate'),
            //     smooth: true,
            //     type: 'line',
            //     data: res.data.map((v) => v.estimate),
            //     animationDuration: 2800,
            //     animationEasing: 'cubicInOut'
            // },
            {
                name: '销量',
                smooth: true,
                type: 'line',
                itemStyle: {},
                data: res.data.map((v) => v.actual),
                animationDuration: 2800,
                animationEasing: 'quadraticOut'
            }
        ])
    }
}

const getAllApi = async () => {
    await Promise.all([getUserAccessSource(), getWeeklyUserActivity(), getMonthlySales()])
    loading.value = false
}

getAllApi()
// import DefaultTable from '../Components/Table/DefaultTable.vue'
import tableRecord from '../Components/Table/tableRecord.vue'
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
