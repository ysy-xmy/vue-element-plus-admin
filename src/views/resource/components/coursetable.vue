<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElTree } from 'element-plus'
import { saveUserApi, deleteUserByIdApi } from '@/api/department'
import { getGymInfo, addGym, updateGym, delGym } from '@/api/resource'
import type { DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import Write from './Write.vue'
import Detail from './Detail.vue'
import { Dialog } from '@/components/Dialog'
import { convertDateTime } from './utils/convertDateTime'
import { ElTag, ElMessageBox } from 'element-plus'
import type { UserParams } from '@/api/Permission/type'
// import { getRoleListApi } from '@/api/role'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'

const { t } = useI18n()

// 1为学员，2为教练，3为游客

const { tableRegister, tableState, tableMethods } = useTable({
    fetchDataApi: async () => {
        const { pageSize, currentPage } = tableState

        loading.value = true
        let params: UserParams = {
            Page: String(currentPage.value),
            Size: String(pageSize.value),
        }
        const res = await getGymInfo(params).finally(() => {
            loading.value = false
        })
        total.value = res.data.total
        return {
            list: res.data.list || [],
            total: res.data.total || 0
        }
    },
    fetchDelApi: async () => {
        const res = await delGym(unref(ids))
        return !!res
    }
})
const { total, loading, pageSize, currentPage } = tableState
const { getList, getElTableExpose } = tableMethods

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
        field: 'ID',
        label: 'ID',

        search: {
            hidden: true
        },
    },
    {
        field: 'Name',
        label: '名称',


        search: {
            hidden: true
        },
    },
    {
        field: 'Phone',
        label: '电话',

        search: {
            hidden: true
        },
    },


    {
        field: 'Address',
        label: '地址',

        search: {
            hidden: true
        },
    },
    {
        field: 'Website',
        label: '网站',

        search: {
            hidden: true
        },
    },


    {
        field: 'Description',
        label: '描述',

        search: {
            hidden: true
        },
    },
    {
        field: 'Logo',
        label: 'logo',
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
const gymlist = ref([])

const fetchgymlist = async () => {
    currentPage.value = 1
    pageSize.value = 10
    loading.value = true
    let params: UserParams = {
        Page: String(currentPage.value),
        Size: String(pageSize.value),
    }
    const res = await getGymInfo(params)
    loading.value = false

    total.value = res.data.total

    console.log(res.data)


    //对拿到的列表做一个简单的处理
    gymlist.value = res.data.GymInfos.map((v) => {
        return {
            ID: v.ID,
            Name: v.Name,
            Address: v.Address,
            Phone: v.Phone,
            Logo: v.Logo,
            Description: v.Description,
            Website: v.Website,
            CreatedAt: convertDateTime(v.CreatedAt),
        }
    })



    currentNodeKey.value =
        (res.data[0] && res.data[0]?.children && res.data[0].children[0].id) || ''
    await nextTick()
    unref(treeEl)?.setCurrentKey(currentNodeKey.value)
}

fetchgymlist()

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



const delLoading = ref(false)
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
    if (actionType.value === 'add') {

        const write = unref(writeRef)
        const formData = await write?.submit()
        if (formData) {
            saveLoading.value = true
            let data = {
                ID: Number(formData.ID),
                Name: formData.Name,
                Phone: formData.Phone,
                Address: formData.Address,
                Website: formData.Website,
                Description: formData.Description,
                Logo: formData.Logo,
            }
            try {
                const res = await addGym(data)
                if (res) {
                    currentPage.value = 1
                    getList()
                    fetchgymlist()
                }
            } catch (error) {
                console.log(error)
            } finally {
                saveLoading.value = false
                dialogVisible.value = false
            }
        }

    }
    else if (actionType.value === 'edit') {
        const write = unref(writeRef)
        const formData = await write?.submit()
        if (formData) {
            saveLoading.value = true
            let data = {
                ID: Number(formData.ID),
                Name: formData.Name,
                Phone: formData.Phone,
                Address: formData.Address,
                Website: formData.Website,
                Description: formData.Description,
                Logo: formData.Logo,
            }
            try {
                const res = await updateGym(data)
                if (res) {
                    currentPage.value = 1
                    getList()
                    fetchgymlist()
                }
            } catch (error) {
                console.log(error)
            } finally {
                saveLoading.value = false
                dialogVisible.value = false
            }
        }
    }
}
const addgym = () => {
    dialogTitle.value = '新增场馆'
    actionType.value = 'add'
    currentRow.value = { department: unref(treeEl)?.getCurrentNode() || {} }
    dialogVisible.value = true

}
const delData = async (row) => {

    delLoading.value = true

    const elTableExpose = await getElTableExpose()
    ids.value = row
        ? [row.ID]
        : elTableExpose?.getSelectionRows().map((v) => v.ID) || []
    delLoading.value = true

    try {
        const res = await delGym(ids.value)
        if (res) {
            currentPage.value = 1
            getList()
        }
    } catch (error) {
        console.log(error)
    } finally {
        delLoading.value = false
        fetchgymlist()
    }




}

</script>

<template>
    <div class="flex w-full h-full">

        <ContentWrap class="flex-[3] ml-20px h-full">

            <div class="mb-10px">
                <BaseButton type="primary" @click="addgym">新增</BaseButton>
                <BaseButton :loading="delLoading" type="danger" @click="delData(null)">
                    {{ t('exampleDemo.del') }}
                </BaseButton>

            </div>
            <Table height="100%" v-model:current-page="currentPage" :page-size="pageSize"
                :columns="allSchemas.tableColumns" :data="gymlist" :loading="loading" @register="tableRegister"
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
