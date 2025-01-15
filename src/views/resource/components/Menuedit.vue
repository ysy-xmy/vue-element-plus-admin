<template>
  <div v-loading="menuloading" class="menu-component">
    <!-- 新的头部布局 -->
    <div class="header-section">
      <el-button type="primary" class="add-menu-btn" @click="addfirstMenu">
        <Icon :size="20" icon="ep:plus" class="mr-2" />
        新建一级目录
      </el-button>
    </div>

    <!-- 优化的菜单列表 -->
    <el-card v-for="(menu, index) in menus" :key="index" class="menu-card">
      <div class="menu-header">
        <div class="menu-title">
          <Icon :size="24" icon="ep:folder" class="mr-2" />
          <span>{{ menu.title }}</span>
        </div>

        <div class="menu-actions">
          <el-tooltip content="编辑名称">
            <el-button @click="renameMenu(index, menu.id)" type="primary" text>
              <Icon :size="20" icon="ep:edit" />
            </el-button>
          </el-tooltip>

          <el-button-group>
            <el-tooltip content="上移">
              <el-button v-if="index > 0" @click="moveUp(index)" type="primary" text>
                <Icon :size="20" icon="ep:arrow-up" />
              </el-button>
            </el-tooltip>

            <el-tooltip content="下移">
              <el-button
                v-if="index < menus.length - 1"
                @click="moveDown(index)"
                type="primary"
                text
              >
                <Icon :size="20" icon="ep:arrow-down" />
              </el-button>
            </el-tooltip>
          </el-button-group>

          <el-tooltip content="删除">
            <el-button @click="deleteMenu(index)" type="danger" text>
              <Icon :size="20" icon="ep:delete" />
            </el-button>
          </el-tooltip>

          <el-tooltip content="展开/收起">
            <el-button @click="toggleSubMenu(index)" type="primary" text>
              <Icon :size="20" :icon="menu.isActive ? 'ep:arrow-up' : 'ep:arrow-down'" />
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- 子菜单部分 -->
      <transition name="el-zoom-in-top">
        <div v-show="menu.isActive" class="submenu-section">
          <el-table :data="menu.children" stripe>
            <el-table-column label="名称" prop="title" />
            <el-table-column label="优先级" width="200">
              <template #default="{ row, $index }">
                <div class="priority-cell">
                  <el-input-number
                    v-model="row.orderid"
                    :min="1"
                    :max="100"
                    @change="inedit(index, $index)"
                    @focus="inedit(index, $index)"
                  />
                  <div v-if="row.editorder" class="confirm-actions">
                    <el-button type="success" text @click="confirmOrder(index, $index)">
                      <Icon :size="20" icon="ep:check" />
                    </el-button>
                    <el-button type="danger" text @click="cancelOrder(index, $index)">
                      <Icon :size="20" icon="ep:close" />
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ $index }">
                <el-button-group>
                  <el-tooltip content="编辑">
                    <el-button type="primary" text @click="renameSubMenu(index, $index, menu.id)">
                      <Icon :size="20" icon="ep:edit" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="删除">
                    <el-button type="danger" text @click="deleteSubMenu(index, $index)">
                      <Icon :size="20" icon="ep:delete" />
                    </el-button>
                  </el-tooltip>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>

          <el-button
            class="add-submenu-btn"
            @click="addSubMenu(index, menu.id)"
            type="primary"
            text
          >
            <Icon :size="20" icon="ep:plus" class="mr-2" />
            新建二级目录
          </el-button>
        </div>
      </transition>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, PropType } from 'vue'
import { actionrouter } from '../types'
import { ElMessageBox, ElMessage } from 'element-plus'
import { orderlist } from '@/store/modules/permission'
import { addFirst, addSec, updateFirst, updateSec, getAll, delFirst, delSec } from '@/api/resource'
import { transformToTargetFormat } from './transale'
const menuloading = ref(false)

const editorderid = ref<number | undefined>()
const confirmOrder = (orderid: number, subIndex: number) => {
  menus.value[orderid].children[subIndex].orderid = editorderid.value
  menus.value[orderid].children[subIndex].editorder = false

  updateSec({
    Name: menus.value[orderid].children[subIndex].title,
    ID: menus.value[orderid].children[subIndex].id,
    OrderNum: editorderid.value,
    FirstCategoryID: menus.value[orderid].id
  })
  menus.value = orderlist(menus.value)
}
const cancelOrder = (orderid: number, subIndex: number) => {
  menus.value[orderid].children[subIndex].editorder = false
  menus.value = orderlist(menus.value)
}
const inedit = (menuIndex: number, subIndex: number) => {
  console.log('在编辑')
  editorderid.value = menus.value[menuIndex].children[subIndex].orderid
  menus.value[menuIndex].children[subIndex].editorder = true
}
// const props = defineProps({
//     actionrouterList: {
//         // type: Array as PropType<Menu[]>,
//         type: Array as PropType<actionrouter[]>,
//         default: () => []
//     },
//     defaultActive: {
//         type: String,
//         default: '0'
//     }
// });
menuloading.value = true
var menus = ref<any[]>([])
getAll().then((res) => {
  menuloading.value = false
  console.log(res)
  menus.value = orderlist(transformToTargetFormat(res.data))
})

function removeItemById(items, idToRemove) {
  return items.map((item) => ({
    ...item,
    children: item.children.filter((child) => child.id !== idToRemove)
  }))
}

const resetAllOrderNums = async () => {
  menuloading.value = true
  // 获取所有一级目录并按当前顺序重新设置序号
  const updatePromises = menus.value.map((menu, index) => {
    return updateFirst({
      Name: menu.title,
      ID: menu.id,
      OrderNum: (index + 1) * 10
    })
  })

  try {
    await Promise.all(updatePromises)
    await getAll().then((res) => {
      menus.value = orderlist(transformToTargetFormat(res.data))
    })
  } finally {
    menuloading.value = false
  }
}

const moveUp = async (index: number) => {
  if (index > 0) {
    menuloading.value = true
    try {
      // 保存当前所有菜单的展开状态
      const activeStates = menus.value.map((menu) => menu.isActive)

      const currentItem = menus.value[index]
      const prevItem = menus.value[index - 1]

      if (!currentItem?.orderid || !prevItem?.orderid) {
        ElMessage.error('移动失败：序号无效')
        return
      }

      const currentOrder = currentItem.orderid
      const prevOrder = prevItem.orderid

      await Promise.all([
        updateFirst({
          Name: currentItem.title,
          ID: currentItem.id,
          OrderNum: prevOrder
        }),
        updateFirst({
          Name: prevItem.title,
          ID: prevItem.id,
          OrderNum: currentOrder
        })
      ])

      ElMessage.success('移动成功')
      await getAll().then((res) => {
        menus.value = orderlist(transformToTargetFormat(res.data))
        // 恢复展开状态
        menus.value.forEach((menu, i) => {
          menu.isActive = activeStates[i]
        })
      })
    } catch (error) {
      ElMessage.error('移动失败，请重试')
      console.error('Move up error:', error)
    } finally {
      menuloading.value = false
    }
  }
}

const moveDown = async (index: number) => {
  const lastIndex = menus.value.length - 1
  if (index < lastIndex) {
    menuloading.value = true
    try {
      // 保存当前所有菜单的展开状态
      const activeStates = menus.value.map((menu) => menu.isActive)

      const currentItem = menus.value[index]
      const nextItem = menus.value[index + 1]

      if (!currentItem?.orderid || !nextItem?.orderid) {
        ElMessage.error('移动失败：序号无效')
        return
      }

      const currentOrder = currentItem.orderid
      const nextOrder = nextItem.orderid

      await Promise.all([
        updateFirst({
          Name: currentItem.title,
          ID: currentItem.id,
          OrderNum: nextOrder
        }),
        updateFirst({
          Name: nextItem.title,
          ID: nextItem.id,
          OrderNum: currentOrder
        })
      ])

      ElMessage.success('移动成功')
      await getAll().then((res) => {
        menus.value = orderlist(transformToTargetFormat(res.data))
        // 恢复展开状态
        menus.value.forEach((menu, i) => {
          menu.isActive = activeStates[i]
        })
      })
    } catch (error) {
      ElMessage.error('移动失败，请重试')
      console.error('Move down error:', error)
    } finally {
      menuloading.value = false
    }
  }
}

const toggleSubMenu = (index: number) => {
  menus.value[index].isActive = !menus.value[index].isActive
}

const deleteMenu = (menuIndex: number) => {
  ElMessageBox.confirm(`确认删除该目录及其下所有动作资源？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      delFirst([menus.value[menuIndex].id]).then(() => {
        ElMessage.success('删除成功')
        // 删除成功后重新获取所有菜单数据
        getAll().then((res) => {
          menus.value = orderlist(transformToTargetFormat(res.data))
        })
      })
    })
    .catch(() => {
      // catch error
    })
}

const deleteSubMenu = (menuIndex: number, subMenuIndex: number) => {
  ElMessageBox.confirm(`确认删除该目录及其下所有动作资源？`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      delSec([menus.value[menuIndex].children[subMenuIndex].id]).then(() => {
        ElMessage.success('删除成功')
        // 删除成功后重新获取所有菜单数据
        getAll().then((res) => {
          menus.value = orderlist(transformToTargetFormat(res.data))
        })
      })
    })
    .catch(() => {
      // catch error
    })
}
const renameMenu = (index: number, firstmenuid: string) => {
  const newName = prompt('请输入新的菜单名称', menus.value[index].title)
  var orderid = menus.value[index].orderid
  if (newName && newName.trim() !== '') {
    menus.value[index].title = newName
  }
  updateFirst({
    Name: newName,
    ID: firstmenuid,
    OrderNum: orderid
  }).then((res) => {
    console.log(res)
  })
}

const addfirstMenu = () => {
  const newName = prompt('请输入新的菜单名称')
  if (newName && newName.trim() !== '') {
    // 计算新的 orderid：找到当前最大的 orderid，然后加 10
    const maxOrderId = menus.value.reduce((max, menu) => {
      return Math.max(max, menu.orderid || 0)
    }, 0)

    const newOrderId = maxOrderId + 10

    addFirst([
      {
        Name: newName,
        OrderNum: newOrderId
      }
    ]).then(() => {
      ElMessage.success('添加成功')
      getAll().then((res) => {
        menus.value = orderlist(transformToTargetFormat(res.data))
      })
    })
  }
}

const renameSubMenu = (menuIndex: number, subMenuIndex: number, firstmenuid: string) => {
  if (menus.value[menuIndex].children?.length) {
    const newName = prompt(
      '请输入新的子菜单名称',
      menus.value[menuIndex].children[subMenuIndex].title
    )
    if (newName && newName.trim() !== '') {
      menus.value[menuIndex].children[subMenuIndex].title = newName
    }
  }
  updateSec({
    Name: menus.value[menuIndex].children[subMenuIndex].title,
    ID: menus.value[menuIndex].children[subMenuIndex].id,
    OrderNum: menus.value[menuIndex].children[subMenuIndex].orderid,
    FirstCategoryID: firstmenuid
  }).then((res) => {
    console.log(res)
  })
}

const addSubMenu = (menuIndex: number, firstmenuid: string) => {
  const newName = prompt('请输入新的子菜单名称')
  let orderid = 34567
  if (newName && newName.trim() !== '') {
    addSec([
      {
        Name: newName,
        OrderNum: orderid,
        FirstCategoryID: firstmenuid
      }
    ]).then(() => {
      ElMessage.success('添加成功')
      // 重新获取所有菜单数据以确保有正确的ID
      getAll().then((res) => {
        menus.value = orderlist(transformToTargetFormat(res.data))
      })
    })
  }
}

const viewMode = ref('table')

// 处理树节点拖拽
const handleDragEnd = async (draggingNode, dropNode, dropType) => {
  menuloading.value = true
  try {
    // 根据拖拽类型更新顺序
    if (dropType === 'inner') {
      // 处理成为子节点的情况
      await updateSec({
        ID: draggingNode.data.id,
        FirstCategoryID: dropNode.data.id,
        Name: draggingNode.data.title,
        OrderNum: draggingNode.data.orderid
      })
    } else {
      // 处理同级排序
      await resetAllOrderNums()
    }

    // 重新加载数据
    await getAll().then((res) => {
      menus.value = orderlist(transformToTargetFormat(res.data))
    })
  } catch (error) {
    ElMessage.error('更新失败')
  } finally {
    menuloading.value = false
  }
}

// 处理编辑节点
const handleEdit = (node, data) => {
  if (data.children) {
    renameMenu(node.parent.childNodes.indexOf(node), data.id)
  } else {
    const parentIndex = menus.value.findIndex((m) => m.id === node.parent.data.id)
    renameSubMenu(parentIndex, node.parent.childNodes.indexOf(node), node.parent.data.id)
  }
}

// 处理删除节点
const handleDelete = (node, data) => {
  if (data.children) {
    deleteMenu(node.parent.childNodes.indexOf(node))
  } else {
    const parentIndex = menus.value.findIndex((m) => m.id === node.parent.data.id)
    deleteSubMenu(parentIndex, node.parent.childNodes.indexOf(node))
  }
}
</script>

<style scoped>
.menu-component {
  padding: 32px;
  background-color: #f5f7fa;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.header-section {
  margin-bottom: 32px;
  text-align: right;
  width: 100%;
}

.add-menu-btn {
  font-size: 16px;
  padding: 12px 24px;
}

.menu-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.menu-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  padding: 0 12px;
}

.menu-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 0 12px;
}

.submenu-section {
  margin-top: 16px;
  padding: 24px;
  background-color: #fafafa;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: auto;
}

.priority-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.confirm-actions {
  display: flex;
  gap: 8px;
  padding: 0 8px;
}

.add-submenu-btn {
  margin-top: 24px;
  width: 100%;
  padding: 12px 0;
}

/* 动画效果 */
.el-zoom-in-top-enter-active,
.el-zoom-in-top-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

.el-zoom-in-top-enter-from,
.el-zoom-in-top-leave-to {
  opacity: 0;
  transform: scaleY(0);
  transform-origin: top;
}

/* 确保表格撑满容器 */
:deep(.el-table) {
  width: 100% !important;
  box-sizing: border-box;
}

:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

/* 确保表格内容不会溢出 */
:deep(.el-table__body) {
  width: 100%;
}

.view-controls {
  margin-bottom: 16px;
}

.tree-view {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 0;
}

.node-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .node-actions {
  opacity: 1;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
