<template>
  <ContentWrap title="课程列表">
    <Table
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :columns="allSchemas.tableColumns"
      :data="tableDataList"
      :loading="loading"
      :pagination="{
        total
      }"
    />
  </ContentWrap>
</template>
<script lang="tsx" setup>
import { ref, onMounted, watch } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { getCoursePageApi } from '@/api/course' // 新增API引入
import { convertDateTime } from './utils' // 需要确保存在时间格式化工具
import { ElTag, ElProgress } from 'element-plus'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'

interface CourseItem {
  ID: number
  Name: string
  Description: string
  CoachName: string
  CourseType: string
  RemainingCount: number
  CreatedAt: string
  EndTime: string
  CoachPunchInAuth: boolean
  Username: string
  Percentage: number
}

// 新增接口参数类型
interface QueryParams {
  Name?: string
  Page?: number
  Size?: number
}

const loading = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const columns = [
  {
    field: 'index',
    label: '序号',
    type: 'index'
  },
  {
    field: 'Username',
    label: '购买用户',
    search: {
      hidden: true
    }
  },
  {
    field: 'Name',
    label: '课程名称'
  },
  {
    field: 'Percentage',
    label: '完成进度',
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: { row: CourseItem }) => (
          <ElProgress
            percentage={data.row.Percentage}
            status={data.row.Percentage === 100 ? 'success' : undefined}
            stroke-width={18}
            text-inside
          />
        )
      }
    }
  },
  {
    field: 'CoachName',
    label: '所属教练'
  },
  {
    field: 'CoachPunchInAuth',
    label: '打卡授权',
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const status = data.row.CoachPunchInAuth
          return (
            <>
              <ElTag type={status ? 'success' : 'danger'} size="small">
                {status ? '已授权' : '未授权'}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'CourseType',
    label: '课程类型',
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: { row: CourseItem }) => (
          <ElTag
            type={data.row.CourseType === 'lesson' ? 'primary' : 'success'}
            effect="light"
            size="small"
          >
            {data.row.CourseType === 'lesson' ? '课时课程' : '年卡课程'}
          </ElTag>
        )
      }
    }
  },
  {
    field: 'RemainingCount',
    label: '剩余课时',
    sortable: true
  },
  {
    field: 'CreatedAt',
    label: '创建时间',
    formatter: (row: CourseItem) => convertDateTime(row.CreatedAt),
    table: {
      width: 200
    }
  },
  {
    field: 'EndTime',
    label: '有效期至',
    formatter: (row: CourseItem) => convertDateTime(row.EndTime) || '长期有效',
    table: {
      width: 200
    }
  }
]

const { allSchemas } = useCrudSchemas(columns)

let tableDataList = ref<CourseItem[]>([])

// 获取课程列表
const getTableList = async () => {
  loading.value = true
  try {
    const params: QueryParams = {
      Page: currentPage.value,
      Size: pageSize.value
    }

    const res = await getCoursePageApi(params)
    if (res.code === 200) {
      tableDataList.value = res.data.CourseInfos
      total.value = res.data.Total
    }
  } catch (error) {
    console.error('获取课程列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 初始化加载
onMounted(() => {
  getTableList()
})

// 监听分页变化
watch([currentPage, pageSize], () => {
  getTableList()
})
</script>
