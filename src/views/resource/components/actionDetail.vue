<template>
  <Dialog
    width="80%"
    height="90vh"
    v-model="dialogVisible"
    @close="dialogclose"
    :title="dialogTitle"
    class="action-detail-dialog"
  >
    <el-container v-loading="dialoading" class="bg-white h-full">
      <!-- 主体内容区域 -->
      <el-container class="flex-1 min-h-0">
        <!-- 左侧媒体区域 -->
        <el-aside width="40%" class="border-r border-gray-200">
          <el-scrollbar height="calc(90vh - 120px)" class="media-scroll">
            <div class="p-6">
              <!-- 媒体预览区域 -->
              <div class="mb-6">
                <h3 class="text-lg font-medium mb-6 flex items-center text-gray-800">
                  <el-icon class="mr-2 text-blue-500"><VideoPlay /></el-icon>
                  媒体预览
                </h3>

                <!-- 视频预览区块 -->
                <div class="mb-8 bg-gray-50 rounded-lg p-5">
                  <h4 class="text-base font-medium mb-3 flex items-center text-gray-700">
                    <el-icon class="mr-2"><Video /></el-icon>
                    视频预览
                  </h4>
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <video v-if="formData.Videos.length > 0" controls class="w-full rounded-lg">
                      <source
                        v-for="video in formData.Videos"
                        :key="video"
                        :src="video"
                        type="video/mp4"
                      />
                      您的浏览器不支持视频标签。
                    </video>
                    <el-empty v-else description="暂无视频" />
                  </div>
                </div>

                <!-- 图片预览区块 -->
                <div class="bg-gray-50 rounded-lg p-5">
                  <h4 class="text-base font-medium mb-3 flex items-center text-gray-700">
                    <el-icon class="mr-2"><Picture /></el-icon>
                    图片预览
                  </h4>
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <div v-if="formData.Imgs.length > 0" class="grid grid-cols-3 gap-4">
                      <div
                        v-for="img in formData.Imgs"
                        :key="img"
                        class="relative group cursor-pointer"
                        @click="previewImage(img)"
                      >
                        <el-image
                          :src="img"
                          fit="contain"
                          class="w-full h-40 rounded-lg object-contain"
                        />
                        <div
                          class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                        >
                          <el-icon class="text-white text-xl"><ZoomIn /></el-icon>
                        </div>
                      </div>
                    </div>
                    <el-empty v-else description="暂无图片" />
                  </div>
                </div>
              </div>

              <!-- 分割线 -->
              <div class="my-8 flex items-center">
                <div class="flex-grow border-t border-gray-200"></div>
                <span class="px-4 text-sm text-gray-500">媒体编辑</span>
                <div class="flex-grow border-t border-gray-200"></div>
              </div>

              <!-- 媒体上传区域 -->
              <div>
                <h3 class="text-lg font-medium mb-6 flex items-center text-gray-800">
                  <el-icon class="mr-2 text-green-500"><Upload /></el-icon>
                  媒体上传
                </h3>

                <!-- 视频上传区块 -->
                <div class="mb-8 bg-gray-50 rounded-lg p-5">
                  <h4 class="text-base font-medium mb-3 flex items-center text-gray-700">
                    <el-icon class="mr-2"><VideoCamera /></el-icon>
                    视频上传
                  </h4>
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <Form
                      @register="formRegister"
                      :model="formData"
                      :schema="mediaSchema"
                      class="form-container"
                    />
                  </div>
                </div>

                <!-- 图片上传区块 -->
                <div class="bg-gray-50 rounded-lg p-5">
                  <h4 class="text-base font-medium mb-3 flex items-center text-gray-700">
                    <el-icon class="mr-2"><PictureFilled /></el-icon>
                    图片上传
                  </h4>
                  <div class="bg-white rounded-lg p-4 shadow-sm">
                    <Form
                      @register="formRegister"
                      :model="formData"
                      :schema="imageSchema"
                      class="form-container"
                    />
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-aside>

        <!-- 右侧表单区域 -->
        <el-main class="!p-0">
          <el-scrollbar height="calc(90vh - 120px)" class="form-scroll">
            <div class="p-6 space-y-8">
              <!-- 基本信息 -->
              <div>
                <h3 class="text-lg font-medium mb-6 flex items-center text-gray-800">
                  <el-icon class="mr-2 text-blue-500"><InfoFilled /></el-icon>
                  基本信息
                </h3>
                <el-form :model="formData" label-position="top" class="space-y-4">
                  <el-form-item label="名称" prop="Name" class="mb-6">
                    <el-input
                      v-model="formData.Name"
                      placeholder="请输入动作名称"
                      class="!max-w-xl"
                    />
                  </el-form-item>
                  <el-form-item label="描述" prop="Description" class="mb-6">
                    <el-input
                      v-model="formData.Description"
                      type="textarea"
                      :rows="4"
                      maxlength="80"
                      show-word-limit
                      placeholder="请输入动作描述（最多80字）"
                      class="!max-w-2xl"
                    />
                  </el-form-item>
                </el-form>
              </div>

              <!-- 准备工作 -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-medium mb-6 flex items-center text-gray-800">
                  <el-icon class="mr-2 text-orange-500"><Tools /></el-icon>
                  准备工作
                </h3>
                <Form
                  @register="formRegister"
                  :model="formData"
                  :schema="readyWorkSchema"
                  class="form-container"
                />
              </div>

              <!-- 步骤说明 -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-medium mb-6 flex items-center text-gray-800">
                  <el-icon class="mr-2 text-purple-500"><List /></el-icon>
                  步骤说明
                </h3>
                <Form
                  @register="formRegister"
                  :model="formData"
                  :schema="stepSchema"
                  class="form-container"
                />
              </div>

              <!-- 注意事项 -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-medium mb-6 flex items-center text-gray-800">
                  <el-icon class="mr-2 text-red-500"><Warning /></el-icon>
                  注意事项
                </h3>
                <Form
                  @register="formRegister"
                  :model="formData"
                  :schema="attentionSchema"
                  class="form-container"
                />
              </div>
            </div>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>

    <!-- 使用具名插槽 footer -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="dialogclose">取消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="save">保存</el-button>
      </div>
    </template>
  </Dialog>

  <!-- 图片预览弹窗 -->
  <el-dialog
    v-model="predialogVisible"
    width="60%"
    :append-to-body="true"
    :show-close="true"
    class="preview-dialog"
  >
    <div class="flex items-center justify-center">
      <img :src="dialogImageUrl" class="max-w-full max-h-[70vh]" />
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, defineEmits, nextTick, computed } from 'vue'
//@ts-ignore
import { Dialog } from '@/components/Dialog'
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { getOss } from '@/api/utils/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getationDetail } from '@/api/resource/index'
import { updateAction, addAction } from '@/api/resource'
import Mavon from './mavon.vue'
const emit = defineEmits(['updataActionlist', 'closeDialog'])
const { formRegister, formMethods } = useForm()
const { setValues, getElFormExpose, getFormData } = formMethods
const dialogVisible = ref(false) //控制弹窗显示隐藏
const dialogTitle = ref('动作详情') //弹窗标题
const dialoading = ref(false) //弹窗loading
const saveLoading = ref(false) //保存loading
const uploadKeys = ref<string[]>([]) //上传文件key
const signature = ref({
  Policy: '',
  OSSAccessKeyId: '',
  Signature: '',
  'x-oss-security-token': '',
  key: ''
}) //上传签名
const formData = ref<{
  Name: string
  Description: string
  Videos: string[]
  Imgs: string[]
  ID: number
  OrderNum: number
  index: number
  videoUrl: string
  Step: string
  ReadyWorkContent: string
  Attention: string
}>({
  Name: '',
  Description: '',
  Videos: [],
  Imgs: [],
  ID: 0,
  OrderNum: 0,
  index: 0,
  videoUrl: '',
  Step: '',
  ReadyWorkContent: '',
  Attention: ''
})
type img = {
  name: string
  url: string
}
type videoType = {
  name: string
  url: string
}
const dialogImageUrl = ref('')
const predialogVisible = ref(false)

const imgList = ref<img[]>([])
const videoList = ref<videoType[]>([])
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
  secondCategoryId: {
    type: Number,
    required: false,
    default: 0
  }
})
const mediaSchema = reactive<FormSchema[]>([
  {
    field: 'videoUrl',
    component: 'Input',
    label: '视频链接',
    colProps: { span: 24 }
  },
  {
    field: 'Videos',
    component: 'Upload',
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
          getOss()
            .then((res) => {
              const { data } = res
              // 生成唯一的 key
              const key =
                getCurrentFormattedDate() +
                '/' +
                file.uid +
                file.name.substring(file.name.lastIndexOf('.'))
              uploadKeys.value.push(key) // 存储视频文件的 key
              signature.value = {
                Policy: data.PolicyBase64,
                OSSAccessKeyId: data.AccessKeyId,
                Signature: data.Signature,
                'x-oss-security-token': data.SecurityToken,
                key: key // 使用当前视频文件的 key
              }
              resolve(true)
            })
            .catch((err) => {
              console.log(err)
              reject(false)
            })
        })
      },
      onRemove: (file) => {
        formData.value.Videos.forEach((item, index) => {
          if (item.includes(file.name)) {
            formData.value.Videos.splice(index, 1)
          }
        })
      },
      onPreview: (uploadFile) => {
        console.log(uploadFile)
      },
      onSuccess: () => {
        const fileUrl = `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${uploadKeys.value.shift()}`
        formData.value.Videos = [fileUrl] // 只更新视频数组
      }
    }
  }
])

const imageSchema = reactive<FormSchema[]>([
  {
    field: 'Imgs',
    component: 'Upload',
    label: '图片(最多9张)',
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
            formData.value.Imgs.splice(index, 1)
          }
        })
      },
      onExceed: (files, uploadFiles) => {
        ElMessage.warning(
          `限制为9个图片最多，您这次选择了 ${files.length}个文件, 当前总数为 ${
            files.length + uploadFiles.length
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
        const fileUrl = `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${uploadKeys.value.shift()}` // 取出并移除数组中的第一个 key
        formData.value.Imgs.push(fileUrl) // 将生成的 URL 存储到 formData.value.Imgs 中
        console.log(formData.value.Imgs)
      },
      beforeUpload: (file: any) => {
        return new Promise((resolve, reject) => {
          getOss()
            .then((res) => {
              const { data } = res
              const key =
                getCurrentFormattedDate() +
                '/' +
                file.uid +
                file.name.substring(file.name.lastIndexOf('.'))
              uploadKeys.value.push(key) // 存储每个文件的 key
              signature.value = {
                Policy: data.PolicyBase64,
                OSSAccessKeyId: data.AccessKeyId,
                Signature: data.Signature,
                'x-oss-security-token': data.SecurityToken,
                key: key // 使用当前文件的 key
              }
              resolve(true)
            })
            .catch((err) => {
              console.log(err)
              reject(false)
            })
        })
      }
    }
  }
])

const readyWorkSchema = reactive<FormSchema[]>([
  {
    field: 'ReadyWorkContent',
    component: 'Editor',
    label: '准备工作内容',
    colProps: { span: 24 },
    componentProps: {
      height: '200px'
    }
  }
])

const stepSchema = reactive<FormSchema[]>([
  {
    field: 'Step',
    component: 'Editor',
    label: '步骤内容',
    colProps: { span: 24 },
    componentProps: {
      height: '200px'
    }
  }
])

const attentionSchema = reactive<FormSchema[]>([
  {
    field: 'Attention',
    component: 'Editor',
    label: '注意事项内容',
    colProps: { span: 24 },
    componentProps: {
      height: '200px'
    }
  }
])

// 获取当前时间：
const getCurrentFormattedDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = ('0' + (now.getMonth() + 1)).slice(-2) // 补零并截取
  const day = ('0' + now.getDate()).slice(-2) // 补零并截取

  return `${year}${month}${day}`
}
const dialogclose = () => {
  dialogVisible.value = false
}
const dialogOpen = () => {
  dialogVisible.value = true
  // 重置表单数据
  formData.value = {
    Name: '',
    Description: '',
    Videos: [],
    Imgs: [],
    ID: 0,
    OrderNum: 0,
    index: 0,
    videoUrl: '',
    Step: '',
    ReadyWorkContent: '',
    Attention: ''
  }
  imgList.value = []
  videoList.value = []
  uploadKeys.value = []

  // 使用 setTimeout 确保 DOM 更新后再加载数据
  setTimeout(() => {
    if (props.actionType === 'edit') {
      loadDada()
    }
  }, 200)
}
const save = async () => {
  saveLoading.value = true
  try {
    // 直接使用 formData.value 的值，不再等待 submit
    if (props.actionType === 'edit') {
      await updateAction({
        ActionInfos: {
          ID: formData.value.ID,
          Name: formData.value.Name,
          OrderNum: formData.value.OrderNum,
          Description: formData.value.Description,
          Step: formData.value.Step,
          ReadyWorkContent: formData.value.ReadyWorkContent,
          Attention: formData.value.Attention
        },
        ActionImgInfos: formData.value.Imgs.map((item) => ({
          URL: item
        })),
        ActionVideoInfos: formData.value.Videos.map((item) => ({
          URL: item
        }))
      })

      ElMessage.success('保存成功')
      emit('closeDialog')
      dialogVisible.value = false
    } else if (props.actionType === 'add') {
      const data = [
        {
          ActionInfos: {
            Name: formData.value.Name,
            SecondCategoryID: props.secondCategoryId,
            OrderNum: formData.value.OrderNum,
            Description: formData.value.Description,
            Step: formData.value.Step,
            ReadyWorkContent: formData.value.ReadyWorkContent,
            Attention: formData.value.Attention
          },
          ActionImgInfos: formData.value.Imgs.map((item) => ({
            URL: item
          })),
          ActionVideoInfos: formData.value.Videos.map((item) => ({
            URL: item
          }))
        }
      ]

      await addAction(data)
      ElMessage.success('保存成功')
      emit('closeDialog')
      dialogVisible.value = false
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saveLoading.value = false
  }
}

const loadDada = () => {
  dialoading.value = true
  if (props.actionType === 'edit') {
    getationDetail(String(props.actionId))
      .then((res) => {
        const { ActionInfos, ActionImgInfos, ActionVideoInfos } = res.data

        formData.value = {
          ...formData.value,
          ID: ActionInfos.ID,
          Name: ActionInfos.Name,
          OrderNum: ActionInfos.OrderNum,
          Description: ActionInfos.Description || '',
          Step: ActionInfos.Step || '',
          ReadyWorkContent: ActionInfos.ReadyWorkContent || '',
          Attention: ActionInfos.Attention || '',
          Imgs: ActionImgInfos ? ActionImgInfos.map((item) => item.URL) : [],
          Videos: ActionVideoInfos ? ActionVideoInfos.map((item) => item.URL) : []
        }

        // 更新上传组件的文件列表
        imgList.value = formData.value.Imgs.map((item) => ({
          name: item.split('/').pop() || item,
          url: item
        }))

        videoList.value = formData.value.Videos.map((item) => ({
          name: item.split('/').pop() || item,
          url: item
        }))

        // 设置表单值
        setValues(formData.value)
      })
      .finally(() => {
        dialoading.value = false
      })
  }
}
//暴露出去给外面调用方法
defineExpose({
  dialogOpen,
  dialogclose,
  loadDada
})

// 新增图片预览方法
const previewImage = (url: string) => {
  dialogImageUrl.value = url
  predialogVisible.value = true
}
</script>

<style scoped>
/* 简化样式 */
.form-container :deep(.el-form-item) {
  margin-bottom: 1.5rem;
}

.form-container :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-container :deep(.el-input__wrapper),
.form-container :deep(.el-textarea__wrapper) {
  box-shadow: none;
  border: 1px solid #e5e7eb;
}

.form-container :deep(.el-input__wrapper:hover),
.form-container :deep(.el-textarea__wrapper:hover) {
  border-color: #60a5fa;
}

.form-container :deep(.el-input__wrapper.is-focus),
.form-container :deep(.el-textarea__wrapper.is-focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* 编辑器样式 */
.form-container :deep(.editor-container) {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
}

/* 上传组件样式 */
.media-scroll :deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
  line-height: 100px;
  margin: 0 8px 8px 0;
}

.media-scroll :deep(.el-upload-dragger) {
  width: 100%;
  height: 120px;
  border: 2px dashed #e5e7eb;
}

.media-scroll :deep(.el-upload-dragger:hover) {
  border-color: var(--el-color-primary);
}

.media-scroll :deep(.el-empty) {
  padding: 20px 0;
}

/* 视频播放器样式 */
video {
  max-height: 300px;
  width: 100%;
  object-fit: contain;
  background: #000;
}

/* 图片网格优化 */
.grid-cols-3 > div {
  aspect-ratio: 1;
  overflow: hidden;
}

/* 区块样式 */
.bg-gray-50 {
  background-color: #f9fafb;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* 添加新样式 */
:deep(.action-detail-dialog .el-dialog) {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

:deep(.action-detail-dialog .el-dialog__body) {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

/* 全屏时的样式 */
:deep(.action-detail-dialog.is-fullscreen) {
  overflow: hidden;
}

:deep(.action-detail-dialog.is-fullscreen .el-dialog) {
  width: 100% !important;
  height: 100% !important;
  top: 0;
  left: 0;
  transform: none;
}

/* 调整滚动区域高度 */
.el-scrollbar {
  height: calc(100vh - 180px) !important;
}

/* 全屏时调整滚动区域高度 */
:deep(.action-detail-dialog.is-fullscreen) .el-scrollbar {
  height: calc(100vh - 120px) !important;
}
</style>
<!-- 动作detaildialog组件 -->
<!-- 数据，状态，ui -->
<!-- 数据获取方式：根据actionid来获取，状态有两种，编辑和查看，显示和隐藏，暴露出去给外面调用方法来控制 -->
<!-- 数据更新方式：保存，关闭，这个自己发请求保存，关闭弹窗 -->
