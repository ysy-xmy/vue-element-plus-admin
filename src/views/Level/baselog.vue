<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElTree } from 'element-plus'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import Write from './Write.vue'
import Detail from './Detail.vue'
import { Dialog } from '@/components/Dialog'
import { convertDateTime } from './utils/convertDateTime'

// import { getRoleListApi } from '@/api/role'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'
import { getlog } from '@/api/log'
const { t } = useI18n()

// 1为学员，2为教练，3为游客

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res: any = await fetchloglist()

    const { pageSize, currentPage } = tableState

    return {
      list: res,
      total: total.value,
    }
  },
  fetchDelApi: async () => {

  }
})
const { total, loading, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([

  {
    field: 'index',
    label: '序号',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'index'
    }
  },
  {
    field: 'ID',
    label: 'ID',
    search: {
      hidden: true
    },
  },
  {
    field: 'UserID',
    label: '操作者id',
    search: {
      hidden: true
    },
  },
  {
    field: 'Path',
    label: '路径',

    search: {
      hidden: true
    },
  },


  {
    field: 'Method',
    label: '方法',

    search: {
      hidden: true
    },
  },
  {
    field: 'Params',
    label: '请求数据',

    search: {
      hidden: true
    },
  },


  {
    field: 'Resp',
    label: '响应',

    search: {
      hidden: true
    },
  },
  {
    field: 'CreatedAt',
    label: t('userDemo.createTime'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },

  },
  {
    field: 'action',
    label: t('userDemo.action'),
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 200,
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem
          return (
            <>
              <div class="flex justify-center items-center w-full">
                {/* <BaseButton type="primary" onClick={() => action(row, 'edit')}>
                  编辑
                </BaseButton> */}
                <BaseButton type="success" onClick={() => action(row, 'detail')}>
                  查看
                </BaseButton>
              </div>

            </>
          )
        }
      }
    }
  }
])

const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}
const { allSchemas } = useCrudSchemas(crudSchemas)


const treeEl = ref<typeof ElTree>()
function displayObjectAsStrings(obj: { [key: string]: any }) {
  if (obj === null || obj === undefined) {
    return ''
  }
  else {
    return obj.msg
  }
}
const currentNodeKey = ref('')
const loglist = ref([])
currentPage.value = 1
const fetchloglist = async () => {
  loading.value = true
  let params = {
    Page: String(currentPage.value),
    Size: String(pageSize.value),
    Type: 'base'
  }
  const res = await getlog(params)
  console.log(res.data.Total)
  console.log(total.value)
  total.value = res.data.Total
  pageSize.value = res.data.Size
  currentPage.value = res.data.Page

  //对拿到的列表做一个简单的处理
  loglist.value = res.data.Logs.map((v) => {
    console.log(v.Resp)
    return {
      ID: v.ID,
      UserID: v.UserID,
      Path: v.Path,
      Method: v.Method,
      Params: displayObjectAsStrings(v.Params),
      Resp: displayObjectAsStrings(v.Resp),
      CreatedAt: convertDateTime(v.CreatedAt),
    }
  })
  loading.value = false



  currentNodeKey.value =
    (res.data[0] && res.data[0]?.children && res.data[0].children[0].id) || ''
  await nextTick()
  unref(treeEl)?.setCurrentKey(currentNodeKey.value)
}





const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()
const actionType = ref('')

const delData = async (row?: DepartmentUserItem) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}

const delLoading = ref(false)
const ids = ref<number[]>([])

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = type === 'edit' ? '编辑' : '查看'
  actionType.value = type
  currentRow.value = { ...row, department: unref(treeEl)?.getCurrentNode() || {} }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()





</script>

<template>
  <div class="flex w-full h-full">

    <ContentWrap class="flex-[3] ml-20px h-full">


      <Table v-model:current-page="currentPage" v-model:page-size="pageSize" :columns="allSchemas.tableColumns"
        :data="loglist" :loading="loading" @register="tableRegister" :pagination="{
        total
      }" />



    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema" />

      <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" />

      <template #footer>

        <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
      </template>

    </Dialog>
  </div>
</template>
