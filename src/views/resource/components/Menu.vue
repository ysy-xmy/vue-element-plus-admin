<script setup lang="ts">
import { ref } from 'vue';
import type { actionitemArray } from '../types/index'
import Actionitem from '@/views/resource/components/Actionitem.vue'






</script>
<template>
    <el-row class="tac">
        <el-col :span="8">
            <h5 class="mb-2">动作库</h5>
            <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                <el-sub-menu index="1">
                    <template #title>
                        <Icon icon="ep:aim" />

                        <span>自重</span>
                    </template>
                    <el-sub-menu index="1-1">

                        <template #title>
                            <Icon icon="ep:aim" />
                            上胸
                        </template>
                        <el-menu-item index="1-1-1">杠铃卧推</el-menu-item>
                        <el-menu-item index="1-1-2">杠铃横推</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="1-2">
                        <template #title>
                            <Icon icon="ep:aim" />背
                        </template>
                        <el-menu-item index="1-2-1">杠铃卧推1</el-menu-item>
                        <el-menu-item index="1-2-2">杠铃横推2</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="1-3">
                        <template #title>
                            <Icon icon="ep:aim" />腿
                        </template>
                        <el-menu-item index="1-3-1">杠铃卧推1</el-menu-item>
                        <el-menu-item index="1-3-2">杠铃横推2</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="1-4">
                        <template #title>
                            <Icon icon="ep:aim" />手
                        </template>
                        <el-menu-item index="1-4-1">杠铃卧推1</el-menu-item>
                        <el-menu-item index="1-4-2">杠铃横推2</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <el-menu-item index="2">
                    <Icon icon="ep:aim" />

                    <span>杠铃</span>
                </el-menu-item>

                <el-menu-item index="3">
                    <Icon icon="ep:aim" />

                    <span>哑铃</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <BaseButton style="width: 100%;" type="primary" size="large"> 编辑一级目录 </BaseButton>
                    <!-- <el-button  type="primary" width="200px" text bg>
                        Add
                    </el-button> -->
                </el-menu-item>


            </el-menu>
        </el-col>
        <el-col :span="16">
            <Actionitem />
        </el-col>

    </el-row>



</template>