import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'
import { NO_RESET_WHITE_LIST } from '@/constants'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard/analysis',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectTo',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    name: 'Dashboard',
    redirect: '/dashboard/analysis',
    meta: { title: '运营概览', icon: 'vi-ant-design:dashboard-filled' },
    children: [
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        meta: { title: '运营概览', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    name: 'Permission',
    redirect: '/permission/user',
    meta: { title: '用户管理', icon: 'carbon:user-role' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/Permission/User.vue'),
        meta: { title: '小程序用户', noCache: true }
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/Permission/Admin.vue'),
        meta: { title: '管理员' }
      }
    ]
  },
  {
    path: '/training',
    component: Layout,
    name: 'Training',
    redirect: '/training/plans',
    meta: { title: '训练计划', icon: 'icon-park-solid:doc-success' },
    children: [
      {
        path: 'plans',
        name: 'TrainingPlans',
        component: () => import('@/views/Operations/Plans.vue'),
        meta: { title: '训练计划', noCache: true }
      }
    ]
  },
  {
    path: '/ai',
    component: Layout,
    name: 'AIOperations',
    redirect: '/ai/runs',
    meta: { title: 'AI 使用', icon: 'carbon:machine-learning' },
    children: [
      {
        path: 'runs',
        name: 'AIRuns',
        component: () => import('@/views/Operations/AIRuns.vue'),
        meta: { title: 'AI 使用', noCache: true }
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    name: 'Resources',
    redirect: '/resource/course-list',
    meta: { title: '动作库', icon: 'eos-icons:database-outlined' },
    children: [
      {
        path: 'course-list',
        name: '动作库',
        component: () => import('@/views/resource/actionLibrary.vue'),
        meta: { title: '公共动作库' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    name: 'Notifications',
    redirect: '/notice/notice',
    meta: { title: '通知管理', icon: 'eos-icons:inbound' },
    children: [
      {
        path: 'notice',
        name: '通知模块页面',
        component: () => import('@/views/Notice/index.vue'),
        meta: { title: '通知管理', noCache: true }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: 'ProductSettings',
    redirect: '/system/systemconfig',
    meta: { title: '产品配置', icon: 'rivet-icons:gear-solid' },
    children: [
      {
        path: 'systemconfig',
        name: '系统设置页面',
        component: () => import('@/views/system/systemconfig.vue'),
        meta: { title: '产品配置', noCache: true }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    name: 'Logs',
    redirect: '/log/baselog',
    meta: { title: '运行日志', icon: 'eos-icons:cluster-role' },
    children: [
      {
        path: 'baselog',
        name: '基础日志',
        component: () => import('@/views/Level/baselog.vue'),
        meta: { title: '操作日志' }
      },
      {
        path: 'clock',
        name: '打卡日志',
        component: () => import('@/views/Level/plan.vue'),
        meta: { title: '训练日志' }
      },
      {
        path: 'error',
        name: '异常日志',
        component: () => import('@/views/Level/error.vue'),
        meta: { title: '异常日志' }
      }
    ]
  },
  {
    path: '/legacy',
    component: Layout,
    name: 'Legacy',
    redirect: '/legacy/index',
    meta: { title: '历史业务', hidden: true },
    children: [
      {
        path: 'index',
        name: 'LegacyHome',
        component: () => import('@/views/Operations/Legacy.vue'),
        meta: { title: '历史业务', noCache: true }
      },
      {
        path: '/finance/course',
        name: 'Course',
        component: () => import('@/views/finance/course.vue'),
        meta: { title: '课程销量' }
      },
      {
        path: '/finance/coach-finance',
        name: 'coach-finance',
        component: () => import('@/views/finance/coach-finance.vue'),
        meta: { title: '教练收入' }
      },
      {
        path: '/finance/corporate-finance',
        name: 'Corporate Finance',
        component: () => import('@/views/finance/corporate-finance.vue'),
        meta: { title: '公司财务' }
      },
      {
        path: '/finance/withdraw',
        name: 'Withdraw',
        component: () => import('@/views/finance/withdraw.vue'),
        meta: { title: '提现申请' }
      },
      {
        path: '/permission/coach-application',
        name: 'CoachApplication',
        component: () => import('@/views/Permission/CoachApplication.vue'),
        meta: { title: '教练认证申请' }
      },
      {
        path: '/course-list/course-list',
        name: '授课情况列表',
        component: () => import('@/views/course/course-list.vue'),
        meta: { title: '存量授课记录' }
      },
      {
        path: '/resource/course',
        name: '课程设置',
        component: () => import('@/views/resource/course.vue'),
        meta: { title: '课程价格设置' }
      },
      {
        path: '/resource/gym',
        name: '健身房信息',
        component: () => import('@/views/resource/gymInfo.vue'),
        meta: { title: '健身房信息' }
      },
      {
        path: '/log/order',
        name: '订单日志',
        component: () => import('@/views/Level/payment.vue'),
        meta: { title: '支付日志' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !NO_RESET_WHITE_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
