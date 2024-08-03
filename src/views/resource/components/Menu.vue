<script setup lang="ts">
import { ref, computed, watch, } from 'vue';
import Actionitem from '@/views/resource/components/Actionitem.vue'
import { actionrouter } from '../types'
import { Dialog } from '@/components/Dialog'
import { ElMessageBox } from 'element-plus'
import Menuedit from '@/views/resource/components/Menuedit.vue'
import { getFirstmenulist, getSecByFirst, getActionsBySec } from '@/api/resource'
import { t } from '@wangeditor/editor';
import Loading from 'xgplayer/es/plugins/loading';
const dialogVisible = ref(false);
const dialogTitle = ref('');
const selectedSecondOption = ref('');
const actionrouterList: any = ref([])
const selectedAction = ref<actionrouter | null>(null);
// var actionrouterList: actionrouter[] = [
//     {
//         title: '自重',
//         id: '1',
//         children: [

//             {
//                 id: '1-2',
//                 title: '背',
//                 children: [
//                     { title: '杠铃卧推', 'id': "234", 'picurl': '/resource/action/1', 'videoUrl': '', 'intro': "简介", children: [] },],
//                 orderid: 2

//             },
//             {
//                 id: '1-1',
//                 title: '上胸',
//                 children: [
//                     { title: '杠铃卧推', 'id': "902", 'picurl': '/resource/action/1', 'videoUrl': '', 'intro': "简介", children: [] },
//                 ],
//                 orderid: 5

//             },
//             {
//                 id: '1-3',
//                 title: '腿', children: [
//                     { title: '杠铃卧推', 'id': "531", 'picurl': '/resource/action/1', 'videoUrl': '', 'intro': "简介", children: [] },],
//                 orderid: 3
//             },
//             {
//                 id: '1-4',
//                 title: '手', children: [
//                     { title: '杠铃卧推', 'id': "2345", 'picurl': '/resource/action/1', 'videoUrl': '', 'intro': "简介", children: [] },
//                 ],
//                 orderid: 4
//             },
//         ],
//         orderid: 1
//     },
//     {
//         id: '2',
//         title: '杠铃',
//         children: [],
//         orderid: 4

//     },
//     {
//         id: '3',
//         title: '哑铃',
//         children: [],
//         orderid: 3
//     },
// ]
const selectedFirstOption = ref<'' | null>(null);
const menuloading = ref(false)
// getFirstmenulist().then(res => {
//     console.log(res)
// })
const actionlist = ref([])


menuloading.value = true
getFirstmenulist().then(res => {


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

}).finally(() => {
    menuloading.value = false
})






const firstoptions = computed(() => {
    return actionrouterList.map(({ title }) => ({ value: title, label: title }));
});


// 二级选项的响应式引用
const secondOptionsRef = ref<actionrouter[]>([]);
// 计算属性，基于响应式引用secondOptionsRef
const secondoptions = computed(() => {
    return secondOptionsRef.value.map(({ title }) => ({ value: title, label: title }));
});

// 监听selectedFirstOption的变化
watch(selectedFirstOption, (newValue, oldValue) => {
    if (newValue && newValue.children) {
        secondOptionsRef.value = newValue.children;
    } else {
        secondOptionsRef.value = []; // 如果没有子项，则清空二级菜单
    }
    console.log(newValue, oldValue);
});


const actionType = ref('')
const currentRow = ref<actionrouter>()

const action = (row: actionrouter, type: string) => {
    dialogTitle.value = '编辑目录';
    actionType.value = type;
    currentRow.value = row; // 直接赋值，不需要 unref(treeEl)
    dialogVisible.value = true;
    console.log(dialogVisible.value)
};

// const addData = async () => {
//     // if (inputfirstmenu.value && inputsecondmenu.value) {
//     //     actionrouterList.push({ title: inputfirstmenu.value, children: [{ title: inputsecondmenu.value }] });
//     //     inputfirstmenu.value = '';
//     //     inputsecondmenu.value = '';
//     // }
// }

// const delData = async () => {
//     ElMessageBox.confirm(`确认删除该目录及其下所有动作资源？`, '提示', {
//         confirmButtonText: '确认',
//         cancelButtonText: '取消',
//         type: 'warning'
//     })

// }
const getSelection = (item) => {
    var firstmenuid = item.id
    console.log(item)

    if (item.children.length > 0) {

    } else {
        menuloading.value = true
        getSecByFirst(firstmenuid).then(res => {
            console.log(res)
            if (res.data.length > 0) {
                actionrouterList.value.find(item => item.id === firstmenuid)!.children = res.data.map(item => {
                    return {
                        id: item.ID,
                        title: item.Name,
                        orderid: item.OrderNum,
                        children: [],
                        isActive: true

                    }
                })

            }
            else {
                actionrouterList.value.find(item => item.id === firstmenuid)!.children = [
                    {
                        id: '-1',
                        title: `------该目录下暂无数据------`,
                        orderid: 100,
                        children: [],
                        isActive: false
                    }
                ]
            }


        }).finally(() => {
            menuloading.value = false
        })
    }

}

const getActions = async (item) => {
    const secid = item.id;
    actionlist.value = []
    if (item.children.length > 0) {

        actionlist.value = item.children;
        console.log(item.children)
    } else {
        menuloading.value = true;
        try {
            const res = await getActionsBySec(secid);
            if (res.data.length > 0) {
                item.children = res.data.map(e => ({
                    id: e.ID,
                    title: e.Name,
                    orderid: e.OrderNum,
                    children: [],
                    intro: e.Description,
                    picurl: e.Imgs,
                    videos: e.Videos,
                    isActive: true
                }));

            } else {
                item.children = [
                    {
                        id: '-1',
                        title: `------该目录下暂无数据------`,
                        orderid: 100,
                        children: [],
                        isActive: false
                    }
                ];
                menuloading.value = false;
                actionlist.value = item.children;
                console.log(item.children)
            }
        } catch (error) {
            console.error("Error fetching actions:", error);
            // Handle error appropriately
        } finally {
            menuloading.value = false;
            actionlist.value = item.children;
            console.log(item.children)

        }
    }
};

const selectaction = ref(false)
const currentAction = ref('')
const selectedkeyPath = ref<string[]>([])
const handleSelect = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
    currentAction.value = key
    if (keyPath.length > 1) {
        selectaction.value = true

    }
    selectedkeyPath.value = keyPath
}
const actiondetail = (item) => {
    console.log(item)
}


</script>
<template>
    <div class="flex w-100% h-100%">
        <el-row v-loading="menuloading" class="tac w-full">
            <el-col :span="8">
                <h5 class="mb-2">动作库</h5>
                <el-menu @select="handleSelect" default-active="2" class="el-menu-vertical-demo">
                    <template v-for="item in actionrouterList" :key="item.title">
                        <el-sub-menu v-if="item.children.length > 0" :index="item.title">
                            <template #title>
                                <Icon icon="ep:aim" />
                                <span>{{ item.title }}</span>
                            </template>
                            <template v-for="child in item.children" :key="child.title">
                                <el-menu-item @click="getActions(child)" v-if="child.children.length > 0"
                                    :index="child.title">
                                    <template #title>
                                        <Icon icon="ep:aim" />
                                        {{ child.title }}
                                    </template>
                                    <!-- <el-menu-item>


                                        <p style="font-size: 15px;color: #666;margin-top: 5px;">
                                            <Icon icon="tabler:badge-hd"></Icon>
                                            <el-text class="mx-1" type="warning">{{ child.title }}</el-text>

                                        </p>

                                    </el-menu-item> -->

                                    <!-- <el-menu-item @click="actiondetail(child)" :disabled="!child.isActive"
                                        v-for="subChild in child.children" :key="subChild.title"
                                        :index="subChild.title">


                                        <el-menu-item disabled v-if="subChild.id == '-1'">
                                            <p style="font-size: 15px;color: #666;margin-top: 5px;">
                                                <Icon icon="tabler:badge-hd"></Icon>
                                                <el-text class="mx-1" type="warning">{{ subChild.title }}</el-text>

                                            </p>

                                        </el-menu-item>
                                        <el-menu-item disabled v-else>


                                            <p style="font-size: 15px;color: #666;margin-top: 5px;">
                                                <Icon icon="tabler:badge-hd"></Icon>
                                                <el-text class="mx-1" type="warning">{{ subChild.title }}</el-text>

                                            </p>

                                        </el-menu-item>


                                    </el-menu-item> -->
                                </el-menu-item>
                                <el-menu-item :disabled="!child.isActive" @click="getActions(child)" v-else
                                    :index="child.title">
                                    <Icon icon="ep:aim" />
                                    {{ child.title }}
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                        <el-menu-item :disabled="!item.isActive" v-else @click="getSelection(item)" :index="item.title">
                            <Icon icon="ep:aim" />
                            <span>{{ item.title }}</span>

                        </el-menu-item>
                        <!-- <el-sub-menu @click="getSelection(item.id)" v-else :index="item.title">
                            <template #title>
                                <Icon icon="ep:aim" />
                                <span>{{ item.title }}</span>
                            </template>
                            <template>

                                <el-menu-item>
                                    没有数据
                                </el-menu-item>
                            </template>
                        </el-sub-menu> -->


                    </template>
                    <el-menu-item index="4">
                        <BaseButton style="width: 100%;" type="primary" size="large"
                            @click="action({ title: '新动作' }, 'edit')">编辑目录
                        </BaseButton>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="16">
                <Actionitem :actionlist="actionlist" v-if="selectaction" />
                <div v-else class="demo-image flex wrap justify-space-between w-full  px-8 justify-center">
                    <el-empty description="暂无数据" />

                </div>

            </el-col>

        </el-row>
        <Dialog height="700" v-model="dialogVisible" :title="dialogTitle">
            <!-- <div v-if="actionType === 'add'" class=" ">
                <h1>删除目录</h1>
                <div class="delete-box w-100% h-100% flex justify-evenly items-center">
                    <span>一级目录名：</span>
                    <el-select @change="updateFirstOption" clearable v-model="selectedFirstOption" placeholder="一级目录名"
                        size="large" style="width: 160px">
                        <el-option v-for="item in firstoptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <span>二级目录名：</span>

                    <el-select clearable v-model="selectedSecondOption" placeholder="二级目录名" size="large"
                        style="width: 160px">
                        <el-option v-for="item in secondoptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>

                    <BaseButton type="danger" size="large" @click="delData()">删除</BaseButton>
                </div>
                <el-divider content-position="right"></el-divider>
                <h1>新增目录</h1>
                <div class="delete-box w-100% h-100% flex justify-evenly items-center">
                    <span>一级目录名：</span>
                    <el-input v-model="inputfirstmenu" size="large" style="width: 160px" placeholder="一级目录名" />

                    <span>二级目录名：</span>

                    <el-input v-model="inputsecondmenu" size="large" style="width: 160px" placeholder="二级目录名" />


                    <BaseButton type="primary" size="large" @click="addData">新增</BaseButton>
                </div>
            </div> -->
            <div v-if="actionType === 'edit'" class="flex w-full h-100% justify-center items-start content-start">
                <Menuedit :currentRow="currentRow" :actionrouterList="actionrouterList" />
            </div>
        </Dialog>
    </div>
</template>