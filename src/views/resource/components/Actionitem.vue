<script setup lang="ts">
import {ref} from 'vue'
import type { actionitemArray } from '../types/index'

const actionitems = ref<actionitemArray>(
    [
        {
            title: '杠铃卧推',
            picurl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            videoUrl: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',
            intro: '这是动作介绍',

        },
        {
            title: '杠铃卧推',
            picurl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            videoUrl: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',
            intro: '这是动作介绍',

        },
        {
            title: '杠铃卧推',
            picurl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            videoUrl: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',
            intro: '这是动作介绍',

        },
        {
            title: '杠铃卧推',
            picurl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            videoUrl: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',
            intro: '这是动作介绍',

        },
        {
            title: '杠铃卧推',
            picurl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            videoUrl: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',
            intro: '这是动作介绍',
        },
    ]
)

</script>
<template>

    <div style="flex-wrap: wrap;" class="demo-image flex wrap justify-space-between w-full  px-8 justify-start">
        <div v-for="item in actionitems" :key="item" style="width: 22%"
            class=" flex justify-center items-center flex-col p-3 ">

            <el-image :src="item.picurl" fit="fill" />
            <div class="mt-2 w-full flex flex-col justify-around items-center content-center">

                <div class="demonstration w-full font-600 text-center">{{ item.title }}</div>

                <div class='flex flex-row mt-1' >
                    <BaseButton type="primary">
                    编辑
                </BaseButton>
                <BaseButton type="danger">
                    删除
                </BaseButton>

                </div>
            

            </div>


        </div>
        <div class=" flex justify-center items-center flex-col p-3" style="width: 20%">


            <el-image style='width: 80%;height: 80%;'
                src="https://ts1.cn.mm.bing.net/th/id/R-C.cbf575a289a1ea48c05aa15ffe0a08a2?rik=6dHrZgUo2XFdXA&riu=http%3a%2f%2fpic.616pic.com%2fys_img%2f00%2f26%2f90%2foQMuCvSN6V.jpg&ehk=tJjjw9cSbgncY5cp9wdfx0DA0dd8Dm1vhdJMHWMFO7c%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1"
                fit="fill" />
            <span class="demonstration mt-2 ">添加新的动作</span>
        </div>

    </div>
</template>