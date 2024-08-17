<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive, h } from 'vue'
import { ElTree, ElTag } from 'element-plus'
import { getDepartmentApi, getUserByIdApi, saveUserApi, deleteUserByIdApi } from '@/api/department'
import type { DepartmentItem, DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import type { UserParams } from '@/api/Permission/type'
//@ts-ignore
import { convertDateTime } from './components/utils/convertDateTime.ts'

import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { getRoleListApi } from '@/api/role'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'
import { getuserlistApi, addAdminApi } from '@/api/Permission'

const { t } = useI18n()



const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    const res: any = await fetchadminlist()
    return {
      list: res,
      total: total.value,
    }




  },
  fetchDelApi: async () => {
    const res = await deleteUserByIdApi(unref(ids))
    return !!res
  }
})
const { total, loading, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: t('userDemo.index'),
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
    field: 'OpenID',
    label: 'OpenID',
    search: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        placeholder: '唯一标识openid',
        rules: [
          {
            required: true,

          }
        ]
      },
    },
  },

  {
    field: 'Username',
    label: '用户名',
    form: {
      component: 'Input',
      componentProps: {
        popable: true,
        clearable: true,
        placeholder: '用户名即账号',
        rules: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    },
    search: {
      hidden: true
    },
  },

  // {
  //   field: 'department.id',
  //   label: t('userDemo.department'),
  //   detail: {
  //     hidden: false
  //     // slots: {
  //     //   default: (data: DepartmentUserItem) => {
  //     //     return <>{data.department.departmentName}</>
  //     //   }
  //     // }
  //   },
  //   search: {
  //     hidden: true
  //   },
  //   form: {
  //     component: 'TreeSelect',
  //     componentProps: {
  //       nodeKey: 'id',
  //       props: {
  //         label: 'departmentName'
  //       }
  //     },
  //     optionApi: async () => {
  //       const res = await getDepartmentApi()
  //       return res.data.list
  //     }
  //   },
  //   table: {
  //     hidden: true
  //   }
  // },
  {
    field: 'RoleName',
    label: t('userDemo.role'),
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const role = data.row.RoleName
          return (
            <>
              <ElTag type={role === '学员' ? 'success' : role === '教练' ? 'warning' : 'danger'}>
                {role}
              </ElTag >
            </>
          )
        }
      }
    },
    form: {
      component: 'Select',
      value: [],
      componentProps: {
        collapseTags: true,
        maxCollapseTags: 1,
        rules: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],

      },
      optionApi: async () => {
        const res = await getRoleListApi()
        console.log(res)

        return res.data.map((v) => ({
          label: v.RoleName,
          value: v.Roleid
        }))
      }
    }
  },
  // {
  //   field: 'roleid',
  //   label: t('userDemo.role'),
  //   formatter: (_: Recordable, __: TableColumn, cellValue: number) => {
  //     return h(
  //       ElTag,
  //       {
  //         type: cellValue === 1 ? 'success' : cellValue === 2 ? 'warning' : 'danger'
  //       },
  //       () =>
  //         cellValue === 1
  //           ? t('userDemo.superAdmin')
  //           : cellValue === 2
  //             ? t('userDemo.admin')
  //             : t('userDemo.user')
  //     )
  //   }
  // },
  // {
  //   field: 'email',
  //   label: t('userDemo.email'),
  //   form: {
  //     component: 'Input'
  //   },
  //   search: {
  //     hidden: true
  //   }
  // },
  {
    field: 'Password',
    label: '密码',
    table: {
      hidden: true
    },
    search: {
      hidden: true
    },
    form: {
      component: 'Input',
      componentProps: {
        type: 'password',
        'prefix-icon': 'el-icon-lock', // 可选，添加一个前缀图标
        clearable: true,
        placeholder: '请输入密码',
        rules: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]

      },


    }

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
    sortable: true
  },
  {
    field: 'Enable',
    label: '状态',
    search: {
      hidden: true
    },
    table: {

      slots: {
        default: (data: any) => {
          const status = data.row.Enable
          console.log(status)
          return (
            <>
              <ElTag type={status == true ? 'success' : 'danger'}>
                {status == true ? t('userDemo.enable') : t('userDemo.disable')}
              </ElTag>
            </>
          )
        }
      }
    },
    form: {
      component: 'Select',
      componentProps: {
        clearable: true,
        placeholder: '请选择状态',
        value: true,
        options: [
          {
            value: true,
            label: '启用'
          },
          {
            value: false,
            label: '禁用'
          },

        ]
      }
    },
    detail: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElTag type={data.status === 0 ? 'danger' : 'success'}>
                {data.status === 1 ? t('userDemo.enable') : t('userDemo.disable')}
              </ElTag>
            </>
          )
        }
      }
    }
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
                <BaseButton type="primary" onClick={() => action(row, 'edit')}>
                  编辑
                </BaseButton>
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

const { allSchemas } = useCrudSchemas(crudSchemas)
const select = ref(0)
const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref('')
const adminlist = ref([])
const fetchadminlist = async () => {
  let params: UserParams = {
    Page: String(currentPage.value),
    Size: String(pageSize.value),
    UserSelectType: 'ADMIN',
  }


  const res = await getuserlistApi(params)

  pageSize.value = res.data.Size
  total.value = res.data.Total





  adminlist.value = res.data.AdminUserInfos.map((v) => {
    return {
      "ID": v.ID,
      "OpenID": v.OpenID,
      "Username": v.Username,
      "Phone": v.Phone,
      "RoleName": (v.RoleName == 'super_admin') ? '超级管理员' : (v.RoleName == 'normal_admin') ? '管理员' : '学员',
      "Enable": v.Enable,
      "LastLoginTime": v.LastLoginTime,
      "CreatedAt": convertDateTime(v.CreatedAt),
    }
  })

  currentNodeKey.value =
    (res.data[0] && res.data[0]?.children && res.data[0].children[0].id) || ''
  await nextTick()
  unref(treeEl)?.setCurrentKey(currentNodeKey.value)
}

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)


const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)
const ids = ref<string[]>([])

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

const action = (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = { ...row, department: unref(treeEl)?.getCurrentNode() || {} }
  dialogVisible.value = true
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  console.log(formData)
  if (formData) {
    saveLoading.value = true
    try {
      let data: object = {
        Username: formData.Username,
        Password: formData.Password,
        Roleid: formData.RoleName[0],
        OpenID: formData.OpenID,
      }
      const res = await addAdminApi(data)
      if (res) {
        currentPage.value = 1
        fetchadminlist()
      }
    } catch (error) {
      console.log(error)
    } finally {
      saveLoading.value = false
      dialogVisible.value = false
    }
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <!-- <ContentWrap class="w-250px">
      <div class="flex justify-center items-center">
        <div class="flex-1">{{ t('userDemo.adminlist') }}</div>
        <ElInput v-model="currentDepartment" class="flex-[2]" :placeholder="t('userDemo.searchDepartment')" clearable />
      </div>
      <ElDivider />
      <ElTree ref="treeEl" :data="adminlist" default-expand-all :expand-on-click-node="false" node-key="id"
        :current-node-key="currentNodeKey" :props="{
          label: 'departmentName'
        }" :filter-node-method="filterNode" @current-change="currentChange">
        <template #default="{ data }">
          <div :title="data.departmentName" class="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {{ data.departmentName }}
          </div>
        </template>
</ElTree>
</ContentWrap> -->



    <ContentWrap class="flex-[3] ml-20px">
      <!-- <Search :schema="allSchemas.searchSchema" @reset="setSearchParams" @search="setSearchParams" /> -->

      <div class="mb-10px">
        <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
        <BaseButton :loading="delLoading" type="danger" @click="delData()">
          {{ t('exampleDemo.del') }}
        </BaseButton>

      </div>
      <Table v-model:current-page="currentPage" v-model:page-size="pageSize" :columns="allSchemas.tableColumns"
        :data="adminlist" :loading="loading" @register="tableRegister" :pagination="{ total }" />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write v-if="actionType !== 'detail'" ref="writeRef" :form-schema="allSchemas.formSchema"
        :current-row="currentRow" />

      <Detail v-if="actionType === 'detail'" :detail-schema="allSchemas.detailSchema" :current-row="currentRow" />

      <template #footer>
        <BaseButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
          {{ t('exampleDemo.save') }}
        </BaseButton>
        <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>
