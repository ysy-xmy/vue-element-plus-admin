<template>
  <div class="system-config flex w-full h-full">
    <ContentWrap class="flex-[3] ml-20px relative flex flex-col">
      系统配置
      <div class="w-full overflow-y-auto flex mx-10 justify-center flex-wrap">
        <div class="w-4/5 h-full flex justify-start ml-40 mt-10 flex-wrap">
          <div class="w-4/5 h-full flex justify-start ml-40 mt-10 flex-wrap">
            <el-input
              v-model="systemConfig.SystemName"
              style=" height: 50px;max-width: 600px; font-size: 20px"
              placeholder="请输入"
            >
              <template #prepend>系统名称</template>
            </el-input>
            <!-- <div class="w-full my-30px flex justify-start flex-nowrap">
              <span style="" class="logotext mt-20px mr-10">logo </span>
              <el-upload
                class="avatar-uploader"
                :data="signature"
                action="https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div> -->
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <span style="" class="logotext mt-20px mr-5">系统描述 </span>
              <el-input
                :autosize="{ minRows: 2, maxRows: 6 }"
                type="textarea"
                v-model="systemConfig.SystemDescription"
                style=" height: 50px;max-width: 450px; font-size: 20px"
                placeholder="Please input"
              >
                <template #prepend>系统描述</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <el-input
                type="number"
                v-model="systemConfig.CoachSalary"
                style=" height: 50px;max-width: 600px; font-size: 20px"
                placeholder="请输入教练工资"
              >
                <template #prepend>教练工资</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <el-input
                type="number"
                v-model="systemConfig.CourseCommissionPercent"
                style=" height: 50px;max-width: 600px; font-size: 20px"
                placeholder="请输入课程佣金百分比"
              >
                <template #prepend>课程佣金百分比</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <el-input
                type="number"
                v-model="systemConfig.CourseDefaultLessonPrice"
                style=" height: 50px;max-width: 600px; font-size: 20px"
                placeholder="请输入默认课程价格"
              >
                <template #prepend>默认课程价格</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <el-input
                type="number"
                v-model="systemConfig.CourseDefaultMonthPrice"
                style=" height: 50px;max-width: 600px; font-size: 20px"
                placeholder="请输入默认月价格"
              >
                <template #prepend>默认月价格</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <el-input
                v-model="systemConfig.CourseDefaultName"
                style=" height: 50px;max-width: 600px; font-size: 20px"
                placeholder="请输入默认课程名称"
              >
                <template #prepend>默认课程名称</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <el-input
                type="number"
                v-model="systemConfig.CourseDefaultQuarterPrice"
                style=" height: 50px;max-width: 600px; font-size: 20px"
                placeholder="请输入默认季度价格"
              >
                <template #prepend>默认季度价格</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <el-input
                type="number"
                v-model="systemConfig.CourseDefaultYearPrice"
                style=" height: 50px;max-width: 600px; font-size: 20px"
                placeholder="请输入默认年价格"
              >
                <template #prepend>默认年价格</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <el-input
                v-model="systemConfig.DefaultWXName"
                style=" height: 50px;max-width: 600px; font-size: 20px"
                placeholder="请输入默认微信名称"
              >
                <template #prepend>默认微信名称</template>
              </el-input>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <span style="" class="logotext mt-20px mr-10">默认微信头像</span>
              <el-upload
                class="avatar-uploader"
                :data="wxSignature"
                action="https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com"
                :show-file-list="false"
                :on-success="handleWXImageSuccess"
                :before-upload="beforeWXImageUpload"
              >
                <img v-if="wxImageUrl" :src="wxImageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
            </div>
            <div class="w-full my-30px items-center flex justify-start flex-nowrap">
              <span style="" class="logotext mt-20px mr-10">视频显示</span>
              <el-switch
                v-model="showVideo"
                active-value="1"
                inactive-value="0"
                @change="handleVideoSwitchChange"
                style="margin-left: 10px"
              />
              <span style="margin-left: 10px; font-size: 16px; color: var(--el-text-color-regular)">
                {{ showVideo === '1' ? '开启' : '关闭' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="fixed-button-container flex justify-end">
        <el-button @click="saveConfig" type="primary" size="large">保存</el-button>
      </div>
    </ContentWrap>
  </div>
</template>
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ref, computed, onMounted } from 'vue'
import { saveconfig, getconfig, getConfigByIdentify, saveOrUpdateConfig } from '@/api/system'

const systemConfig = ref({
  SystemName: '',
  SystemLogo: '',
  SystemDescription: '',
  CoachSalary: '',
  CourseCommissionPercent: '',
  CourseDefaultLessonPrice: '',
  CourseDefaultMonthPrice: '',
  CourseDefaultName: '',
  CourseDefaultQuarterPrice: '',
  CourseDefaultYearPrice: '',
  DefaultWXImg: '',
  DefaultWXName: ''
})

const originalConfig = ref({})

// 视频显示开关
const showVideo = ref('0')

// 获取初始配置
getconfig().then((res) => {
  systemConfig.value = res.data
  originalConfig.value = { ...res.data } // 保存初始配置
})

// 获取视频显示配置
const getVideoConfig = async () => {
  try {
    const res = await getConfigByIdentify('ShowVideo')
    // 确保 res 存在且返回成功，value 是字符串类型的 "0" 或 "1"
    if (res && res.code === 200 && res.data?.value !== undefined) {
      // 确保值是字符串类型
      showVideo.value = String(res.data.value)
    } else {
      // 如果接口返回失败或没有数据，默认设置为 "0"（关闭）
      showVideo.value = '0'
    }
  } catch (error) {
    console.error('获取视频显示配置失败:', error)
    // 出错时默认设置为 "0"（关闭）
    showVideo.value = '0'
  }
}

// 处理视频开关变化
const handleVideoSwitchChange = async (value: string) => {
  // 保存当前值，用于失败时恢复
  const previousValue = showVideo.value
  try {
    // 确保 value 是字符串类型
    const stringValue = String(value)
    const res = await saveOrUpdateConfig([
      {
        Identify: 'ShowVideo',
        Value: stringValue
      }
    ])
    // 确保 res 存在且返回成功
    if (res && res.code === 200) {
      ElMessage.success('视频显示设置已保存')
      showVideo.value = stringValue
    } else {
      ElMessage.error('保存失败，请重试')
      // 恢复原值
      showVideo.value = previousValue
    }
  } catch (error) {
    ElMessage.error('保存时发生错误，请重试')
    console.error(error)
    // 恢复原值
    showVideo.value = previousValue
  }
}

// 组件挂载时获取视频配置
onMounted(() => {
  getVideoConfig()
})

// logo上传
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import axios from '@/axios'

// const imageUrl = ref('https://element-plus-admin.cn/assets/logo-CRQ9AZN7.png')
const wxImageUrl = computed(() => systemConfig.value.DefaultWXImg)

const wxSignature = ref({
  Policy: '',
  OSSAccessKeyId: '',
  Signature: '',
  'x-oss-security-token': '',
  key: ''
})

function getCurrentFormattedDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = ('0' + (now.getMonth() + 1)).slice(-2) // 补零并截取
  const day = ('0' + now.getDate()).slice(-2) // 补零并截取

  return `${year}${month}${day}`
}

const beforeWXImageUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  const isJPG = rawFile.type === 'image/jpeg'
  const isPNG = rawFile.type === 'image/png'
  const isLt2M = rawFile.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('微信图片必须是 JPG 或 PNG 格式！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('微信图片大小不能超过 2MB！')
    return false
  }

  try {
    const { data } = await axios.get({
      url: '/api/user/oss'
    })

    wxSignature.value = {
      Policy: data.PolicyBase64,
      OSSAccessKeyId: data.AccessKeyId,
      Signature: data.Signature,
      'x-oss-security-token': data.SecurityToken,
      key: getCurrentFormattedDate()
    }

    if (!wxSignature.value.OSSAccessKeyId) {
      ElMessage.error('签名的 AccessKeyId 没有获取到，请重试！')
      return false
    }

    return true
  } catch (error) {
    ElMessage.error('获取签名信息失败，请重试！')
    console.error(error)
    return false
  }
}

const handleWXImageSuccess: UploadProps['onSuccess'] = () => {
  const fileUrl = `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${wxSignature.value.key}`
  systemConfig.value.DefaultWXImg = fileUrl // 将生成的 URL 存储到 systemConfig 中
}

const saveConfig = async () => {
  console.log('systemConfig.value:', systemConfig.value)

  const changes: Array<{ Identify: string; Value: any }> = Object.keys(systemConfig.value).reduce(
    (acc, key) => {
      if (systemConfig.value[key] !== originalConfig.value[key]) {
        acc.push({
          Identify: key,
          Value: systemConfig.value[key]
        })
      }
      return acc
    },
    [] as Array<{ Identify: string; Value: any }>
  )

  if (changes.length === 0) {
    ElMessage.info('没有更改需要保存。')
    return
  }

  try {
    const response = await saveconfig(changes)
    if (response.code === 200) {
      ElMessage.success('配置保存成功！')
    } else {
      ElMessage.error('配置保存失败，请重试！')
    }
  } catch (error) {
    ElMessage.error('保存配置时发生错误，请重试！')
    console.error(error)
  }
}
</script>
<style scoped>
.logotext {
  width: 130px;
  height: 50px;
  max-width: 600px;
  font-size: 20px;
  line-height: 50px;
  color: var(--el-color-info);
  text-align: center;
  background-color: var(--el-fill-color-light);
  box-shadow:
    1px 0 0 0 var(--el-input-border-color) inset,
    0 1px 0 0 var(--el-input-border-color) inset,
    0 -1px 0 0 var(--el-input-border-color) inset;
}

.avatar-uploader {
  width: 100px;
  height: 100px;
}

.avatar {
  width: 100px;
  height: 100px;
}

.system-config {
  position: relative;
}

.fixed-button-container {
  z-index: 1000;
  padding-right: 40px;
  padding-bottom: 40px;
  margin-left: auto;
}
</style>
