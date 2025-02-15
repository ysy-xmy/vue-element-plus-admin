<script setup lang="ts">
import { ref } from 'vue'
import Actionitem from '@/views/resource/components/Actionitem.vue'
import { actionrouter } from '../types'
import { Dialog } from '@/components/Dialog'
import Menuedit from '@/views/resource/components/Menuedit.vue'
import { getFirstmenulist, getSecByFirst, getActionsBySec } from '@/api/resource'
import { orderlist } from '@/store/modules/permission'
import { onMounted } from 'vue'
const Visible = ref(false)
const dialogTitle = ref('')
const actionrouterList: any = ref([])
const selectaction = ref(false)
const currentAction = ref('')
const selectedkeyPath = ref<string[]>([])
const actionType = ref('')
const currentRow = ref<actionrouter>()
const menuloading = ref(false)
const actionlist = ref([])

const init = () => {
  actionrouterList.value = []
  menuloading.value = true
  selectaction.value = false
  getFirstmenulist()
    .then((res) => {
      for (let item of res.data) {
        let data: actionrouter = {
          title: item.Name,
          id: item.ID,
          orderid: item.OrderNum,
          children: [],
          isActive: true
        }
        actionrouterList.value.push(data)
      }
      actionrouterList.value = orderlist(actionrouterList.value)
    })
    .finally(() => {
      menuloading.value = false
    })
}
const action = (row: actionrouter, type: string) => {
  dialogTitle.value = '编辑目录'
  actionType.value = type
  currentRow.value = row // 直接赋值，不需要 unref(treeEl)
  Visible.value = true
  console.log(Visible.value)
}
const getSelection = (item) => {
  var firstmenuid = item.id
  console.log(item)

  if (item.children.length > 0) {
  } else {
    menuloading.value = true
    getSecByFirst(firstmenuid)
      .then((res) => {
        console.log(res)
        if (res.data.length > 0) {
          actionrouterList.value.find((item) => item.id === firstmenuid)!.children = res.data.map(
            (item) => {
              return {
                id: item.ID,
                title: item.Name,
                orderid: item.OrderNum,
                children: [],
                isActive: true
              }
            }
          )
        } else {
          actionrouterList.value.find((item) => item.id === firstmenuid)!.children = [
            {
              id: '-1',
              title: `------该目录下暂无数据------`,
              orderid: 100,
              children: [],
              isActive: false
            }
          ]
        }
      })
      .finally(() => {
        actionrouterList.value = orderlist(actionrouterList.value)

        menuloading.value = false
      })
  }
}
const SecondCategoryID = ref(0)

const getActions = async (item) => {
  const secid = item.id
  SecondCategoryID.value = secid
  menuloading.value = true
  try {
    const res = await getActionsBySec(secid)
    if (res.data.length > 0) {
      item.children = res.data.map((e) => ({
        id: e.ID,
        title: e.Name,
        orderid: e.OrderNum,
        children: [],
        intro: e.Description,
        picurl: e.Imgs,
        videos: e.Videos,
        isActive: true
      }))
    } else {
      item.children = [
        {
          id: '-1',
          title: `------该目录下暂无数据------`,
          orderid: 100,
          children: [],
          isActive: false
        }
      ]
      menuloading.value = false
      actionlist.value = item.children
      console.log(item.children)
    }
  } catch (error) {
    console.error('Error fetching actions:', error)
    // Handle error appropriately
  } finally {
    menuloading.value = false
    actionlist.value = item.children
    console.log(item.children)
  }
}

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  currentAction.value = key
  if (keyPath.length > 1) {
    selectaction.value = true
  }
  selectedkeyPath.value = keyPath
}

const dialogclose = () => {
  actionrouterList.value = []
  menuloading.value = true
  selectaction.value = false
  getFirstmenulist()
    .then((res) => {
      for (let item of res.data) {
        let data: actionrouter = {
          title: item.Name,
          id: item.ID,
          orderid: item.OrderNum,
          children: [],
          isActive: true
        }
        actionrouterList.value.push(data)
      }
      actionrouterList.value = orderlist(actionrouterList.value)
    })
    .finally(() => {
      menuloading.value = false
    })
}

const handleUpdateValue = async (value: any) => {
  menuloading.value = true
  try {
    let data
    const res = await getActionsBySec(String(SecondCategoryID.value))
    if (res.data.length > 0) {
      data = res.data.map((e) => ({
        id: e.ID,
        title: e.Name,
        orderid: e.OrderNum,
        children: [],
        intro: e.Description,
        picurl: e.Imgs,
        videos: e.Videos,
        isActive: true
      }))
      actionlist.value = data
    } else {
      data = [
        {
          id: '-1',
          title: `------该目录下暂无数据------`,
          orderid: 100,
          children: [],
          isActive: false
        }
      ]
      menuloading.value = false
      actionlist.value = data
      console.log(data)
    }
  } catch (error) {
    console.error('Error fetching actions:', error)
    // Handle error appropriately
  } finally {
    menuloading.value = false
  }
}
onMounted(() => {
  init()
})
</script>
<template>
  <div class="resource-container">
    <el-row v-loading="menuloading" class="h-full">
      <!-- 左侧菜单 -->
      <el-col :span="6" class="menu-sidebar">
        <div class="menu-header">
          <h4>动作库目录</h4>
          <el-button type="primary" link @click="action({ title: '新动作' }, 'edit')">
            <Icon icon="ep:plus" />
            编辑目录
          </el-button>
        </div>

        <el-menu @select="handleSelect" class="menu-tree" :default-active="currentAction">
          <template v-for="item in actionrouterList" :key="item.title">
            <el-sub-menu v-if="item.children.length > 0" :index="item.title">
              <template #title>
                <Icon icon="ep:folder" class="menu-icon" />
                <span>{{ item.title }}</span>
              </template>
              <template v-for="child in item.children" :key="child.title">
                <el-menu-item
                  @click="getActions(child)"
                  :disabled="!child.isActive"
                  :index="child.title"
                >
                  <Icon icon="ep:document" class="menu-icon" />
                  {{ child.title }}
                </el-menu-item>
              </template>
            </el-sub-menu>

            <el-menu-item
              v-else
              :disabled="!item.isActive"
              @click="getSelection(item)"
              :index="item.title"
            >
              <Icon icon="ep:folder" class="menu-icon" />
              <span>{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>

      <!-- 右侧内容区 -->
      <el-col :span="18" class="content-area">
        <Actionitem
          v-if="selectaction"
          @updata-actionlist="handleUpdateValue"
          :SecondCategoryID="SecondCategoryID"
          :actionlist="actionlist"
        />
        <el-empty v-else description="请选择左侧目录查看内容" :image-size="200" />
      </el-col>
    </el-row>

    <!-- 编辑弹窗 -->
    <Dialog width="60%" v-model="Visible" @close="dialogclose" :title="dialogTitle">
      <div v-if="actionType === 'edit'" class="edit-container">
        <Menuedit :currentRow="currentRow" :actionrouterList="actionrouterList" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.resource-container {
  height: 70vh;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow: auto; /* 防止内部滚动溢出 */
}

.menu-sidebar {
  border-right: 1px solid #e6e6e6;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.menu-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  flex-shrink: 0; /* 防止头部被压缩 */
}

.menu-header h4 {
  margin: 0;
  font-weight: 500;
  color: #303133;
}

.menu-tree {
  height: calc(100% - 60px);
  border-right: none;
  overflow-y: auto; /* 添加垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}

.menu-icon {
  margin-right: 8px;
  font-size: 16px;
}

.content-area {
  padding: 20px;
  height: 100%;
  background-color: #f5f7fa;
  overflow-y: auto; /* 添加垂直滚动条 */
  overflow-x: hidden; /* 隐藏水平滚动条 */
}

/* 自定义滚动条样式 */
.menu-tree::-webkit-scrollbar,
.content-area::-webkit-scrollbar {
  width: 6px;
}

.menu-tree::-webkit-scrollbar-thumb,
.content-area::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.menu-tree::-webkit-scrollbar-track,
.content-area::-webkit-scrollbar-track {
  background-color: transparent;
}

.edit-container {
  padding: 20px;
}
</style>
