<script setup lang="ts">
import { ref, defineProps, PropType, watch } from 'vue'
import { Dialog } from '@/components/Dialog'
import { FormSchema } from '@/components/Form'
import { ElMessage, ElMessageBox } from 'element-plus'
import { delAction, updateAction, addAction } from '@/api/resource'
import { useForm } from '@/hooks/web/useForm'
import { defineEmits } from 'vue'
import { getOss } from '@/api/utils/index'
import ActionDetail from './actionDetail.vue'
import { computed } from 'vue'
const loading = ref(false)
const actionType = ref('')
const actionId = ref(0) // 用于存储当前操作的 actionId
const emit = defineEmits(['updataActionlist'])
const actionDetailRef = ref<InstanceType<typeof ActionDetail> | null>(null) // 定义 ref 以引用 ActionDetail
const componentKey = ref(0) // 添加一个用于强制重新渲染的 key
const localActionList = ref<IItem[]>([]) // 添加本地变量存储排序后的列表
interface IPicUrl {
  ID: number
  URL: string
}
interface IItem {
  id: number | string
  title: string
  orderid: number
  children: IItem[] // 假设子项也是 IItem 类型的数组
  intro: string
  picurl: IPicUrl[]
  isActive: boolean
  videos?: { URL: string }[] // 确保 videos 属性存在
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
})

const action = (type: string, item: any) => {
  loading.value = true // 添加 loading
  actionType.value = type
  if (type !== 'add') {
    actionId.value = item.id
  }
  if (actionDetailRef.value) {
    actionDetailRef.value.dialogOpen()
  }
  loading.value = false // 关闭 loading
}

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
const updateLocalList = () => {
  localActionList.value = [...props.actionlist].sort((a, b) => {
    const orderA = Number(a.orderid)
    const orderB = Number(b.orderid)
    return orderA - orderB
  })
}

// 监听 props.actionlist 的变化
watch(
  () => props.actionlist,
  () => {
    updateLocalList()
  },
  { immediate: true }
)

const updataActionlist = (SecondCategoryID: number) => {
  loading.value = true // 添加 loading
  emit('updataActionlist', SecondCategoryID)
  // 给父组件足够的时间更新数据
  setTimeout(() => {
    updateLocalList()
    componentKey.value++
    console.log('更新后的列表', localActionList.value)
    loading.value = false // 关闭 loading
  }, 100)
}

// 监听 actionId 的变化，当动作详情窗口关闭时也触发更新
watch(
  () => actionId.value,
  (newVal, oldVal) => {
    if (oldVal && !newVal) {
      // 当 actionId 从有值变为无值时（即窗口关闭时）
      setTimeout(() => {
        updateLocalList()
        componentKey.value++
      }, 100)
    }
  }
)
</script>

<template>
  <div v-loading="loading" class="action-list-container" :key="componentKey">
    <template v-for="(item, index) in localActionList" :key="item.id">
      <div v-if="item.id !== '-1'" class="action-card">
        <div class="action-image-container">
          <el-image
            v-if="item.picurl"
            :src="item.picurl[0].URL"
            class="action-image"
            lazy
            :preview-src-list="[item.picurl[0].URL]"
            loading="lazy"
          >
            <template #placeholder>
              <div class="image-placeholder">
                <el-icon><Loading /></el-icon>
              </div>
            </template>
          </el-image>
          <el-image
            v-else
            class="action-image"
            src="https://th.bing.com/th/id/OIP.O6ZIKh-BK0SK9X_aM6GJkgHaHa?rs=1&pid=ImgDetMain"
            lazy
            loading="lazy"
          >
            <template #placeholder>
              <div class="image-placeholder">
                <el-icon><Loading /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="action-content">
          <div class="action-title">{{ item.title }}</div>
          <div class="action-buttons">
            <BaseButton @click="action('edit', item, index)" type="primary" class="edit-btn">
              <Icon icon="ep:edit" class="mr-1" />编辑
            </BaseButton>
            <BaseButton @click="deteleAction(item)" type="danger" class="delete-btn">
              <Icon icon="ep:delete" class="mr-1" />删除
            </BaseButton>
          </div>
        </div>
      </div>
    </template>

    <div class="add-action-card" @click="action('add', null)">
      <Icon size="40" icon="fluent:add-square-48-regular" class="add-icon" />
      <span class="add-text">添加动作</span>
    </div>

    <ActionDetail
      ref="actionDetailRef"
      @update="updataActionlist(props.SecondCategoryID)"
      :secondCategoryId="props.SecondCategoryID"
      :actionId="actionId"
      :actionType="actionType"
    />
  </div>
</template>

<style scoped>
.action-list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px; /* 增加卡片间距 */
  padding: 20px; /* 增加容器内边距 */
}

.action-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.action-image-container {
  position: relative;
  width: 100%; /* 固定宽度 */
  height: 140px; /* 固定高度，保持正方形 */
  overflow: hidden;
  flex-shrink: 0;
}

.action-image {
  width: 100%;
  height: 100%;
}

:deep(.el-image__inner) {
  object-fit: cover !important;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
}

.action-content {
  padding: 8px 6px 0px 6px;
  display: flex;
  flex-direction: column;
  height: 70px; /* 设置固定高度 */
}

.action-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-height: 20px; /* 设置最小高度 */
  line-height: 20px; /* 设置行高 */
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.edit-btn,
.delete-btn {
  padding: 2px 8px; /* 调整内边距 */
  font-size: 11px; /* 减小字体 */
  height: 24px; /* 固定高度 */
  border-radius: 4px; /* 圆角 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn :deep(.icon),
.delete-btn :deep(.icon) {
  font-size: 12px; /* 图标大小 */
  margin-right: 2px; /* 图标和文字的间距 */
}

.add-action-card {
  width: 140px; /* 固定宽度 */
  height: 200px; /* 固定高度 */
  min-height: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-action-card:hover {
  border-color: var(--el-color-primary);
  background: #f0f2f5;
}

.add-icon {
  color: #909399;
  margin-bottom: 8px;
}

.add-text {
  color: #606266;
  font-size: 14px;
}

.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
}
</style>
