<template>
  <div class="flex w-full h-full">
    <ContentWrap class="flex-[3] ml-20px h-full">
      <div class="mb-10px">
        <div class="mb-2 flex items-center text-sm">
          <span class="mr-4">状态筛选：</span>
          <el-radio-group @change="handleStatusChange" v-model="selectedStatus" class="ml-4">
            <el-radio value="" size="large">全部</el-radio>
            <el-radio value="pending" size="large">待审核</el-radio>
            <el-radio value="approved" size="large">已通过</el-radio>
            <el-radio value="rejected" size="large">已拒绝</el-radio>
          </el-radio-group>
        </div>
      </div>
      <Table
        height="600px"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="allSchemas.tableColumns"
        :data="applicationList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total
        }"
      />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle" width="60%">
      <div v-if="currentApplication" class="application-detail">
        <!-- 申请人信息 -->
        <el-descriptions title="申请人信息" :column="2" border class="mb-4">
          <el-descriptions-item label="用户ID">{{
            currentApplication.UserID
          }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{
            currentApplication.Username
          }}</el-descriptions-item>
          <el-descriptions-item label="OpenID">{{
            currentApplication.UserOpenID
          }}</el-descriptions-item>
          <el-descriptions-item label="申请状态">
            <el-tag
              :type="
                currentApplication.ApplicationStatus === 'approved'
                  ? 'success'
                  : currentApplication.ApplicationStatus === 'rejected'
                    ? 'danger'
                    : 'warning'
              "
            >
              {{
                currentApplication.ApplicationStatus === 'approved'
                  ? '已通过'
                  : currentApplication.ApplicationStatus === 'rejected'
                    ? '已拒绝'
                    : '待审核'
              }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="申请人姓名">
            {{ currentApplication.ApplicantName || '未填写' }}
          </el-descriptions-item>
          <el-descriptions-item label="证件号">
            {{ currentApplication.ApplicantIDNumber || '未填写' }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间">
            {{ formatDateTime(currentApplication.CreatedAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            {{ formatDateTime(currentApplication.UpdatedAt) }}
          </el-descriptions-item>
          <el-descriptions-item v-if="currentApplication.ReviewerNote" label="审核备注" :span="2">
            {{ currentApplication.ReviewerNote }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 文件列表 -->
        <div class="mb-4">
          <h3 class="mb-2 text-lg font-semibold">申请材料</h3>
          <el-tabs v-model="activeFileTab" class="file-tabs">
            <el-tab-pane label="证件照" name="id_doc">
              <div class="file-list">
                <div v-for="file in idDocFiles" :key="file.ID" class="file-item">
                  <el-image
                    :src="file.FileURL"
                    :preview-src-list="[file.FileURL]"
                    fit="cover"
                    :class="['file-image', 'id-doc-image']"
                  />
                  <div class="file-info">
                    <el-form label-position="top" size="small">
                      <el-form-item label="证件号" required>
                        <el-input
                          v-model="file.FileNumber"
                          placeholder="请输入证件号"
                          :disabled="!isPending"
                        />
                      </el-form-item>
                      <el-form-item label="标签">
                        <el-input
                          v-model="file.FileLabel"
                          placeholder="如 身份证"
                          :disabled="!isPending"
                        />
                      </el-form-item>
                      <el-form-item label="有效期">
                        <el-date-picker
                          v-model="file.FileExpireAt"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择有效期"
                          :disabled="!isPending"
                          style="width: 100%"
                        />
                      </el-form-item>
                      <el-form-item label="备注">
                        <el-input
                          v-model="file.FileNote"
                          placeholder="备注（可选）"
                          :disabled="!isPending"
                        />
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div v-if="idDocFiles.length === 0" class="empty-tip">暂无证件照</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="资质证明" name="qualification">
              <div class="file-list">
                <div v-for="file in qualificationFiles" :key="file.ID" class="file-item">
                  <el-image
                    :src="file.FileURL"
                    :preview-src-list="[file.FileURL]"
                    fit="cover"
                    :class="['file-image', 'qualification-image']"
                  />
                  <div class="file-info">
                    <el-form label-position="top" size="small">
                      <el-form-item label="证书号">
                        <el-input
                          v-model="file.FileNumber"
                          placeholder="请输入证书号"
                          :disabled="!isPending"
                        />
                      </el-form-item>
                      <el-form-item label="标签">
                        <el-input
                          v-model="file.FileLabel"
                          placeholder="如 教练证"
                          :disabled="!isPending"
                        />
                      </el-form-item>
                      <el-form-item label="有效期">
                        <el-date-picker
                          v-model="file.FileExpireAt"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择有效期"
                          :disabled="!isPending"
                          style="width: 100%"
                        />
                      </el-form-item>
                      <el-form-item label="备注">
                        <el-input
                          v-model="file.FileNote"
                          placeholder="备注（可选）"
                          :disabled="!isPending"
                        />
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div v-if="qualificationFiles.length === 0" class="empty-tip">暂无资质证明</div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="个人照片" name="portrait">
              <div class="file-list">
                <div v-for="file in portraitFiles" :key="file.ID" class="file-item">
                  <el-image
                    :src="file.FileURL"
                    :preview-src-list="[file.FileURL]"
                    fit="cover"
                    :class="['file-image', 'portrait-image']"
                  />
                  <div class="file-info">
                    <el-form label-position="top" size="small">
                      <el-form-item label="标签">
                        <el-input
                          v-model="file.FileLabel"
                          placeholder="如 近照"
                          :disabled="!isPending"
                        />
                      </el-form-item>
                      <el-form-item label="备注">
                        <el-input
                          v-model="file.FileNote"
                          placeholder="备注（可选）"
                          :disabled="!isPending"
                        />
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <div v-if="portraitFiles.length === 0" class="empty-tip">暂无个人照片</div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 审核操作 -->
        <div v-if="currentApplication.ApplicationStatus === 'pending'" class="review-section">
          <el-divider />
          <h3 class="mb-4 text-lg font-semibold">审核操作</h3>
          <el-form :model="reviewForm" label-width="120px">
            <el-form-item label="申请人姓名">
              <el-input
                v-model="reviewForm.ApplicantName"
                placeholder="从上传材料中提取的姓名（可选）"
                :disabled="!isPending"
              />
            </el-form-item>
            <el-form-item label="证件号">
              <el-input
                v-model="reviewForm.ApplicantIDNumber"
                placeholder="从上传材料中提取的证件号（可选）"
                :disabled="!isPending"
              />
            </el-form-item>
            <el-form-item label="审核备注">
              <el-input
                v-model="reviewForm.ReviewerNote"
                type="textarea"
                :rows="4"
                placeholder="请输入审核备注"
                :disabled="!isPending"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between items-center w-full">
          <div class="flex gap-2">
            <BaseButton
              v-if="currentApplication?.ApplicationStatus === 'pending'"
              type="success"
              :loading="approveLoading"
              @click="handleApprove"
            >
              审核通过
            </BaseButton>
            <BaseButton
              v-if="currentApplication?.ApplicationStatus === 'pending'"
              type="danger"
              :loading="rejectLoading"
              @click="handleReject"
            >
              审核拒绝
            </BaseButton>
          </div>
          <BaseButton @click="dialogVisible = false">关闭</BaseButton>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { ref, watch, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { Dialog } from '@/components/Dialog'
import dayjs from 'dayjs'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'
import {
  getCoachApplicationsApi,
  getCoachApplicationDetailApi,
  approveCoachApplicationApi,
  rejectCoachApplicationApi,
  type CoachApplicationItem,
  type CoachApplicationDetail,
  type ApplicationStatus,
  type ApplicationFile
} from '@/api/coachApplication'

type EditableApplicationFile = ApplicationFile & {
  FileNumber: string
  FileLabel: string
  FileExpireAt: string
  FileNote: string
}

const selectedStatus = ref<ApplicationStatus | ''>('pending')
const applicationList = ref<CoachApplicationItem[]>([])

const { tableRegister, tableState } = useTable({
  fetchDataApi: async () => {
    const res: any = await fetchApplicationList()
    return {
      list: res,
      total: total.value
    }
  }
})
const { total, loading, pageSize, currentPage } = tableState

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'ID',
    label: 'ID',
    width: 80,
    align: 'center',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'Username',
    label: '用户名',
    align: 'center',
    form: {
      hidden: true
    }
  },
  {
    field: 'UserOpenID',
    label: 'OpenID',
    align: 'center',
    width: 200,
    form: {
      hidden: true
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'ApplicantName',
    label: '申请人姓名',
    align: 'center',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'ApplicantIDNumber',
    label: '证件号',
    align: 'center',
    width: 180,
    form: {
      hidden: true
    },
    search: {
      hidden: true
    }
  },
  {
    field: 'ApplicationStatus',
    label: '申请状态',
    align: 'center',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      slots: {
        default: (data: any) => {
          const status = data.row.ApplicationStatus
          return (
            <>
              <ElTag
                type={
                  status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning'
                }
              >
                {status === 'approved' ? '已通过' : status === 'rejected' ? '已拒绝' : '待审核'}
              </ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'CreatedAt',
    label: '申请时间',
    align: 'center',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 180
    }
  },
  {
    field: 'UpdatedAt',
    label: '更新时间',
    align: 'center',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 180
    }
  },
  {
    field: 'action',
    label: '操作',
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 120,
      slots: {
        default: (data: any) => {
          const row = data.row as CoachApplicationItem
          return (
            <>
              <div class="flex justify-center items-center w-full">
                <BaseButton type="primary" onClick={() => action(row, 'detail')}>
                  查看详情
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

const fetchApplicationList = async () => {
  loading.value = true
  // 立即清空列表，避免显示旧数据
  applicationList.value = []
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    if (selectedStatus.value) {
      params.Status = selectedStatus.value
    }

    const res = await getCoachApplicationsApi(params)
    pageSize.value = res.data.PageInfo.Size
    total.value = res.data.PageInfo.Total

    // 确保即使返回空数组也正确设置
    applicationList.value = (res.data.Items || []).map((v) => ({
      ...v,
      CreatedAt: formatDateTime(v.CreatedAt),
      UpdatedAt: formatDateTime(v.UpdatedAt)
    }))
    return applicationList.value
  } catch (error) {
    // 出错时也清空列表
    applicationList.value = []
    throw error
  } finally {
    loading.value = false
  }
}

const handleStatusChange = () => {
  currentPage.value = 1
  // 切换状态时立即清空列表
  applicationList.value = []
  fetchApplicationList()
}

const formatDateTime = (dateTime: string) => {
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
}

const dialogVisible = ref(false)
const dialogTitle = ref('申请详情')
const currentApplication = ref<CoachApplicationDetail | null>(null)
const activeFileTab = ref('id_doc')
const reviewFiles = ref<EditableApplicationFile[]>([])
const isPending = computed(() => currentApplication.value?.ApplicationStatus === 'pending')

const reviewForm = reactive({
  ApplicantName: '',
  ApplicantIDNumber: '',
  ReviewerNote: ''
})

const idDocFiles = computed(() => {
  return reviewFiles.value.filter((f) => f.FileCategory === 'id_doc')
})

const qualificationFiles = computed(() => {
  return reviewFiles.value.filter((f) => f.FileCategory === 'qualification')
})

const portraitFiles = computed(() => {
  return reviewFiles.value.filter((f) => f.FileCategory === 'portrait')
})

const action = async (row: CoachApplicationItem, type: string) => {
  if (type === 'detail') {
    dialogTitle.value = '申请详情'
    dialogVisible.value = true
    try {
      const res = await getCoachApplicationDetailApi(row.ID)
      currentApplication.value = res.data
      reviewFiles.value =
        res.data.ApplicationFiles?.map((file) => ({
          ...file,
          FileNumber: file.FileNumber || '',
          FileLabel: file.FileLabel || '',
          FileExpireAt: file.FileExpireAt ? dayjs(file.FileExpireAt).format('YYYY-MM-DD') : '',
          FileNote: file.FileNote || ''
        })) || []
      // 初始化审核表单
      reviewForm.ApplicantName = res.data.ApplicantName || ''
      reviewForm.ApplicantIDNumber = res.data.ApplicantIDNumber || ''
      reviewForm.ReviewerNote = ''
      activeFileTab.value = 'id_doc'
    } catch (error) {
      ElMessage.error('获取详情失败')
    }
  }
}

const approveLoading = ref(false)
const rejectLoading = ref(false)

const handleApprove = async () => {
  if (!currentApplication.value) return

  if (!reviewFiles.value.length) {
    ElMessage.warning('缺少申请材料，无法审核')
    return
  }

  const idDocs = idDocFiles.value
  if (idDocs.length === 0) {
    ElMessage.warning('需要至少一张证件照才能审核')
    return
  }
  if (idDocs.length > 1) {
    ElMessage.warning('证件照仅允许 1 张，请核对材料')
    return
  }

  const applicantName = reviewForm.ApplicantName.trim()
  if (!applicantName) {
    ElMessage.warning('请输入申请人姓名')
    return
  }

  const applicantIDNumber =
    reviewForm.ApplicantIDNumber.trim() || idDocs[0].FileNumber?.trim() || ''
  if (!applicantIDNumber) {
    ElMessage.warning('请填写证件号或补充证件照编号')
    return
  }
  // 确保证件照的编号同步
  if (!idDocs[0].FileNumber?.trim()) {
    idDocs[0].FileNumber = applicantIDNumber
  }
  reviewForm.ApplicantIDNumber = applicantIDNumber

  try {
    await ElMessageBox.confirm('确认审核通过该申请？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  approveLoading.value = true
  try {
    const res = await approveCoachApplicationApi(currentApplication.value.ID, {
      ApplicantName: applicantName,
      ApplicantIDNumber: applicantIDNumber,
      ReviewerNote: reviewForm.ReviewerNote.trim() || undefined,
      Files: reviewFiles.value.map((file) => ({
        ID: file.ID,
        FileNumber: file.FileNumber?.trim() || null,
        FileLabel: file.FileLabel?.trim() || null,
        FileExpireAt: file.FileExpireAt || null,
        FileNote: file.FileNote?.trim() || null
      }))
    })
    if (res.code === 200) {
      ElMessage.success('审核通过')
      dialogVisible.value = false
      fetchApplicationList()
    } else {
      ElMessage.error('审核失败')
    }
  } catch (error: any) {
    ElMessage.error('审核失败')
  } finally {
    approveLoading.value = false
  }
}

const handleReject = async () => {
  if (!currentApplication.value) return

  if (!reviewForm.ReviewerNote.trim()) {
    ElMessage.warning('请输入拒绝原因')
    return
  }

  try {
    await ElMessageBox.confirm('确认拒绝该申请？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }

  rejectLoading.value = true
  try {
    const res = await rejectCoachApplicationApi(currentApplication.value.ID, {
      ReviewerNote: reviewForm.ReviewerNote
    })
    if (res.code === 200) {
      ElMessage.success('已拒绝')
      dialogVisible.value = false
      fetchApplicationList()
    } else {
      ElMessage.error('操作失败')
    }
  } catch (error: any) {
    ElMessage.error('操作失败')
  } finally {
    rejectLoading.value = false
  }
}

// 监听分页变化
watch([currentPage, pageSize], () => {
  fetchApplicationList()
})
</script>

<style scoped lang="less">
.application-detail {
  .file-tabs {
    .file-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px 0;

      .file-item {
        overflow: hidden;
        background: #fff;
        border: 1px solid #e4e7ed;
        border-radius: 8px;

        .file-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          cursor: pointer;
        }

        .portrait-image {
          aspect-ratio: 3 / 4;
        }

        .file-info {
          padding: 12px;
          font-size: 14px;

          .el-form-item {
            margin-bottom: 8px;
          }
        }
      }

      .empty-tip {
        padding: 40px 0;
        color: #909399;
        text-align: center;
        grid-column: 1 / -1;
      }
    }
  }

  .review-section {
    margin-top: 24px;
  }
}
</style>
