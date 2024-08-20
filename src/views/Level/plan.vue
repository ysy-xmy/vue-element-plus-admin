<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElTree } from 'element-plus'
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
import { getlog } from '@/api/log'

const { t } = useI18n()

// 1为学员，2为教练，3为游客

const { tableRegister, tableState, tableMethods } = useTable({
    fetchDataApi: async () => {
        const { pageSize, currentPage } = tableState

        await fetchloglist()

    },
    fetchDelApi: async () => {
        const res = await delGym(unref(ids))
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
        label: '相应',

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
        Type: 'plan'
    }
    const res = await getlog(params).finally(() => {
        loading.value = false
    })
    total.value = res.data.total

    //对拿到的列表做一个简单的处理
    loglist.value = res.data.Logs.map((v) => {
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
            // try {
            //   const res = await addGym(data)
            //   if (res) {
            //     currentPage.value = 1
            //     getList()
            //     fetchloglist()
            //   }
            // } catch (error) {
            //   console.log(error)
            // } finally {
            //   saveLoading.value = false
            //   dialogVisible.value = false
            // }
        }

    }

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
        fetchloglist()
    }




}

</script>

<template>
    <div class="flex w-full h-full">

        <ContentWrap class="flex-[3] ml-20px h-full">

            <div class="mb-10px">
                <!-- <BaseButton type="primary" @click="addgym">新增</BaseButton> -->
                <!-- <BaseButton :loading="delLoading" type="danger" @click="delData(null)">
          {{ t('exampleDemo.del') }}
        </BaseButton> -->

            </div>
            <Table height="100%" v-model:current-page="currentPage" v-model:page-size="pageSize"
                :columns="allSchemas.tableColumns" :data="loglist" :loading="loading" @register="tableRegister"
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
