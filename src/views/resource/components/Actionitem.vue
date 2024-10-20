<script setup lang="ts">
import { ref, reactive, defineProps, PropType } from 'vue';
import { Dialog } from '@/components/Dialog';
import { FormSchema } from '@/components/Form';
import { ElMessage, ElMessageBox } from 'element-plus';
import { delAction, updateAction, addAction } from '@/api/resource';
import { useForm } from '@/hooks/web/useForm';
import { defineEmits } from 'vue';
import { getOss } from '@/api/utils/index';
import ActionDetail from './actionDetail.vue'
import { computed } from 'vue';
const loading = ref(false);
const dialogVisible = ref(false);
const dialogTitle = ref('');
const actionType = ref('');
const saveLoading = ref(false);
const actionId = ref(0);// 用于存储当前操作的 actionId
let uploadKeys: string[] = []; // 用于存储每个文件的 key
const emit = defineEmits(['updataActionlist']);
const { formRegister, formMethods } = useForm();
const { getFormData, getElFormExpose } = formMethods;
const actionDetailRef = ref(null); // 定义 ref 以引用 ActionDetail
interface IPicUrl {
    ID: number;
    URL: string;
}
interface IItem {
    id: number | string;
    title: string;
    orderid: number;
    children: IItem[]; // 假设子项也是 IItem 类型的数组
    intro: string;
    picurl: IPicUrl[];
    isActive: boolean;
}
const props = defineProps({
    actionlist: {
        type: Array as PropType<IItem[]>,
        default: () => []
    },
    SecondCategoryID: {
        type: Number,
        default: 0
    },
    defaultActive: {
        type: String,
        default: '0'
    }
});
const signature = ref({
    Policy: "",
    OSSAccessKeyId: "",
    Signature: "",
    "x-oss-security-token": "",
    key: "",
});
const formData = ref({
    Name: '',
    Description: '',
    Videos: [],
    Imgs: [],
    ID: '',
    OrderNum: 0,
    index: 0,
    videoUrl: '',
});
const imgsList = ref([]);
const videosList = computed(() => {
    return formData.value.Videos;
})
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
        },
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
        label: "图片(最多9张)",
        componentProps: {
            action: 'https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com',
            fileList: imgsList.value,
            limit: 9,
            listType: 'picture-card',
            multiple: true,
            data: signature,
            uploadIcon: 'el-icon-upload',
            onRemove: (file) => {
                formData.value.Imgs.forEach((item, index) => {
                    if (item.includes(file.raw.uid)) {
                        formData.value.Imgs.splice(index, 1);
                    }
                });
            },
            onExceed: (files, uploadFiles) => {
                ElMessage.warning(
                    `限制为9个图片最多，您这次选择了 ${files.length}个文件, 当前总数为 ${files.length + uploadFiles.length
                    } 个`
                )
            },
            beforeRemove: (uploadFile) => {
                return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
                    () => true,
                    () => false
                )
            },
            onSuccess: () => {
                const fileUrl = `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${uploadKeys.shift()}`; // 取出并移除数组中的第一个 key
                formData.value.Imgs.push(fileUrl); // 将生成的 URL 存储到 formData.value.Imgs 中
                console.log(formData.value.Imgs)
            },
            beforeUpload: (file: any) => {
                return new Promise((resolve, reject) => {
                    getOss().then((res) => {
                        const { data } = res;
                        const key = getCurrentFormattedDate() + "/" + file.uid + file.name.substring(file.name.lastIndexOf("."));
                        uploadKeys.push(key); // 存储每个文件的 key
                        signature.value = {
                            Policy: data.PolicyBase64,
                            OSSAccessKeyId: data.AccessKeyId,
                            Signature: data.Signature,
                            "x-oss-security-token": data.SecurityToken,
                            key: key, // 使用当前文件的 key
                        };
                        resolve(true);
                    }).catch((err) => {
                        console.log(err);
                        reject(false);
                    });
                });
            },

        },
    },
    {
        field: 'videoUrl',
        component: 'Input',
        label: '视频链接',
        colProps: {
            span: 24
        },
    },
    {
        field: 'Videos',
        component: 'Upload',
        value: 'Videos',
        label: '视频',
        colProps: {
            span: 36
        },
        componentProps: {
            type: 'drag',
            action: 'https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com', // 替换为您的上传地址
            multiple: false, // 只允许上传一个视频
            listType: 'picture-card',
            fileList: videosList.value,
            limit: 2,
            data: signature, // 需要添加数据
            beforeUpload: (file: any) => {
                if (formData.value.Videos.length > 0) {
                    ElMessage.error('只能上传一个视频,请先删除原有视频');
                    return false;
                }
                if (file.type !== 'video/mp4') {
                    ElMessage.error('格式不支持,请选择mp4格式的视频')
                    return false
                }
                return new Promise((resolve, reject) => {
                    getOss().then((res) => {
                        const { data } = res;
                        // 生成唯一的 key
                        const key = getCurrentFormattedDate() + "/" + file.uid + file.name.substring(file.name.lastIndexOf("."));
                        uploadKeys.push(key); // 存储视频文件的 key
                        signature.value = {
                            Policy: data.PolicyBase64,
                            OSSAccessKeyId: data.AccessKeyId,
                            Signature: data.Signature,
                            "x-oss-security-token": data.SecurityToken,
                            key: key // 使用当前视频文件的 key
                        };
                        resolve(true);
                    }).catch((err) => {
                        console.log(err);
                        reject(false);
                    });
                });
            },
            onSuccess: () => {
                // 构建视频的 URL
                formData.value.Videos = []
                const fileUrl = `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${uploadKeys.shift()}`;
                formData.value.Videos = [fileUrl]; // 替换之前的视频 URL
            },
            onRemove: (file: any) => {
                // 清空 formData.value.Videos
                formData.value.Videos = []; // 移除视频 URL
            },
            onPreview: (file: any) => {

            },
        }
    }
])

const action = (type: string, item: any, index: number) => {
    // initializeFormData(type, item, index);
    actionType.value = type;
    if (type === 'add') {
    } else {
        console.log(item.id)
        actionId.value = item.id
    }
    if (actionDetailRef.value) {
        actionDetailRef.value.dialogOpen() // 打开 actionDetail 组件
    }
};
const submit = async () => {
    const elForm = await getElFormExpose();
    const valid = await elForm?.validate().catch((err) => {
        console.log(err);
    });
    if (valid) {
        return await getFormData();
    }
}

const save = async () => {
    saveLoading.value = true;
    const inputdata = await submit();
    if (actionType.value === 'edit') {
        if (inputdata.videoUrl) {
            formData.value.Videos = [inputdata.videoUrl];
        }
        updateAction({
            ActionInfos: {
                ID: formData.value.ID,
                Name: inputdata.Name,
                OrderNum: formData.value.OrderNum,
                Description: inputdata.Description,
            },
            ActionImgInfos: formData.value.Imgs.map((item) => {
                return {
                    URL: item
                }
            }),
            ActionVideoInfos: formData.value.Videos.map((item) => {
                return {
                    URL: item
                }
            }),
        }
        ).then((res) => {
            ElMessage.success('保存成功');
            emit('updataActionlist', props.SecondCategoryID);
        }).finally(() => {
            saveLoading.value = false;
            dialogVisible.value = false;
        });
    } else if (actionType.value === 'add') {
        let data = [
            {
                "ActionInfos": {
                    "Name": inputdata.Name,
                    "SecondCategoryID": props.SecondCategoryID,
                    "Description": inputdata.Description,
                    "OrderNum": formData.value.OrderNum,
                },
                "ActionImgInfos": inputdata.Imgs.map((item) => {
                    return {
                        URL: item
                    }
                }),
                "ActionVideoInfos": inputdata.Videos.map((item) => {
                    return {
                        URL: item
                    }
                }),
            },
        ];
        addAction(data).then((res) => {
            console.log(res);
            saveLoading.value = false;
            dialogVisible.value = false;
            ElMessage.success('保存成功');
            emit('updataActionlist', props.SecondCategoryID);
        });
    }
};
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
const getCurrentFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2); // 补零并截取
    const day = ("0" + now.getDate()).slice(-2); // 补零并截取

    return `${year}${month}${day}`;
}

const initializeFormData = (type, item = {}, index) => {
    if (type === 'add') {
        dialogTitle.value = '新增动作';
        actionType.value = type;
        dialogVisible.value = true;
        formData.value.Name = '';
        formData.value.Description = '';
        formData.value.Videos = [];
        formData.value.Imgs = [];
        formData.value.ID = '';
    } else if (type === 'edit') {
        dialogTitle.value = '编辑动作';
        actionType.value = type;
        dialogVisible.value = true;
        formData.value.Name = item.title;
        formData.value.ID = item.id;
        formData.value.Description = item.intro;
        formData.value.Videos = item.videos ? item.videos.map(i => i.URL) : [];
        formData.value.Imgs = item.picurl ? item.picurl.map(i => i.URL) : [];
        formData.value.OrderNum = item.orderid;
        formData.value.index = index;
    }
    imgsList.value = formData.value.Imgs.map((item) => {
        return {
            name: item.split('/').pop(),
            url: item,
        }
    })
    console.log(imgsList.value)

}
const updataActionlist = (SecondCategoryID: number) => {
    emit('updataActionlist', SecondCategoryID)
}


</script>

<template>
    <div v-loading="loading" style="flex-wrap: wrap;"
        class="demo-image relative flex wrap justify-space-between w-full  px-8 justify-start items-center">
        <template v-for="(item, index) in props.actionlist" :key="item.id" style="width: 22%"
            class=" flex justify-center items-center w-full flex-wrap p-3 ">
            <div v-if="item.id !== '-1'" class=" flex px-5 my-5 justify-center flex-col items-center">
                <img v-if="item.picurl" :src="item.picurl[0].URL" style="width: 100px;height: 100px;margin-top: 10px;">
                </img>
                <el-image v-else style="width: 100px;height: 100px;margin-top: 10px;"
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

        <div @click="action('add')" class="flex justify-center items-center flex-col content-center  "
            style="width:170px;height: 170px;border-width: 1px;border-color: black;border-style: dashed;">
            <Icon size="100" icon="fluent:add-square-48-regular" />
            <span>添加动作</span>
        </div>


        <!-- <Dialog :v-if="signature.OSSAccessKeyId !== ''" height="700" v-model="dialogVisible" @close="dialogclose"
            :title="dialogTitle">
            <div class="flex w-full h-100% justify-center items-start content-start">
                <Form @register="formRegister" :model="formData" :schema="schema" />
            </div>
            <template #footer>
                <BaseButton v-if="actionType !== 'detail'" type="primary" :loading="saveLoading" @click="save">
                    保存
                </BaseButton>
                <BaseButton @click="dialogVisible = false">关闭</BaseButton>
            </template>
        </Dialog> -->
        <ActionDetail ref="actionDetailRef" @closeDialog="updataActionlist(props.SecondCategoryID)"
            :SecondCategoryID="props.SecondCategoryID" :actionId="actionId" :actionType="actionType" />
    </div>

</template>
