<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElTree } from 'element-plus'
import { getUserByIdApi, saveUserApi, deleteUserByIdApi } from '@/api/department'
import { getalluserApi } from '@/api/Permission'
import type { DepartmentUserItem } from '@/api/department/types'
import type { UserInfo } from '@/api/Permission/type'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { getRoleListApi } from '@/api/role'
import { convertDateTime } from './components/utils/convertDateTime'
import { ElTag } from 'element-plus'


// import { getRoleListApi } from '@/api/role'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'

const { t } = useI18n()

var select = ref('1')
// 1为学员，2为教练，3为游客

const changeSelect = (value: string) => {
    select.value = value
    console.log(select.value)
}

const { tableRegister, tableState, tableMethods } = useTable({
    fetchDataApi: async () => {
        const { pageSize, currentPage } = tableState
        const res = await getUserByIdApi({
            id: unref(currentNodeKey),
            pageIndex: unref(currentPage),
            pageSize: unref(pageSize),
            ...unref(searchParams)
        })
        return {
            list: res.data.list || [],
            total: res.data.total || 0
        }
    },
    fetchDelApi: async () => {
        const res = await deleteUserByIdApi(unref(ids))
        return !!res
    }
})
const { total, loading, dataList, pageSize, currentPage } = tableState
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
        field: 'Username',
        label: '账号',
        form: {
        },
        search: {
            hidden: true
        },
    },
    {
        field: 'name',
        label: '姓名',
        form: {
        },
    },

    {
        field: 'sex',
        label: '性别',
        form: {

        },
        search: {
            hidden: true
        },
    },
    {
        field: 'age',
        label: '年龄',
        form: {

        },
        search: {
            hidden: true
        },
    },
    // {
    //     field: 'Username',
    //     label: t('userDemo.nickName'),
    //     form: {
    //         hidden: true
    //     },
    //     detail: {
    //         hidden: true
    //     },
    //     search: {
    //         hidden: true
    //     },
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
                multiple: true,
                collapseTags: true,
                maxCollapseTags: 1
            },
            optionApi: async () => {
                const res = await getRoleListApi()
                console.log(res)

                return res.data.map((v) => ({
                    label: v.RoleName,
                    value: v.id
                }))
            }
        }
    },
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
        field: 'CreatedAt',
        label: t('userDemo.createTime'),
        form: {
            hidden: true
        },
        search: {
            hidden: true
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

const searchParams = ref({})
const setSearchParams = (params: any) => {
    currentPage.value = 1
    searchParams.value = params
    getList()
}
const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref('')
const Userlist = ref([])
const fetchUserlist = async () => {
    const res = await getalluserApi()
    //对拿到的列表做一个简单的处理
    Userlist.value = res.data.map((v) => {
        return {
            "ID": v.ID,
            "OpenID": v.OpenID,
            "Username": v.Username,
            "Phone": v.Phone,
            "RoleName": (v.RoleName == 'super_admin') ? '学员' : (v.RoleName == 'normal_admin') ? '教练' : '其他',
            "Enable": v.Enable,
            "LastLoginTime": v.LastLoginTime,
            "CreatedAt": convertDateTime(v.CreatedAt),
        }
    })
    console.log(Userlist.value)

    currentNodeKey.value =
        (res.data[0] && res.data[0]?.children && res.data[0].children[0].id) || ''
    await nextTick()
    unref(treeEl)?.setCurrentKey(currentNodeKey.value)
}
fetchUserlist()

const currentDepartment = ref('')
watch(
    () => currentDepartment.value,
    (val) => {
        unref(treeEl)!.filter(val)
    }
)

// const currentChange = (data: DepartmentItem) => {
//   // if (data.children) return
//   currentNodeKey.value = data.id
//   currentPage.value = 1
//   getList()
// }

// const filterNode = (value: string, data: DepartmentItem) => {
//   if (!value) return true
//   return data.departmentName.includes(value)
// }

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
    if (formData) {
        saveLoading.value = true
        try {
            const res = await saveUserApi(formData)
            if (res) {
                currentPage.value = 1
                getList()
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
    <div class="flex w-full h-full">
        <!-- <ContentWrap class="w-250px">
            <div class="flex justify-center items-center">
                <div class="flex-1">{{ t('userDemo.Userlist') }}</div>
                <ElInput v-model="currentDepartment" class="flex-[2]" :placeholder="t('userDemo.searchDepartment')"
                    clearable />
            </div>
            <ElDivider />
            <ElTree ref="treeEl" :data="Userlist" default-expand-all :expand-on-click-node="false" node-key="id"
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
        <ContentWrap class="flex-[3] ml-20px h-full">
            <Search :schema="allSchemas.searchSchema" @reset="setSearchParams" @search="setSearchParams" />

            <div class="mb-10px">

                <div class="mb-2 flex items-center text-sm">
                    <el-radio-group @change="changeSelect" v-model="select" class="ml-4">
                        <el-radio value="1" size="large">学员</el-radio>
                        <el-radio value="2" size="large">教练</el-radio>

                    </el-radio-group>
                </div>
            </div>
            <Table height="100%" v-model:current-page="currentPage" :page-size="pageSize"
                :columns="allSchemas.tableColumns" :data="Userlist" :loading="loading" @register="tableRegister"
                :pagination="{
                total
            }" />
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
