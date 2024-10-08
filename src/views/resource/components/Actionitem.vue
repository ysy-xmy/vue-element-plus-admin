<script setup lang="ts">
import { ref, reactive, defineProps, PropType } from 'vue'
import { Dialog } from '@/components/Dialog'
import { Form, FormSchema } from '@/components/Form'
import {

    ElMessage,
    ElMessageBox,
    imageEmits,

} from 'element-plus'
import { delAction, updateAction, addAction } from '@/api/resource'
import { useForm } from '@/hooks/web/useForm'
import { defineEmits } from 'vue';
const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

// 定义可以发出的事件

const loading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const actionType = ref('')
interface IPicUrl {
    ID: number;
    URL: string;
}

interface IItem {
    id: number | string;
    title: string;
    orderid: number;
    children: IItem[]; // 假设子项也是IItem类型的数组
    intro: string;
    picurl: IPicUrl[];
    isActive: boolean;
}


const submit = async () => {
    const elForm = await getElFormExpose()
    const valid = await elForm?.validate().catch((err) => {
        console.log(err)
    })
    if (valid) {
        const formData = await getFormData()
        return formData
    }
}



const props = defineProps({
    actionlist: {
        type: Array as PropType<IItem[]>,
        default: () => []
    },
    SecondCategoryID:
    {
        type: Number,
        default: 0
    },

    defaultActive: {
        type: String,
        default: '0'
    }
});

const dialogclose = () => {
    dialogVisible.value = false
}
const formData = reactive({
    Name: '',
    Description: '',
    Videos: [],
    Imgs: [],
    ID: '',
    OrderNum: 0,
    index: 0
})
const action = (type: string, item: any, index: number) => {
    if (type === 'add') {
        dialogTitle.value = '新增动作';
        actionType.value = type;
        dialogVisible.value = true;
        formData.Name = ''
        formData.Description = ''
        formData.Videos = []
        formData.Imgs = []
        formData.ID = ''
    } else if (type === 'edit') {
        dialogTitle.value = '编辑动作';
        actionType.value = type;
        dialogVisible.value = true;
        formData.Name = item.title;
        formData.ID = item.id
        formData.Description = item.intro
        formData.Videos = item.picurl.filter(i => i.URL.includes('video')).map(i => i.URL)
        formData.Imgs = item.picurl.filter(i => i.URL.includes('image')).map(i => i.URL)
        formData.OrderNum = item.orderid
        formData.index = index
    }
};
const saveLoading = ref(false)
const save = async () => {
    saveLoading.value = true
    const inputdata = await submit()
    console.log(inputdata)
    if (actionType.value === 'edit') {

        updateAction({
            ID: inputdata.ID || '',
            Name: inputdata.Name,
            SecondCategoryID: props.SecondCategoryID,
            OrderNum: formData.OrderNum,
        }).then((res) => {
            ElMessage.success('保存成功')
            props.actionlist[formData.index].title = inputdata.Name
            props.actionlist[formData.index].picurl = inputdata.Imgs.map(i => ({ ID: 0, URL: i }))
        }).finally(() => {
            saveLoading.value = false
            dialogVisible.value = false
        })

    }
    else if (actionType.value === 'add') {
        let data = [
            {
                "ActionInfos": {
                    "Name": inputdata.Name,
                    "SecondCategoryID": props.SecondCategoryID,
                    "Description": inputdata.Description,
                    "OrderNum": formData.OrderNum,
                },
                "ActionImgInfos": [
                    {
                        "URL": "http://cdprcqczv.eh/rbxnvx"
                    }
                ],
                "ActionVideoInfos": [
                    {
                        "URL": "http://cdprcqczv.eh/rbxnvx"
                    }
                ],
            },
        ]
        addAction(data

        ).then((res) => {
            console.log(res)
            saveLoading.value = false
            dialogVisible.value = false
            ElMessage.success('保存成功')
            console.log(res.data[0])

        })


    }
}




const schema = reactive<FormSchema[]>([
    {
        field: 'Name',
        component: 'Input',
        label: '名称',
        colProps: {
            span: 24

        },
        componentProps: {
            rules: [
                { required: true, message: '请输入名称' },
                { type: 'string', message: '请输入正确的名称' }
            ]
        }


    },
    {
        field: 'Description',
        component: 'Input',
        label: '描述',
        colProps: {
            span: 24
        },
        componentProps: {
            type: 'textarea',
            autosize: { minRows: 2 } // 可以设置最小行数和最大行数
        }
    },
    {
        field: 'Imgs',
        component: 'Upload',
        value: 'Imgs',
        label: `默认`,
        componentProps: {
            limit: 3,
            action: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',
            fileList: [
                {
                    name: 'element-plus-logo.svg',
                    url: 'https://element-plus.org/images/element-plus-logo.svg'
                },
                {
                    name: 'element-plus-logo2.svg',
                    url: 'https://element-plus.org/images/element-plus-logo.svg'
                }
            ],
            listType: 'picture-card',
            multiple: true,
            onPreview: (uploadFile) => {
                console.log(uploadFile)
            },
            onRemove: (file) => {
                console.log(file)
            },
            beforeRemove: (uploadFile) => {
                return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
                    () => true,
                    () => false
                )
            },
            onExceed: (files, uploadFiles) => {
                ElMessage.warning(
                    `The limit is 3, you selected ${files.length} files this time, add up to ${files.length + uploadFiles.length
                    } totally`
                )
            },
        }

    },


    {
        field: 'Videos',
        component: 'Upload',
        value: 'Videos',
        label: '视频',
        colProps: {
            span: 24
        },
        componentProps: {
            type: 'drag',
            action: '/upload',
            multiple: true,
            listType: 'picture-card',
            fileList: [],
            beforeUpload: (file: any) => {
                console.log(file)
                return false
            },
            onPreview: (file: any) => {
                console.log(file)
            },
            onRemove: (file: any) => {
                console.log(file)
            },
            onChange: (file: any) => {
                console.log(file)
            }
        }

    },

])

const deteleAction = (item: any) => {

    ElMessageBox.confirm('确认删除该动作吗？').then(() => {
        loading.value = true

        delAction([item.id]).then(() => {
            loading.value = false
            ElMessage.success('删除成功')
            props.actionlist.splice(props.actionlist.indexOf(item), 1)
        })
    })
}


</script>

<template>
    <div v-loading="loading" style="flex-wrap: wrap;"
        class="demo-image relative flex wrap justify-space-between w-full  px-8 justify-start items-center">
        <template v-for="(item, index) in props.actionlist" :key="item.id" style="width: 22%"
            class=" flex justify-center items-center w-full flex-wrap p-3 ">
            <div v-if="item.id !== '-1'" class=" flex px-5 my-5 justify-center flex-col items-center">
                <el-image style="width: 100px;height: 100px;margin-top: 10px;"
                    src="https://th.bing.com/th/id/OIP.O6ZIKh-BK0SK9X_aM6GJkgHaHa?rs=1&pid=ImgDetMain" fit="fill" />
                <div class="mt-2 w-full flex flex-col justify-around items-center content-center">

                    <div class="demonstration w-full font-600 text-center my-2">{{ item.title }}</div>

                    <div class='flex w- flex-row mt-1'>
                        <BaseButton @click="action('edit', item, index)" type="primary">
                            编辑
                        </BaseButton>
                        <BaseButton @click="deteleAction(item)" type="danger">
                            删除
                        </BaseButton>
                    </div>
                </div>

            </div>





        </template>

        <div @click="action('add', {})" class="flex justify-center items-center flex-col content-center  "
            style="width:170px;height: 170px;border-width: 1px;border-color: black;border-style: dashed;">

            <Icon size="100" icon="fluent:add-square-48-regular" />
            <span>添加动作</span>

        </div>


        <Dialog height="700" v-model="dialogVisible" @close="dialogclose" :title="dialogTitle">
            <div class="flex w-full h-100% justify-center items-start content-start">
                <Form @register="formRegister" :model="formData" :schema="schema" />

            </div>
            <template #footer>
                <BaseButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
                    保存
                </BaseButton>
                <BaseButton @click="dialogVisible = false">关闭</BaseButton>
            </template>
        </Dialog>


    </div>

</template>
