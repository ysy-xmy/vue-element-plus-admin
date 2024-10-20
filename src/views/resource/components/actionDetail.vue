<template>
    
    <Dialog  height="700" v-model="dialogVisible" @close="dialogclose" :title="dialogTitle">
        <el-container style='display: flex;flex-direction: column' v-loading="dialoading" class="flex w-full h-100%  flex-col">
            <Form @register="formRegister" :model="formData" :schema="schema" />
            <div style="display: flex;justify-content: center;align-items: center;height: 100%;" class="w-full">

                <video v-if="formData.Videos.length > 0" 
                controls 
                width="600" 
                height="400"
                :src="formData.Videos[0]" 
                >
                您的浏览器不支持视频标签。
            </video>
            </div>
           
        </el-container>
        <template #footer>
            <BaseButton @click="dialogVisible = false">关闭</BaseButton>
            <BaseButton type="primary" :loading="saveLoading" @click="save">
                保存
            </BaseButton>
        </template>
    </Dialog>
    <el-dialog width="60%" v-model="predialogVisible">
    <img width="100%" height="60%" :src="dialogImageUrl" alt="预览 图片" />
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref,defineEmits } from 'vue'
//@ts-ignore
import { Dialog } from '@/components/Dialog';
import { Form, FormSchema } from '@/components/Form';
import { useForm } from '@/hooks/web/useForm';
import { getOss } from '@/api/utils/index';
import { ElMessage, ElMessageBox } from 'element-plus';
import {getationDetail} from '@/api/resource/index';
import {  updateAction, addAction } from '@/api/resource';
const emit = defineEmits(['updataActionlist','closeDialog']);
const { formRegister, formMethods } = useForm();
const {
  setProps,
  delSchema,
  addSchema,
  setValues,
  setSchema,
  getComponentExpose,
  getFormItemExpose,
  getElFormExpose,
  getFormData
} = formMethods
const dialogVisible = ref(false)//控制弹窗显示隐藏
const dialogTitle = ref('动作详情')//弹窗标题
const dialoading = ref(false)//弹窗loading
const saveLoading = ref(false)//保存loading
const uploadKeys = ref<string[]>([]);//上传文件key
const signature = ref({
    Policy: "",
    OSSAccessKeyId: "",
    Signature: "",
    "x-oss-security-token": "",
    key: "",
});//上传签名
const formData = ref({
    Name: '',
    Description: '',
    Videos: [],
    Imgs: Array<string>(),
    ID: '',
    OrderNum: 0,
    index: 0,
    videoUrl: '',
});
type img ={
    name: string,
    url: string
}
type video ={
    name: string,
    url: string
}
const dialogImageUrl = ref('')
const predialogVisible = ref(false)

const imgList =ref<img[]>([])
const videoList=ref<video[]>([])
const props = defineProps({
    actionId: {
        type: Number,
        required: true
    },
    actionType: {
        type: String,
        required: false,
        default: 'edit'
    },
    SecondCategoryID:{
        type: Number,
        required: false,
        default: 0
    }
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
            fileList: imgList,
            limit: 9,
            listType: 'picture-card',
            multiple: true,
            data: signature,
            uploadIcon: 'el-icon-upload',
            onRemove: (file) => {
                formData.value.Imgs.forEach((item, index) => {
                    if (item.includes(file.name)) {
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
                return ElMessageBox.confirm(`取消上传 ${uploadFile.name} ?`).then(
                    () => true,
                    () => false
                )
            },
            onPreview: (uploadFile) => {
                dialogImageUrl.value = uploadFile.url!
                predialogVisible.value = true
            },
            onSuccess: () => {
                const fileUrl = `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${uploadKeys.value.shift()}`; // 取出并移除数组中的第一个 key
                formData.value.Imgs.push(fileUrl); // 将生成的 URL 存储到 formData.value.Imgs 中
                console.log(formData.value.Imgs)
            },
            beforeUpload: (file: any) => {
                return new Promise((resolve, reject) => {
                    getOss().then((res) => {
                        const { data } = res;
                        const key = getCurrentFormattedDate() + "/" + file.uid + file.name.substring(file.name.lastIndexOf("."));
                        uploadKeys.value.push(key); // 存储每个文件的 key
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
            fileList: videoList,
            limit: 2,
            showFileList: false,
            data: signature, // 需要添加数据
            beforeUpload: (file: any) => {
                console.log(file.type)
                if (file.type !== 'video/mp4') {
                    ElMessage.error('格式不支持,请选择mp4格式的视频')
                    return false
                
                }
                return new Promise((resolve, reject) => {
                    getOss().then((res) => {
                        const { data } = res;
                        // 生成唯一的 key
                        const key = getCurrentFormattedDate() + "/" + file.uid + file.name.substring(file.name.lastIndexOf("."));
                        uploadKeys.value.push(key); // 存储视频文件的 key
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
            onRemove: (file) => {
                formData.value.Videos.forEach((item, index) => {
                    if (item.includes(file.name)) {
                        formData.value.Videos.splice(index, 1);
                    }
                });
            },
            onPreview: (uploadFile) => {
                console.log(uploadFile)
            },
            onSuccess: () => {
                // 构建视频的 URL
                formData.value.Videos = []
                const fileUrl = `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${uploadKeys.value.shift()}`;
                formData.value.Videos = [fileUrl]; // 替换之前的视频 URL
            },


        }
    }
])
// 获取当前时间：
const getCurrentFormattedDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2); // 补零并截取
    const day = ("0" + now.getDate()).slice(-2); // 补零并截取

    return `${year}${month}${day}`;
}
const dialogclose = () => {
    dialogVisible.value = false
}
const dialogOpen = () => {
    dialogVisible.value = true
    setTimeout(() => {
        loadDada()//获取加载数据
    },200);
    
}
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
    if (props.actionType === 'edit') {
        console.log(formData.value.Videos)
        console.log(inputdata.videoUrl)
        if (inputdata.videoUrl!==undefined) {
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
            emit('closeDialog');
        }).finally(() => {
            saveLoading.value = false;
            dialogVisible.value = false;
        });
    } else if (props.actionType === 'add') {
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



const loadDada = ()=>{
    dialoading.value = true
    if (props.actionType === 'edit'){
        getationDetail(props.actionId).then((res) => {
            formData.value.ID = res.data.ActionInfos.ID
            formData.value.Name = res.data.ActionInfos.Name
            formData.value.Description = res.data.ActionInfos.Description
            formData.value.Imgs = res.data.ActionImgInfos.map(item=>{
                return item.URL
            })
            formData.value.Videos = res.data.ActionVideoInfos.map(item=>{
                return item.URL
            })
            imgList.value=formData.value.Imgs.map(item=>{
                return {
                    name: item.split('/').pop(),
                    url: item,
                }
            })
            videoList.value=formData.value.Videos.map(item=>{
                return {
                    name: item.split('/').pop(),
                    url: item,
                }
            })
            console.log(videoList.value)
            console.log(formData.value.Videos)
            setValues(formData.value)

            dialoading.value = false
    })
    }

}
//暴露出去给外面调用方法
defineExpose({
    dialogOpen,
    dialogclose,
    loadDada
});
</script>
<!-- 动作detaildialog组件 -->
<!-- 数据，状态，ui -->
<!-- 数据获取方式：根据actionid来获取，状态有两种，编辑和查看，显示和隐藏，暴露出去给外面调用方法来控制 -->
<!-- 数据更新方式：保存，关闭，这个自己发请求保存，关闭弹窗 -->