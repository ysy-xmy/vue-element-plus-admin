import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesByFrontEnd,
  generateRoutesByServer,
  flatMultiLevelRoutes
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(
      type: 'server' | 'frontEnd' | 'static',
      routers?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []
        if (type === 'server') {
          // 模拟后端过滤菜单
          routerMap = generateRoutesByServer(routers as AppCustomRouteRecordRaw[])
          console.log('routerMap', routerMap)

        } else if (type === 'frontEnd') {
          // 模拟前端过滤菜单
          routerMap = generateRoutesByFrontEnd(cloneDeep(asyncRouterMap), routers as string[])
          console.log('routerMap', routerMap)

        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
          console.log('routerMap', routerMap)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          {
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)
        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  },
  persist: {
    paths: ['routers', 'addRouters', 'menuTabRouters']
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}


interface ActionItem {
  title: string;
  id: string;
  children: ActionItem[];
  orderid?: number;
  picurl?: string;
  videoUrl?: string;
  intro?: string;
  editorder?: boolean;
}



// export const orderlist = (routers: ActionRouter[]): ActionRouter[] => {

//   // 排序函数，根据orderid排序
//   const sortByOrderId = (a: ActionItem, b: ActionItem) => {
//     if (a.orderid && b.orderid) {
//       return a.orderid - b.orderid;
//     }
//     return 0;
//   };

//   // 递归排序每个路由及其子项
//   const sortChildren = (items: ActionItem[]): ActionItem[] => {
//     return items.map(item => ({
//       ...item,
//       children: sortChildren(item.children) // 递归排序子项
//     })).sort(sortByOrderId);
//   };

//   // 对顶级路由进行排序，并对每个路由的子项进行排序
//   return routers.map(router => ({
//     ...router,
//     children: sortChildren(router.children) // 对每个路由的子项进行排序
//   })).sort(sortByOrderId);

// }


type ActionRouter = {
  title: string;
  id: number;
  orderid: number;
  children: ActionRouter[];
  isActive: boolean;
};
export const orderlist = (routers: ActionRouter[]): ActionRouter[] => {
  // 反序排序函数，首先根据orderid降序排序，如果orderid相同，则根据id降序排序
  const sortByOrderIdAndIdDesc = (a: ActionRouter, b: ActionRouter): number => {
    if (a.orderid !== b.orderid) {
      return b.orderid - a.orderid;
    }
    // 如果orderid相同，则比较id
    return b.id - a.id;
  };

  // 递归排序每个路由及其子项
  const sortChildren = (items: ActionRouter[]): ActionRouter[] => {
    return items.map(item => ({
      ...item,
      children: sortChildren(item.children) // 递归排序子项
    })).sort(sortByOrderIdAndIdDesc);
  };

  // 对顶级路由进行排序，并对每个路由的子项进行排序
  return routers.map(router => ({
    ...router,
    children: sortChildren(router.children) // 对每个路由的子项进行排序
  })).sort(sortByOrderIdAndIdDesc);
};
