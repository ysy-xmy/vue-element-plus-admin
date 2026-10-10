<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductConfig, saveProductConfig } from '@/api/admin'
import { errorText } from '@/views/Operations/shared'
import '@/views/Operations/operations.css'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const loaded = ref(false)
const error = ref('')
const values = reactive<Record<string, string>>({})
const original = ref<Record<string, string>>({})
const flags = reactive({
  commerce: false,
  coachMarketplace: false,
  coachWallet: false,
  coachApply: false,
  aiQuotaUi: false
})
const flagRows: { key: keyof typeof flags; label: string; hint: string }[] = [
  {
    key: 'commerce',
    label: '购课与订单入口',
    hint: '开启后展示商业化入口，并允许创建新的支付订单。'
  },
  { key: 'coachMarketplace', label: '教练市场', hint: '展示选课及教练列表的购课引导。' },
  { key: 'coachWallet', label: '教练收入与提现', hint: '展示教练钱包及提现入口。' },
  {
    key: 'coachApply',
    label: '教练认证申请',
    hint: '展示原教练申请入口；所有用户已具备教练工具能力。'
  },
  { key: 'aiQuotaUi', label: 'AI 额度展示', hint: '展示 AI 次数与会员相关界面。' }
]
const load = async () => {
  loading.value = true
  error.value = ''
  loaded.value = false
  try {
    const data = await getProductConfig()
    const parsed = JSON.parse(data.ProductFeatureFlags)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      throw new Error('功能开关配置格式错误，请检查原配置')
    for (const row of flagRows) {
      if (parsed[row.key] !== undefined && typeof parsed[row.key] !== 'boolean')
        throw new Error('功能开关配置不是布尔值，请检查原配置')
      flags[row.key] = parsed[row.key] ?? false
    }
    Object.assign(values, data, { ProductFeatureFlags: JSON.stringify(flags) })
    original.value = { ...values }
    loaded.value = true
  } catch (e) {
    error.value = errorText(e)
  } finally {
    loading.value = false
  }
}
const save = async () => {
  if (!loaded.value) return
  for (const key of ['SystemName', 'DefaultWXName', 'CourseDefaultName']) {
    if (!values[key]?.trim()) {
      ElMessage.warning('请填写产品名称、默认昵称前缀和默认训练名称')
      return
    }
  }
  const next = { ...values, ProductFeatureFlags: JSON.stringify(flags) }
  const changes = Object.fromEntries(
    Object.entries(next).filter(([key, value]) => value !== original.value[key])
  )
  if (!Object.keys(changes).length) {
    ElMessage.info('没有需要保存的修改')
    return
  }
  saving.value = true
  try {
    await saveProductConfig(changes)
    Object.assign(values, next)
    original.value = { ...next }
    ElMessage.success('产品配置已保存，小程序重新加载配置后生效')
  } catch (e) {
    ElMessage.error(errorText(e))
  } finally {
    saving.value = false
  }
}
onMounted(load)
</script>

<template>
  <div class="ops-page" v-loading="loading">
    <div class="ops-header"
      ><div
        ><div class="ops-eyebrow">产品设置</div><h1>小程序配置</h1
        ><p>当前定位：个人训练记录 + AI 辅助 + 教练工具。商业入口默认关闭。</p></div
      ><el-button type="primary" :loading="saving" :disabled="!loaded || loading" @click="save"
        >保存修改</el-button
      ></div
    >
    <el-alert v-if="error" :title="error" type="error" show-icon :closable="false" /><el-button
      v-if="error"
      @click="load"
      >重新加载</el-button
    >
    <template v-if="loaded">
      <div class="ops-columns">
        <section class="ops-panel"
          ><h2>基础信息</h2><p class="hint">展示名称与新用户默认资料。</p>
          <el-form label-position="top" :disabled="saving" style="margin-top: 20px">
            <el-form-item label="产品名称"
              ><el-input v-model="values.SystemName" maxlength="60" show-word-limit
            /></el-form-item>
            <el-form-item label="产品描述"
              ><el-input
                v-model="values.SystemDescription"
                type="textarea"
                :rows="3"
                maxlength="300"
                show-word-limit
            /></el-form-item>
            <el-form-item label="默认昵称前缀"
              ><el-input v-model="values.DefaultWXName" maxlength="30" /><div class="hint"
                >注册时自动追加六位数字。</div
              ></el-form-item
            >
            <el-form-item label="默认训练名称"
              ><el-input v-model="values.CourseDefaultName" maxlength="60"
            /></el-form-item>
            <el-form-item label="产品 Logo 地址"
              ><el-input v-model="values.SystemLogo" placeholder="https://…"
            /></el-form-item>
            <el-form-item label="默认头像地址"
              ><el-input v-model="values.DefaultWXImg" placeholder="https://…"
            /></el-form-item>
            <el-form-item label="男性训练头像"
              ><el-input v-model="values.DefaultAvatarStudentMale" placeholder="https://…"
            /></el-form-item>
            <el-form-item label="女性训练头像"
              ><el-input v-model="values.DefaultAvatarStudentFemale" placeholder="https://…"
            /></el-form-item>
            <el-form-item label="教练视角头像"
              ><el-input v-model="values.DefaultAvatarCoach" placeholder="https://…"
            /></el-form-item>
          </el-form>
        </section>
        <div style="display: flex; flex-direction: column; gap: 20px">
          <section class="ops-panel"
            ><h2>动作内容</h2
            ><div class="config-switch"
              ><div><strong>动作视频显示</strong><p class="hint">控制动作详情页的视频入口。</p></div
              ><el-switch
                v-model="values.ShowVideo"
                active-value="1"
                inactive-value="0"
                :disabled="saving" /></div
          ></section>
          <section class="ops-panel"
            ><h2>商业功能入口</h2><p class="hint">按需恢复历史商业功能。教练视角切换始终可用。</p>
            <div v-for="row in flagRows" :key="row.key" class="config-switch"
              ><div
                ><strong>{{ row.label }}</strong
                ><p class="hint">{{ row.hint }}</p></div
              ><el-switch v-model="flags[row.key]" :disabled="saving"
            /></div>
          </section>
        </div>
      </div>
      <section class="ops-panel"
        ><el-collapse
          ><el-collapse-item title="历史业务处理" name="legacy"
            ><p class="hint">处理已有订单、收入、提现及认证申请。</p
            ><el-button @click="router.push('/legacy')">进入历史业务</el-button></el-collapse-item
          ></el-collapse
        ></section
      >
    </template>
  </div>
</template>

<style scoped>
.config-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}
.config-switch:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}
.config-switch strong {
  font-size: 14px;
  font-weight: 500;
}
.config-switch p {
  margin: 6px 0 0;
}
</style>
