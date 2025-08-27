<template>
  <ContentWrap>
    <h1>发送邮件</h1>
    <el-form :model="form" label-width="80px" style="max-width: 600px">
      <el-form-item label="收件人">
        <el-select
          v-model="form.recipients"
          multiple
          filterable
          placeholder="请选择收件人"
          style="width: 100%"
          @clear="onClearRecipients"
          clearable
        >
          <el-option
            style="height: 80px; display: flex; justify-content: center; align-items: center"
            v-for="user in userList"
            :key="user.id"
            :value="user.id"
            :label="user.name"
          >
            <div class="user-option">
              <span class="user-avatar"
                ><img class="user-pic" :src="user.avatar" />
                <span class="user-name">{{ user.name }}</span>
                <span class="user-id">(ID:{{ user.id }})</span>
              </span>
              <div>
                <span class="user-type" :class="user.type === 'coach' ? 'coach' : 'student'">
                  {{ user.type === 'coach' ? '教练' : '学员' }}
                </span>
                <img
                  v-if="user.sex === 0"
                  src="https://img.icons8.com/?size=100&id=FJYY0yLCis6f&format=png&color=000000"
                  alt="男"
                  class="icon-identity"
                />
                <img
                  v-else
                  src="https://img.icons8.com/?size=100&id=21656&format=png&color=000000"
                  alt="学员"
                  class="icon-identity"
                />
              </div>
            </div>
          </el-option>
        </el-select>
        <div style="margin-top: 8px">
          <el-button size="small" @click="selectAll('student')">全部学员</el-button>
          <el-button size="small" @click="selectAll('coach')">全部教练</el-button>
        </div>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="form.subject" placeholder="请输入邮件标题" />
      </el-form-item>
      <el-form-item label="内容">
        <el-input type="textarea" v-model="form.content" :rows="6" placeholder="请输入邮件内容" />
      </el-form-item>
      <el-form-item>
        <div class="send-btn-wrapper">
          <el-button type="primary" @click="sendMail">发送</el-button>
        </div>
      </el-form-item>
    </el-form>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ContentWrap } from '@/components/ContentWrap'
import { createNotifier } from '@/api/notice'
import { getuserlistApi } from '@/api/Permission'

const userList = ref<any[]>([])

const form = ref({
  recipients: [] as number[],
  subject: '',
  content: ''
})

// 获取用户列表
async function fetchUserList(type: 'student' | 'coach' | 'all') {
  let UserSelectType = ''
  if (type === 'student') UserSelectType = 'STUDENT'
  else if (type === 'coach') UserSelectType = 'COACH'
  else UserSelectType = 'COACH&STUDENT'

  try {
    const res = await getuserlistApi({
      Page: '1',
      Size: '1000',
      UserSelectType: UserSelectType as 'ADMIN' | 'COACH' | 'STUDENT' | 'COACH&STUDENT'
    })
    // 假设返回数据结构为 res.data.list
    userList.value = (res.data?.CoachStudentUserInfos || []).map((user: any) => ({
      id: user.ID,
      name: user.Username,
      type: user.RoleName?.toLowerCase(), // 兼容原有 student/coach
      sex: user.Sex,
      avatar: user.Avatar,
      OpenID: user.OpenID
    }))
  } catch (e) {
    ElMessage.error('获取用户列表失败')
  }
}

// 页面加载时获取全部用户
fetchUserList('all')

// 修改 selectAll 方法，先获取用户再全选
async function selectAll(type: 'student' | 'coach') {
  await fetchUserList(type)
  form.value.recipients = userList.value.map((user) => user.id)
}

function validateForm() {
  if (!form.value.recipients.length) {
    ElMessage.warning('请选择收件人')
    return false
  }
  if (!form.value.subject.trim()) {
    ElMessage.warning('请输入邮件标题')
    return false
  }
  if (!form.value.content.trim()) {
    ElMessage.warning('请输入邮件内容')
    return false
  }
  return true
}

async function sendMail() {
  if (!validateForm()) {
    return
  }
  try {
    // 调用接口
    await createNotifier({
      Notification: {
        Title: form.value.subject,
        Content: form.value.content
      },
      UserIds: form.value.recipients
    })
    ElMessage.success('邮件发送成功！')
    // 清空表单
    form.value.recipients = []
    form.value.subject = ''
    form.value.content = ''
  } catch (e) {
    ElMessage.error('邮件发送失败')
  }
}

function onClearRecipients() {
  fetchUserList('all')
}
</script>

<style scoped>
.user-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 4px;
  width: 100%;
  justify-content: space-between;
  height: 40px;
}
.user-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.icon-coach {
  color: #409eff;
}
.icon-student {
  color: #67c23a;
}
.user-name {
  font-weight: 500;
  margin-right: 4px;
}
.user-type.coach {
  background: #e8f4ff;
  color: #409eff;
  border-radius: 4px;
  padding: 0 6px;
  font-size: 12px;
  margin-right: 4px;
}
.user-type.student {
  background: #f0f9eb;
  color: #67c23a;
  border-radius: 4px;
  padding: 0 6px;
  font-size: 12px;
  margin-right: 4px;
}
.user-sex.male {
  color: #409eff;
  font-size: 12px;
}
.user-sex.female {
  color: #f56c6c;
  font-size: 12px;
}
.icon-identity {
  width: 20px;
  height: 20px;
  margin-right: 2px;
}
.icon-sex {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  margin-right: 2px;
}
.send-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 12px;
}
</style>
