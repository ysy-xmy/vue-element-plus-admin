<script setup lang="ts">
import { ref } from 'vue';
import Actionitem from '@/views/resource/components/Actionitem.vue'
import { actionrouter } from '../types'
import { Dialog } from '@/components/Dialog'
import Menuedit from '@/views/resource/components/Menuedit.vue'
import { getFirstmenulist, getSecByFirst, getActionsBySec } from '@/api/resource'
import { orderlist } from '@/store/modules/permission'
import { onMounted } from 'vue';
const Visible = ref(false);
const dialogTitle = ref('');
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
        actionrouterList.value = orderlist(actionrouterList.value)

    }).finally(() => {
        menuloading.value = false
    })
}
const action = (row: actionrouter, type: string) => {
    dialogTitle.value = '编辑目录';
    actionType.value = type;
    currentRow.value = row; // 直接赋值，不需要 unref(treeEl)
    Visible.value = true;
    console.log(Visible.value)
};
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
            actionrouterList.value = orderlist(actionrouterList.value)

            menuloading.value = false

        })
    }

}
const SecondCategoryID = ref(0)

const getActions = async (item) => {
    const secid = item.id;
    SecondCategoryID.value = secid
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
};


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
        actionrouterList.value = orderlist(actionrouterList.value)

    }).finally(() => {
        menuloading.value = false
    })
}

const handleUpdateValue = async (value: any) => {
    menuloading.value = true;
    try {
        let data
        const res = await getActionsBySec(String(SecondCategoryID.value));
        if (res.data.length > 0) {
            data = res.data.map(e => ({
                id: e.ID,
                title: e.Name,
                orderid: e.OrderNum,
                children: [],
                intro: e.Description,
                picurl: e.Imgs,
                videos: e.Videos,
                isActive: true
            }));
            actionlist.value = data;

        } else {
            data = [
                {
                    id: '-1',
                    title: `------该目录下暂无数据------`,
                    orderid: 100,
                    children: [],
                    isActive: false
                }
            ];
            menuloading.value = false;
            actionlist.value = data;
            console.log(data)
        }
    } catch (error) {
        console.error("Error fetching actions:", error);
        // Handle error appropriately
    } finally {
        menuloading.value = false;


    }

}
onMounted(() => {
    init()
})

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
                    </template>
                    <el-menu-item index="4">
                        <BaseButton style="width: 100%;" type="primary" size="large"
                            @click="action({ title: '新动作' }, 'edit')">编辑目录
                        </BaseButton>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="16">
                <Actionitem @updataActionlist="handleUpdateValue" :SecondCategoryID="SecondCategoryID"
                    :actionlist="actionlist" v-if="selectaction" />
                <div v-else class="demo-image flex wrap justify-space-between w-full  px-8 justify-center">
                    <el-empty description="暂无数据" />
                </div>
            </el-col>
        </el-row>
        <Dialog height="700" v-model="Visible" @close="dialogclose" :title="dialogTitle">

            <div v-if="actionType === 'edit'" class="flex w-full h-100% justify-center items-start content-start">
                <Menuedit :currentRow="currentRow" :actionrouterList="actionrouterList" />
            </div>
        </Dialog>
    </div>
</template>