<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { getcourseInfo, deletecourse } from '@/api/resource'
import { ref, watch } from 'vue'
import { convertDateTime } from './utils/convertDateTime'
import { ElMessageBox } from 'element-plus';

const courselist = ref<course[]>([])
const current_page = ref(1)
const total = ref(0)
let data = {
    Page: 1,
    Size: 10,
}
interface course {
    ID: number,
    CoachName: string,
    Name: string
    Description: string,
    Img: string,
    MonthPrice: number,
    QuarterPrice: number,
    YearPrice: number,
    CreatedAt: string,
}

const loading = ref(true)
const getdata = () => {
    loading.value = true
    let data = {
        Page: current_page.value,
        Size: 5,
    }
    getcourseInfo(data).then(res => {
        console.log(res)
        courselist.value = res.data.CourseInfos
        total.value = res.data.Total
        loading.value = false

    })
}

getdata()




const changePage = (page: number) => {
    current_page.value = page
    getdata()
}

const deleteCourse = (id: number) => {
    ElMessageBox.confirm('确认删除该课程吗？').then(() => {
        console.log(id)
        deletecourse([id]).then(() => {
            getdata()
        })

    }).catch(() => {
        console.log('cancel')
    })
}
</script>

<template>
    <div class="flex w-full h-full">

        <ContentWrap v-loading="loading" class="flex-[3]  h-full">
            <el-descriptions title="课程列表" direction="vertical" :column="7" border>
                <div class="w-full h-full " v-for="(item, index) in courselist" :key="index">
                    <el-descriptions-item :label="index === 0 ? '课程名称' : ''">{{ item.Name }}</el-descriptions-item>

                    <el-descriptions-item :label="index === 0 ? '图片' : ''">
                        <img :src="item.Img" alt="img" class="w-20 h-20" />
                    </el-descriptions-item>
                    <el-descriptions-item :label="index === 0 ? '教练名称' : ''">{{ item.CoachName }}</el-descriptions-item>

                    <el-descriptions-item :label="index === 0 ? '描述' : ''" width="300px">{{ item.Description
                        }}</el-descriptions-item>


                    <el-descriptions-item :label="index === 0 ? '价格' : ''" class="" width="200px">
                        <div class="flex flex-col items-center">
                            <span>月: <el-tag size="small">{{ item.MonthPrice }}</el-tag>
                            </span><br>
                            <span>季: <el-tag size="small">{{ item.QuarterPrice }}</el-tag>
                            </span><br>
                            <span>年: <el-tag size="small">{{ item.YearPrice }}</el-tag>
                            </span>

                        </div>

                    </el-descriptions-item>




                    <el-descriptions-item :label="index === 0 ? '创建时间' : ''" width="200px">
                        {{ convertDateTime(item.CreatedAt) }}
                    </el-descriptions-item>
                    <el-descriptions-item :label="index === 0 ? '操作' : ''" width="200px">
                        <el-button type="danger" size="mini" @click="deleteCourse(item.ID)">删除</el-button>
                    </el-descriptions-item>
                </div>
            </el-descriptions>


            <el-pagination size="small" layout="prev, pager, next" :hide-on-single-page="false"
                @current-change="changePage" :page-size="5" :total="total" />

        </ContentWrap>


    </div>
</template>
