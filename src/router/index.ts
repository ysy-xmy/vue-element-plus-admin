import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
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
        name: 'Redirect',
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

    meta: {
      title: '仪表盘',
      icon: 'vi-ant-design:dashboard-filled',

    },
    children: [
      {
        path: 'analysis',
        component: () => import('@/views/Dashboard/Analysis.vue'),
        name: 'Analysis',
        meta: {
          title: '仪表盘',
          noCache: true,
          affix: true,
          icon: 'vi-ant-design:dashboard-filled',

        }
      },


    ]


  },
  {
    path: '/permission',
    component: Layout,
    name: 'Permission',
    meta: {
      title: '权限模块',
      icon: 'carbon:user-role'
    },
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/Permission/Admin.vue'),
        meta: {
          title: '管理员',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'coach',
        name: 'Coach',
        component: () => import('@/views/Permission/Coach.vue'),
        meta: {
          title: '教练',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('@/views/Permission/Student.vue'),
        meta: {
          title: '学员',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/Permission/User.vue'),
        meta: {
          title: '用户管理',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/Permission/Menu.vue'),
        meta: {
          title: '菜单管理',
          icon: 'carbon:user-role'
        }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    name: 'Finance',
    meta: {
      title: '财务管理',
      icon: 'carbon:user-role'
    },
    children: [
      {
        path: 'course',
        name: 'Course',
        component: () => import('@/views/finance/course.vue'),
        meta: {
          title: '课程销量',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'coach-finance',
        name: 'coach-finance',
        component: () => import('@/views/finance/coach-finance.vue'),
        meta: {
          title: '教练提成',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'corporate-finance',
        name: 'Corporate Finance',
        component: () => import('@/views/finance/corporate-finance.vue'),
        meta: {
          title: '公司财务',
          icon: 'carbon:user-role'
        }
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    name: '资源管理',
    meta: {
      title: '资源管理',
      icon: 'carbon:user-role'
    },
    children: [
      {
        path: 'course-list',
        name: '动作库',
        component: () => import('@/views/resource/actionLibrary.vue'),
        meta: {
          title: '动作库',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'gym',
        name: '健身房信息',
        component: () => import('@/views/resource/gymInfo.vue'),
        meta: {
          title: '健身房信息',
          icon: 'carbon:user-role'
        }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    name: '日志模块',
    meta: {
      title: '日志模块',
      icon: 'carbon:user-role'
    },
    children: [
      {
        path: 'operation',
        name: '基础日志',
        component: () => import('@/views/Level/Menu2.vue'),
        meta: {
          title: '基础日志',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'clock',
        name: '打卡日志',
        component: () => import('@/views/Level/Menu2.vue'),
        meta: {
          title: '打卡日志',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'order',
        name: '订单日志',
        component: () => import('@/views/Level/Menu2.vue'),
        meta: {
          title: '订单日志',
          icon: 'carbon:user-role'
        }
      },
      {
        path: 'error',
        name: '异常日志',
        component: () => import('@/views/Level/Menu2.vue'),
        meta: {
          title: '异常日志',
          icon: 'carbon:user-role'
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    name: '基本信息',
    meta: {
      title: '基本信息',
      icon: 'carbon:skill-level-advanced'
    },
    children: [
      {
        path: 'base-config',
        name: '基础设置',
        component: () => import('@/views/Level/Menu2.vue'),
        meta: {
          title: '基础设置'
        }
      },
      {
        path: 'info',
        name: '系统设置',
        component: () => import('@/views/Level/Menu2.vue'),
        meta: {
          title: '系统设置'
        }
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
