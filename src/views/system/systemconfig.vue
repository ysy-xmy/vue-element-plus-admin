<template>

    <div class="system-config flex w-full h-full">
        <ContentWrap class="flex-[3] ml-20px  ">
            系统配置
            <div class="w-full h-20px my-20px justify-center flex mx-10 justify-start flex-wrap ">

                <!-- <span class="mt-20px mr-10">SystemName:</span> -->
                <div class="w-4/5 h-full flex justify-start ml-40 mt-10  flex-wrap ">
                    <el-input v-model="systemConfig.SystemName" style="max-width: 600px ;height: 50px;font-size: 20px;"
                        placeholder="请输入">
                        <template #prepend>系统名称</template>
                    </el-input>
                    <div class="w-full my-30px flex  justify-start flex-nowrap">
                        <span style="" class="logotext mt-20px mr-10 ">logo
                        </span>

                        <el-upload class="avatar-uploader w-full mt-10"
                            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                            :show-file-list="false" :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload" :limit='1' :auto-upload="false">
                            <img v-if="imageUrl" :src="imageUrl" width="100px" class="avatar mr-10" />
                            <el-button type="primary" size="big">更换</el-button>
                        </el-upload>

                    </div>
                    <div class="w-full my-30px items-center flex  justify-start flex-nowrap">
                        <span style="" class="logotext mt-20px mr-5 ">系统描述
                        </span>
                        <el-input :autosize="{ minRows: 2, maxRows: 6 }" type="textarea"
                            v-model="systemConfig.SystemDescription"
                            style="max-width: 450px ;height: 50px; font-size: 20px;" placeholder="Please input">
                            <template #prepend>系统描述</template>

                        </el-input>

                    </div>
                    <div class="w-full my-30px items-center flex  justify-start flex-nowrap">

                        <el-input type="number" v-model="systemConfig.CoachSalary"
                            style="max-width: 600px ;height: 50px;font-size: 20px;" placeholder="请输入教练工资">
                            <template #prepend>教练工资</template>

                        </el-input>

                    </div>

                    <div class="w-full my-30px items-center flex     flex-nowrap">
                        <el-button @click="saveConfig" type="primary" size="big">保存</el-button>

                    </div>

                </div>




            </div>


        </ContentWrap>
    </div>

</template>
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { reactive, ref } from 'vue';
import { saveconfig, getconfig } from '@/api/system'

const systemConfig = ref({
    SystemName: '',
    SystemLogo: '',
    SystemDescription: '',
    CoachSalary: '',
})
getconfig().then(res => {
    systemConfig.value = res.data
})

//logo上传
import { ElMessage } from 'element-plus'

import type { UploadProps } from 'element-plus'

const imageUrl = ref('https://element-plus-admin.cn/assets/logo-CRQ9AZN7.png')

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}

const saveConfig = () => {
    saveconfig(systemConfig.value).then(res => {
        ElMessage.success('保存成功')
    })

}


</script>
<style scoped>
.logotext {
    width: 130px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background-color: var(--el-fill-color-light);
    color: var(--el-color-info);
    font-size: 25px;
    max-width: 600px;
    box-shadow: 1px 0 0 0 var(--el-input-border-color) inset, 0 1px 0 0 var(--el-input-border-color) inset, 0 -1px 0 0 var(--el-input-border-color) inset;
}
</style>