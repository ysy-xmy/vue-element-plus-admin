<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Actionitem from '@/views/resource/components/Actionitem.vue'
import { actionrouter } from '../types'
import { Dialog } from '@/components/Dialog'
import { ElMessageBox } from 'element-plus'

const dialogVisible = ref(false);
const dialogTitle = ref('');
const selectedSecondOption = ref('');
var actionrouterList: actionrouter[] = [
    {
        title: '自重',
        id: '1',
        children: [
            {
                id: '1-1',
                title: '上胸', children: [
                    { title: '杠铃卧推', 'id': "902", 'picurl': '/resource/action/1', 'videoUrl': '', 'intro': "简介" },
                ]
            },
            {
                id: '1-2',
                title: '背', children: [
                    { title: '杠铃卧推', 'id': "234", 'picurl': '/resource/action/1', 'videoUrl': '', 'intro': "简介" },]
            },
            {
                id: '1-3',
                title: '腿', children: [
                    { title: '杠铃卧推', 'id': "531", 'picurl': '/resource/action/1', 'videoUrl': '', 'intro': "简介" },]
            },
            {
                id: '1-4',
                title: '手', children: [
                    { title: '杠铃卧推', 'id': "2345", 'picurl': '/resource/action/1', 'videoUrl': '', 'intro': "简介" },
                ]
            },
        ]
    },
    {
        id: '2',
        title: '杠铃',

    },
    {
        id: '3',
        title: '哑铃',
    },
]
const selectedFirstOption = ref<'' | null>(null);

const firstoptions = computed(() => {
    return actionrouterList.map(({ title }) => ({ value: title, label: title }));
});

// 二级选项的响应式引用
const secondOptionsRef = ref<Actionrouter[]>([]);

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

// 用于更新一级选项的方法
function updateFirstOption(value: string) {
    const selected = actionrouterList.find(item => item.title === value);
    selectedFirstOption.value = selected || null;
}

const inputfirstmenu = ref('');
const inputsecondmenu = ref('');



const actionType = ref('')
const currentRow = ref<actionrouter>()

const action = (row: actionrouter, type: string) => {
    dialogTitle.value = '编辑目录';
    actionType.value = type;
    currentRow.value = row; // 直接赋值，不需要 unref(treeEl)
    dialogVisible.value = true;
    console.log(dialogVisible.value)
};

const addData = async () => {
    // if (inputfirstmenu.value && inputsecondmenu.value) {
    //     actionrouterList.push({ title: inputfirstmenu.value, children: [{ title: inputsecondmenu.value }] });
    //     inputfirstmenu.value = '';
    //     inputsecondmenu.value = '';
    // }
}

const delData = async () => {
    ElMessageBox.confirm(`确认删除该目录及其下所有动作资源？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    })

}


</script>
<template>
    <div class="flex w-100% h-100%">
        <el-row class="tac">
            <el-col :span="8">
                <h5 class="mb-2">动作库</h5>
                <el-menu default-active="2" class="el-menu-vertical-demo">
                    <template v-for="item in actionrouterList" :key="item.title">
                        <el-sub-menu v-if="item.children" :index="item.title">
                            <template #title>
                                <Icon icon="ep:aim" />
                                <span>{{ item.title }}</span>
                            </template>
                            <template v-for="child in item.children" :key="child.title">
                                <el-sub-menu v-if="child.children" :index="child.title">
                                    <template #title>
                                        <Icon icon="ep:aim" />
                                        {{ child.title }}
                                    </template>
                                    <el-menu-item v-for="subChild in child.children" :key="subChild.title"
                                        :index="subChild.title">
                                        {{ subChild.title }}
                                    </el-menu-item>
                                </el-sub-menu>
                                <el-menu-item v-else :index="child.title">
                                    {{ child.title }}
                                </el-menu-item>
                            </template>
                        </el-sub-menu>
                        <el-menu-item v-else :index="item.title">
                            <Icon icon="ep:aim" />
                            <span>{{ item.title }}</span>
                        </el-menu-item>
                    </template>
                    <el-menu-item index="4">
                        <BaseButton style="width: 100%;" type="primary" size="large"
                            @click="action({ title: '新动作' }, 'add')">编辑目录
                        </BaseButton>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="16">
                <Actionitem />
            </el-col>

        </el-row>



        <Dialog v-model="dialogVisible" :title="dialogTitle">
            <div v-if="actionType === 'add'" class=" ">
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
            </div>

        </Dialog>
    </div>
</template>