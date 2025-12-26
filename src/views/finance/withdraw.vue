<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ref, watch, h, unref } from 'vue'
import {
  ElTag,
  ElSelect,
  ElOption,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElMessage,
  ElMessageBox,
  ElUpload,
  ElAvatar,
  ElImage,
  ElDescriptions,
  ElDescriptionsItem,
  type UploadProps,
  type UploadFile
} from 'element-plus'
import { BaseButton } from '@/components/Button'
import { getWithdrawList, approveWithdraw, rejectWithdraw } from '@/api/finance'
import { useTable } from '@/hooks/web/useTable'
import { convertDateTime } from './utils/convertDateTime'
import { getOss } from '@/api/utils'
import { Plus } from '@element-plus/icons-vue'

// 状态筛选
const selectedStatus = ref<string>('')

// 状态选项
const statusOptions = [
  { label: '全部', value: '' },
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' }
]

// 状态标签类型映射
const getStatusTagType = (
  status: string
): 'success' | 'warning' | 'info' | 'primary' | 'danger' => {
  const statusMap: Record<string, 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return statusMap[status] || 'info'
}

// 状态文本映射
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { currentPage, pageSize } = tableState
    const params: any = {
      Page: unref(currentPage),
      Size: unref(pageSize)
    }

    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }

    const res: any = await getWithdrawList(params)
    if (res) {
      const list = res.data.Withdrawals.map((item: any) => {
        return {
          ID: item.ID,
          UniqueCode: item.UniqueCode,
          CoachID: item.CoachID,
          CoachName: item.CoachName,
          CoachAvatar: item.CoachAvatar,
          Amount: item.Amount,
          Status: item.Status,
          PaymentMethod: item.PaymentMethod,
          RealName: item.RealName,
          Phone: item.Phone,
          WechatAccount: item.WechatAccount,
          AlipayAccount: item.AlipayAccount,
          TransferProof: item.TransferProof,
          AdminRemark: item.AdminRemark,
          CreatedAt: item.CreatedAt,
          UpdatedAt: item.UpdatedAt
        }
      })
      return {
        list,
        total: res.data.Total
      }
    }
    return {
      list: [],
      total: 0
    }
  },
  immediate: false
})
const { total, pageSize, currentPage, loading, dataList } = tableState

const { t } = useI18n()

const columns: TableColumn[] = [
  {
    field: '序号',
    label: '序号',
    type: 'index',
    width: 70
  },
  {
    field: 'UniqueCode',
    label: '标识码',
    width: 140
  },
  {
    field: 'CoachName',
    label: '教练姓名',
    width: 100
  },
  {
    field: 'Amount',
    label: '提现金额',
    width: 110,
    sortable: true,
    formatter: (row: any) => {
      return `¥${Number(row.Amount).toFixed(2)}`
    }
  },
  {
    field: 'PaymentMethod',
    label: '收款方式',
    width: 100,
    formatter: (row: any) => {
      const methodMap: Record<string, string> = {
        wechat: '微信',
        alipay: '支付宝'
      }
      return methodMap[row.PaymentMethod] || row.PaymentMethod
    }
  },
  {
    field: 'RealName',
    label: '真实姓名',
    width: 100
  },
  {
    field: 'Phone',
    label: '手机号',
    width: 120
  },
  {
    field: 'Account',
    label: '收款账号',
    width: 140,
    formatter: (row: any) => {
      if (row.PaymentMethod === 'wechat') {
        return row.WechatAccount || '-'
      } else if (row.PaymentMethod === 'alipay') {
        return row.AlipayAccount || '-'
      }
      return '-'
    }
  },
  {
    field: 'Status',
    label: '状态',
    width: 90,
    formatter: (row: any) => {
      return h(ElTag, { type: getStatusTagType(row.Status) }, () => getStatusText(row.Status))
    }
  },
  {
    field: 'CreatedAt',
    label: '申请时间',
    width: 160,
    sortable: true,
    formatter: (row: any) => convertDateTime(row.CreatedAt)
  },
  {
    field: 'action',
    label: '操作',
    width: 240,
    fixed: 'right',
    slots: {
      default: (data: any) => {
        const row = data.row
        return (
          <>
            <BaseButton
              type="primary"
              size="small"
              onClick={() => handleDetailClick(row)}
              class="mr-10px"
            >
              详情
            </BaseButton>
            {row.Status === 'pending' && (
              <>
                <BaseButton
                  type="success"
                  size="small"
                  onClick={() => handleApproveClick(row)}
                  class="mr-10px"
                >
                  通过
                </BaseButton>
                <BaseButton type="danger" size="small" onClick={() => handleRejectClick(row)}>
                  拒绝
                </BaseButton>
              </>
            )}
          </>
        )
      }
    }
  }
]

// 审批通过对话框
const approveDialogVisible = ref(false)
const approveForm = ref({
  TransferProof: [] as string[],
  AdminRemark: ''
})
const approveFileList = ref<UploadFile[]>([])
const approveLoading = ref(false)
const currentWithdrawId = ref<number | null>(null)

// 拒绝对话框
const rejectDialogVisible = ref(false)
const rejectForm = ref({
  AdminRemark: ''
})
const rejectLoading = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const detailData = ref<any>(null)

// OSS 签名
const ossSignature = ref({
  Policy: '',
  OSSAccessKeyId: '',
  Signature: '',
  'x-oss-security-token': '',
  key: ''
})

// 存储每个文件的 key (file.uid -> key)
const fileKeyMap = new Map<number, string>()

// 获取当前格式化日期
function getCurrentFormattedDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = ('0' + (now.getMonth() + 1)).slice(-2)
  const day = ('0' + now.getDate()).slice(-2)
  return `${year}${month}${day}`
}

// 处理审批通过点击
const handleApproveClick = (row: any) => {
  currentWithdrawId.value = row.ID
  approveForm.value = {
    TransferProof: [],
    AdminRemark: ''
  }
  approveFileList.value = []
  fileKeyMap.clear() // 清空文件 key 映射
  approveDialogVisible.value = true
}

// 处理拒绝点击
const handleRejectClick = (row: any) => {
  currentWithdrawId.value = row.ID
  rejectForm.value = {
    AdminRemark: ''
  }
  rejectDialogVisible.value = true
}

// 处理查看详情点击
const handleDetailClick = (row: any) => {
  detailData.value = row
  detailDialogVisible.value = true
}

// 解析转账凭证JSON
const parseTransferProof = (proof: string): string[] => {
  if (!proof) return []
  try {
    return JSON.parse(proof)
  } catch {
    return []
  }
}

// 图片上传前处理
const beforeImageUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  const isJPG = rawFile.type === 'image/jpeg'
  const isPNG = rawFile.type === 'image/png'
  const isLt5M = rawFile.size / 1024 / 1024 < 5

  if (!isJPG && !isPNG) {
    ElMessage.error('图片必须是 JPG 或 PNG 格式！')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB！')
    return false
  }

  try {
    const res = await getOss()
    const { data } = res
    const key =
      getCurrentFormattedDate() +
      '/' +
      rawFile.uid +
      rawFile.name.substring(rawFile.name.lastIndexOf('.'))

    // 存储该文件的 key
    fileKeyMap.set(rawFile.uid, key)

    ossSignature.value = {
      Policy: data.PolicyBase64,
      OSSAccessKeyId: data.AccessKeyId,
      Signature: data.Signature,
      'x-oss-security-token': data.SecurityToken,
      key: key
    }

    if (!ossSignature.value.OSSAccessKeyId) {
      ElMessage.error('获取上传签名失败，请重试！')
      return false
    }

    return true
  } catch (error) {
    ElMessage.error('获取上传签名失败，请重试！')
    console.error(error)
    return false
  }
}

// 图片上传成功
const handleImageSuccess: UploadProps['onSuccess'] = (_response: any, file: UploadFile) => {
  // 从 Map 中获取该文件的 key
  const key = fileKeyMap.get(file.uid) || ossSignature.value.key
  const fileUrl = `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${key}`
  approveForm.value.TransferProof.push(fileUrl)
  // 更新 fileList 以显示已上传的图片
  if (file) {
    file.url = fileUrl
    approveFileList.value.push(file)
  }
  // 清理 Map 中的 key
  fileKeyMap.delete(file.uid)
  ElMessage.success('图片上传成功')
}

// 图片移除
const handleImageRemove = (file: UploadFile) => {
  const url = file.url || `https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com/${file.name}`
  const index = approveForm.value.TransferProof.indexOf(url)
  if (index > -1) {
    approveForm.value.TransferProof.splice(index, 1)
  }
  // 从 fileList 中移除
  const fileIndex = approveFileList.value.findIndex((f) => f.uid === file.uid)
  if (fileIndex > -1) {
    approveFileList.value.splice(fileIndex, 1)
  }
}

// 提交审批通过
const handleApprove = async () => {
  if (!currentWithdrawId.value) return

  if (approveForm.value.TransferProof.length === 0) {
    ElMessage.warning('请至少上传一张转账凭证')
    return
  }

  try {
    await ElMessageBox.confirm('确认审批通过该提现申请？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  approveLoading.value = true
  try {
    const res = await approveWithdraw(currentWithdrawId.value, {
      TransferProof: JSON.stringify(approveForm.value.TransferProof),
      AdminRemark: approveForm.value.AdminRemark.trim() || undefined
    })
    if (res.code === 200) {
      ElMessage.success('审批通过')
      approveDialogVisible.value = false
      tableMethods.getList()
    } else {
      ElMessage.error('操作失败')
    }
  } catch (error: any) {
    ElMessage.error('操作失败')
  } finally {
    approveLoading.value = false
  }
}

// 提交拒绝
const handleReject = async () => {
  if (!currentWithdrawId.value) return

  if (!rejectForm.value.AdminRemark.trim()) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  try {
    await ElMessageBox.confirm('确认拒绝该提现申请？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  rejectLoading.value = true
  try {
    const res = await rejectWithdraw(currentWithdrawId.value, {
      AdminRemark: rejectForm.value.AdminRemark.trim()
    })
    if (res.code === 200) {
      ElMessage.success('已拒绝')
      rejectDialogVisible.value = false
      tableMethods.getList()
    } else {
      ElMessage.error('操作失败')
    }
  } catch (error: any) {
    ElMessage.error('操作失败')
  } finally {
    rejectLoading.value = false
  }
}

// 监听状态筛选变化
watch(selectedStatus, () => {
  currentPage.value = 1
  tableMethods.getList()
})

// 初始加载
tableMethods.getList()
</script>

<template>
  <ContentWrap title="提现申请" :message="t('tableDemo.tableDes')">
    <div class="mb-20px">
      <span class="mr-10px">筛选状态:</span>
      <ElSelect v-model="selectedStatus" placeholder="选择状态" style="width: 150px" clearable>
        <ElOption
          v-for="option in statusOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </ElSelect>
    </div>
    <Table
      v-model:currentPage="currentPage"
      v-model:pageSize="pageSize"
      :columns="columns"
      :data="dataList"
      :loading="loading"
      :defaultSort="{ prop: 'CreatedAt', order: 'descending' }"
      @register="tableRegister"
      :pagination="{
        total
      }"
    />

    <!-- 审批通过对话框 -->
    <ElDialog
      v-model="approveDialogVisible"
      title="审批通过"
      width="600px"
      :close-on-click-modal="false"
    >
      <ElForm :model="approveForm" label-width="120px">
        <ElFormItem label="转账凭证" required>
          <ElUpload
            action="https://zhanjiang-fitness.oss-cn-guangzhou.aliyuncs.com"
            :data="ossSignature"
            :file-list="approveFileList"
            list-type="picture-card"
            :before-upload="beforeImageUpload"
            :on-success="handleImageSuccess"
            :on-remove="handleImageRemove"
            :limit="9"
            accept="image/jpeg,image/png"
          >
            <el-icon><Plus /></el-icon>
          </ElUpload>
          <div class="el-upload__tip">支持 JPG/PNG 格式，单张图片不超过 5MB，最多上传 9 张</div>
        </ElFormItem>
        <ElFormItem label="管理员备注">
          <ElInput
            v-model="approveForm.AdminRemark"
            type="textarea"
            :rows="3"
            placeholder="可选，填写备注信息"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="approveDialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="approveLoading" @click="handleApprove">
          确认通过
        </ElButton>
      </template>
    </ElDialog>

    <!-- 拒绝对话框 -->
    <ElDialog
      v-model="rejectDialogVisible"
      title="拒绝提现申请"
      width="500px"
      :close-on-click-modal="false"
    >
      <ElForm :model="rejectForm" label-width="100px">
        <ElFormItem label="拒绝原因" required>
          <ElInput
            v-model="rejectForm.AdminRemark"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因（必填）"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="rejectDialogVisible = false">取消</ElButton>
        <ElButton type="danger" :loading="rejectLoading" @click="handleReject"> 确认拒绝 </ElButton>
      </template>
    </ElDialog>

    <!-- 详情对话框 -->
    <ElDialog v-model="detailDialogVisible" title="提现申请详情" width="800px">
      <ElDescriptions v-if="detailData" :column="2" border>
        <ElDescriptionsItem label="唯一标识码" :span="2">
          <span style="font-weight: bold; color: #409eff">{{ detailData.UniqueCode }}</span>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="教练信息" :span="2">
          <div style="display: flex; align-items: center; gap: 10px">
            <ElAvatar v-if="detailData.CoachAvatar" :src="detailData.CoachAvatar" :size="50" />
            <div>
              <div>{{ detailData.CoachName }} (ID: {{ detailData.CoachID }})</div>
            </div>
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="提现金额">
          <span style=" font-size: 16px;font-weight: bold; color: #f56c6c">
            ¥{{ Number(detailData.Amount).toFixed(2) }}
          </span>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="状态">
          <ElTag :type="getStatusTagType(detailData.Status)">
            {{ getStatusText(detailData.Status) }}
          </ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="收款方式">
          {{ detailData.PaymentMethod === 'wechat' ? '微信' : '支付宝' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="真实姓名">
          {{ detailData.RealName }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">
          {{ detailData.Phone }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="收款账号">
          {{
            detailData.PaymentMethod === 'wechat'
              ? detailData.WechatAccount
              : detailData.AlipayAccount
          }}
        </ElDescriptionsItem>
        <ElDescriptionsItem label="申请时间" :span="2">
          {{ convertDateTime(detailData.CreatedAt) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          v-if="detailData.Status !== 'pending' && detailData.UpdatedAt"
          label="处理时间"
          :span="2"
        >
          {{ convertDateTime(detailData.UpdatedAt) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          v-if="detailData.Status === 'approved' && detailData.TransferProof"
          label="转账凭证"
          :span="2"
        >
          <div style="display: flex; gap: 10px; flex-wrap: wrap">
            <ElImage
              v-for="(img, index) in parseTransferProof(detailData.TransferProof)"
              :key="index"
              :src="img"
              :preview-src-list="parseTransferProof(detailData.TransferProof)"
              :initial-index="index"
              style="width: 100px; height: 100px"
              fit="cover"
            />
          </div>
        </ElDescriptionsItem>
        <ElDescriptionsItem v-if="detailData.AdminRemark" label="管理员备注" :span="2">
          {{ detailData.AdminRemark }}
        </ElDescriptionsItem>
      </ElDescriptions>
      <template #footer>
        <ElButton @click="detailDialogVisible = false">关闭</ElButton>
      </template>
    </ElDialog>
  </ContentWrap>
</template>
