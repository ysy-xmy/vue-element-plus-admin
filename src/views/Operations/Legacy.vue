<script setup lang="ts">
import { useRouter } from 'vue-router'
import './operations.css'
const router = useRouter()
const links = [
  { title: '课程销量与订单', path: '/finance/course' },
  { title: '教练收入', path: '/finance/coach-finance' },
  { title: '公司财务', path: '/finance/corporate-finance' },
  { title: '提现申请', path: '/finance/withdraw' },
  { title: '教练认证申请', path: '/permission/coach-application' },
  { title: '存量授课记录', path: '/course-list/course-list' },
  { title: '课程价格设置', path: '/resource/course' },
  { title: '健身房信息', path: '/resource/gym' },
  { title: '支付日志', path: '/log/order' }
]
</script>
<template>
  <div class="ops-page"
    ><div class="ops-header"
      ><div
        ><div class="ops-eyebrow">存量业务</div><h1>历史业务处理</h1
        ><p>商业功能已移出常用导航。已有数据仍可在此查询和处理。</p></div
      ><el-button @click="router.push('/system/systemconfig')">返回产品配置</el-button></div
    ><div class="ops-metrics"
      ><div class="ops-panel" v-for="link in links" :key="link.path"
        ><h2>{{ link.title }}</h2
        ><el-button link type="primary" style="margin-top: 12px" @click="router.push(link.path)"
          >进入处理 →</el-button
        ></div
      ></div
    ></div
  >
</template>
