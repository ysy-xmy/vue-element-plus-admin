<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, watch, unref, nextTick, reactive } from 'vue'
import { ElMessage, ElTree, messageConfig } from 'element-plus'
import { getUserByIdApi, saveUserApi, deleteUserByIdApi } from '@/api/department'
import { getuserlistApi, disableUserApi, updatauserapi } from '@/api/Permission'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { roleApi } from '@/api/role'
import { convertDateTime } from './components/utils/convertDateTime'
import { ElTag, ElMessageBox } from 'element-plus'


import type { UserParams } from '@/api/Permission/type'
// import { getRoleListApi } from '@/api/role'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'
import { toUSVString } from 'util'

const { t } = useI18n()

var select = ref('STUDENT')
// 1为学员，2为教练，3为游客

const changeSelect = (value: string) => {
    select.value = value
    fetchUserlist()

}

const { tableRegister, tableState, tableMethods } = useTable({
    fetchDataApi: async () => {
        const { pageSize, currentPage } = tableState
        const res: any = await fetchUserlist()
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
const { getList } = tableMethods

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
        form: {
            hidden: true
        },
        search: {
            hidden: true
        },
    },
    {
        field: 'Avatar',
        label: '头像',
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
            width: 100,
            slots: {
                default: (data: any) => {
                    const Avatar = data.row.Avatar
                    return (
                        <>
                            <div class="flex justify-center items-center w-full">
                                <img src={Avatar} class='w-50px rounded-full h-50px' />
                            </div>
                        </>
                    )
                }
            }
        }
    },
    {
        field: 'Username',
        label: '用户名',
        form: {
            hidden: true
        },
    },
    {
        field: 'Phone',
        label: '手机号',
        form: {
            hidden: true
        },

        search: {
            hidden: true
        },
    },


    {
        field: 'Age',
        label: '年龄',
        form: {
            hidden: true
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
        label: '角色',
        search: {
            hidden: true
        },
        table: {
            slots: {
                default: (data: any) => {
                    const RoleName = data.row.RoleName
                    return (
                        <>
                            <ElTag type={RoleName === '学员' ? 'success' : RoleName === '教练' ? 'warning' : 'info'}>
                                {RoleName}
                            </ElTag>
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
                const res = await roleApi()
                console.log(res)

                return res.data.map((v) => ({
                    label: v.RoleName,
                    value: v.RoleName
                }))
            }
        }
    },
    {
        field: 'Sex',
        label: '性别',
        search: {
            hidden: true
        },
        table: {
            slots: {
                default: (data: any) => {
                    const Sex = data.row.Sex
                    return (
                        <>
                            <ElTag type={Sex === 0 ? 'success' : Sex === 1 ? 'warning' : 'danger'}>
                                {Sex === 0 ? '男' : Sex === 1 ? '女' : '未知'}
                            </ElTag >
                        </>
                    )
                }
            }
        },
        form: {
            hidden: true

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
        },
        table: {
            width: 200,
        }
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
                    return (
                        <>
                            <ElTag type={status == true ? 'success' : 'danger'}>
                                {status == true ? t('userDemo.enable') : t('userDemo.disable')}
                            </ElTag>
                            <el-switch onChange={() => {
                                var ID = data.row.ID
                                if (status) {
                                    ElMessageBox.confirm(`确认将该用户禁用？`, '提示', {
                                        confirmButtonText: '确认',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                    }).catch(() => {
                                        data.row.Enable = true
                                    }).then(async () => {
                                        const res = await disableUserApi(ID)
                                        if (res) {
                                            console.log(res)
                                        }


                                    })
                                } else {
                                    ElMessageBox.confirm(`确认将该用户启用？`, '提示', {
                                        confirmButtonText: '确认',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                    }).catch(() => {
                                        data.row.Enable = false
                                    }).then(async () => {
                                        const res = await disableUserApi(ID)
                                        if (res) {
                                            console.log(res)
                                        }
                                    })


                                }
                            }} class="ml-2" v-model={data.row.Enable} />

                        </>
                    )
                }
            }
        },
        form: {
            hidden: true,
            component: 'Select',
            componentProps: {
                options: [
                    {
                        value: true,
                        label: '启用'
                    },
                    {
                        value: false,
                        label: '禁用'
                    }
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

const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref('')
const Userlist = ref([])
const fetchUserlist = async () => {
    loading.value = true
    let params: UserParams = {
        Page: String(currentPage.value),
        Size: String(pageSize.value),
        UserSelectType: select.value,
    }

    const res = await getuserlistApi(params).finally(() => {
        loading.value = false
    })
    pageSize.value = res.data.Size
    total.value = res.data.Total
    //对拿到的列表做一个简单的处理
    Userlist.value = res.data.CoachStudentUserInfos.map((v) => {
        return {
            "ID": v.ID,
            "OpenID": v.OpenID,
            "Avatar": v.Avatar,
            "Age": v.Age,
            "Username": v.Username,
            "Phone": v.Phone,
            "RoleName": (v.RoleName == 'student') ? '学员' : (v.RoleName == 'coach') ? '教练' : '其他',
            "Enable": v.Enable,
            "LastLoginTime": v.LastLoginTime,
            "Sex": v.Sex,
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
const ids = ref<string[]>([])



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
        let data: object = {
            ID: currentRow.value.ID,
            OpenID: currentRow.value.OpenID,
            Username: currentRow.value.Username,
            Roleid: formData.RoleName == '学员' ? 4 : 3,
        }
        const res = await updatauserapi(data)
        if (res.code == 200) {
            ElMessage.success('保存成功')

            fetchUserlist()
        } else {
            ElMessage.error('保存失败')
        }
        dialogVisible.value = false
        saveLoading.value = false

    }
}



</script>

<template>
    <div class="flex w-full h-full">

        <ContentWrap class="flex-[3] ml-20px h-full">

            <div class="mb-10px">

                <div class="mb-2 flex items-center text-sm">
                    <el-radio-group @change="changeSelect" v-model="select" class="ml-4">
                        <el-radio value="STUDENT" size="large">学员</el-radio>
                        <el-radio value="COACH" size="large">教练</el-radio>

                    </el-radio-group>
                </div>
            </div>
            <Table height="100%" v-model:current-page="currentPage" v-model:page-size="pageSize"
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
