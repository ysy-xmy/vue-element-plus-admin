<script setup lang="ts">
import { ref, watch, defineProps, PropType } from 'vue'
import type { actionitemArray } from '../types/index'

interface IPicUrl {
    ID: number;
    URL: string;
}

interface IItem {
    id: number | string;
    title: string;
    orderid: number;
    children: IItem[]; // 假设子项也是IItem类型的数组
    intro: string;
    picurl: IPicUrl[];
    isActive: boolean;
}

const props = defineProps({
    actionlist: {
        type: Array as PropType<IItem[]>,
        default: () => []
    },
    defaultActive: {
        type: String,
        default: '0'
    }
});


</script>

<template>
    <div style="flex-wrap: wrap;" class="demo-image flex wrap justify-space-between w-full  px-8 justify-start">
        <div v-for="item in props.actionlist" :key="item.id" style="width: 22%"
            class=" flex justify-center items-center flex-col p-3 ">


            <el-image v-if="item.id !== '-1'" :src="item.picurl[0].URL" fit="fill" />
            <div v-if="item.id !== '-1'" class="mt-2 w-full flex flex-col justify-around items-center content-center">

                <div class="demonstration w-full font-600 text-center">{{ item.title }}</div>

                <div class='flex flex-row mt-1'>
                    <BaseButton type="primary">
                        编辑
                    </BaseButton>
                    <BaseButton type="danger">
                        删除
                    </BaseButton>
                </div>
            </div>
            <el-empty v-else description="暂无数据" />

        </div>
        <div class="flex justify-center items-center flex-col p-3 mt-10" style="width: 15%">
            <Icon :size="150" icon="fluent:add-square-48-regular" />

            <span class="demonstration mt-2 ">添加新的动作</span>
        </div>

    </div>
</template>
