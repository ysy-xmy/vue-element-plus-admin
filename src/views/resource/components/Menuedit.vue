<template>
    <div class="menu-component flex justify-center flex-wrap flex-col">
        <ul class="menu-list">
            <li v-for="(menu, index) in menus" :key="index" class="menu-item">
                <div class="menu-title  flex flex-wrap   ">

                    <el-button style="font-size: large; " size="large" type="primary" @click="toggleSubMenu(index)"
                        text>
                        <Icon :size="20" icon="ep:aim" />
                        <div class="mr-2"> </div>

                        {{ menu.title }}
                        <div class=""> </div>

                    </el-button>
                    <div class="flex-1  ">
                        <el-button style="width: 20px;" @click.stop="renameMenu(index, menu.id)" type="primary">
                            <Icon :size="20" icon="ep:edit" />
                        </el-button>

                    </div>
                    <el-button v-if="index > 0" @click.stop="moveUp(index)" type="primary">上移</el-button>

                    <el-button class="" v-if="index < menus.length - 1" @click.stop="moveDown(index)"
                        type="primary">下移</el-button>


                    <BaseButton @click="deleteMenu(index)" type="danger">
                        删除
                    </BaseButton>


                </div>
                <transition name="fade">
                    <ul v-show="menu.isActive" class="submenu-list">
                        <li v-for="(subMenu, subIndex) in menu.children" :key="subIndex"
                            class="flex w-full submenu-item">
                            <el-button type="primary" text size="large" style="color: black;"> {{ subMenu.title
                                }}</el-button>

                            <div class="flex-1 flex justify-start items-center">
                                <el-button style="width: 20px" @click.stop="renameSubMenu(index, subIndex, menu.id)"
                                    type="primary">
                                    <Icon :size="20" icon="ep:edit" />
                                </el-button>
                            </div>


                            <!-- <el-button v-if="subIndex > 0" @click.stop="moveSubUp(index, subIndex)"
                                type="primary">上移</el-button>
                            <el-button v-if="subIndex < menu.children.length - 1"
                                @click.stop="moveSubDown(index, subIndex)" type="primary">下移</el-button> -->
                            <div class="flex items-center">
                                <span>优先级：</span>
                                <el-input-number class="mr-5" v-model="subMenu.orderid" :min="1" :max="100"
                                    @change="inedit(index, subIndex)" />

                                <div v-if="subMenu.editorder" class="flex items-center mr-5">
                                    <Icon class="opacity-70 mr-3" :size="25" icon="dashicons:yes"
                                        @click.stop="confirmOrder(index, subIndex)" />

                                    <Icon class="opacity-70" :size="20" icon="codicon:chrome-close"
                                        @click.stop="cancelOrder(index, subIndex)" />
                                </div>



                                <BaseButton @click="deleteSubMenu(index, subIndex)" type="danger">
                                    删除
                                </BaseButton>

                            </div>





                        </li>
                        <el-button class="add-menu-btn " @click="addSubMenu(index, menu.id)" type="primary" plain
                            size="large">新建二级目录</el-button>

                    </ul>
                </transition>
            </li>
        </ul>
        <el-button style="font-size: 18px; width: 50%" class="add-menu-btn" type="primary" size="large" plain
            @click="addfirstMenu">新建一级目录</el-button>
    </div>

</template>

<script setup lang="ts">
import { ref, defineProps, PropType } from 'vue';
import { actionrouter } from '../types'
import { ElMessageBox } from 'element-plus';
import { orderlist } from '@/store/modules/permission'
import { addFirst, addSec, updateFirst, updateSec } from '@/api/resource'

const editorderid = ref<number | undefined>()
const confirmOrder = (orderid: number, subIndex: number) => {
    menus.value[orderid].children[subIndex].orderid = editorderid.value
    menus.value[orderid].children[subIndex].editorder = false
    menus.value = orderlist(menus.value)

}
const cancelOrder = (orderid: number, subIndex: number) => {
    menus.value[orderid].children[subIndex].editorder = false
    menus.value = orderlist(menus.value)


}
const inedit = (menuIndex: number, subIndex: number) => {
    editorderid.value = menus.value[menuIndex].children[subIndex].orderid
    menus.value[menuIndex].children[subIndex].editorder = true
}
const props = defineProps({
    actionrouterList: {
        // type: Array as PropType<Menu[]>,
        type: Array as PropType<actionrouter[]>,
        default: () => []
    },
    defaultActive: {
        type: String,
        default: '0'
    }
});
var menus = ref(orderlist(props.actionrouterList))








const moveUp = (index: number) => {
    if (index > 0) {
        const currentMenu = menus.value[index];
        menus.value.splice(index, 1);
        menus.value.splice(index - 1, 0, currentMenu);
    }
    menus.value = orderlist(menus.value)
    let downorder = menus.value[index].orderid
    let uporder = menus.value[index - 1].orderid

    updateFirst(
        {
            Name: menus.value[index].title,
            ID: menus.value[index].id,
            OrderNum: uporder,
        }


    ).then((res) => {
        updateFirst(
            {
                Name: menus.value[index - 1].title,
                ID: menus.value[index - 1].id,
                OrderNum: downorder,
            }).then(res => {
                console.log(res)
            })

    })
};

const moveDown = (index: number) => {
    const lastIndex = menus.value.length - 1;
    if (index < lastIndex) {
        const currentMenu = menus.value[index];
        menus.value.splice(index, 1);
        menus.value.splice(index + 1, 0, currentMenu);
    }
    menus.value = orderlist(menus.value)
    let downorder = menus.value[index].orderid
    let uporder = menus.value[index + 1].orderid

    updateFirst(
        {
            Name: menus.value[index].title,
            ID: menus.value[index].id,
            OrderNum: downorder,
        }


    ).then((res) => {
        updateFirst(
            {
                Name: menus.value[index + 1].title,
                ID: menus.value[index + 1].id,
                OrderNum: uporder,
            }).then(res => {
                console.log(res)
            })



    })
};

const toggleSubMenu = (index: number) => {
    menus.value[index].isActive = !menus.value[index].isActive;
};

const deleteMenu = (menuIndex: number,) => {
    ElMessageBox.confirm(`确认删除该目录及其下所有动作资源？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',

    }).then(async () => {

        menus.value.splice(menuIndex, 1);
    })
        .catch(() => {
            // catch error
        })
};



const deleteSubMenu = (menuIndex: number, subMenuIndex: number) => {
    ElMessageBox.confirm(`确认删除该目录及其下所有动作资源？`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        menus.value[menuIndex].children.splice(subMenuIndex, 1);

    }).catch(() => {
        // catch error
    })
};
const renameMenu = (index: number, firstmenuid: string) => {
    const newName = prompt('请输入新的菜单名称', menus.value[index].title);
    var orderid = menus.value[index].orderid
    if (newName && newName.trim() !== '') {
        menus.value[index].title = newName;
    }
    updateFirst(
        {
            Name: newName,
            ID: firstmenuid,
            OrderNum: orderid,
        }


    ).then(res => {
        console.log(res)
    })

};

const addfirstMenu = () => {
    const newName = prompt('请输入新的菜单名称');
    console.log(typeof (menus.value[menus.value.length - 1].orderid + + 1), '222')
    let orderid = menus.value[menus.value.length - 1].orderid + 1
    if (newName && newName.trim() !== '') {
        menus.value.push({
            title: newName,
            isActive: false,
            children: []
        });
        addFirst([
            {
                Name: newName,
                OrderNum: orderid,
            }
        ]

        ).then(res => {
            console.log(res)

        })



    }
};

const renameSubMenu = (menuIndex: number, subMenuIndex: number, firstmenuid: string) => {
    if (menus.value[menuIndex].children?.length) {
        const newName = prompt('请输入新的子菜单名称', menus.value[menuIndex].children[subMenuIndex].title);
        if (newName && newName.trim() !== '') {
            menus.value[menuIndex].children[subMenuIndex].title = newName;
        }

    }
    updateSec(
        {
            Name: menus.value[menuIndex].children[subMenuIndex].title,
            ID: menus.value[menuIndex].children[subMenuIndex].id,
            OrderNum: menus.value[menuIndex].children[subMenuIndex].orderid,
            FirstCategoryID: firstmenuid,
        }


    ).then(res => {
        console.log(res)
    })



};

const addSubMenu = (menuIndex: number, firstmenuid: string) => {
    const newName = prompt('请输入新的子菜单名称');
    let orderid = 34567
    console.log(orderid, 'orderid')
    if (newName && newName.trim() !== '') {
        console.log(menus.value[menuIndex].children)
        menus.value[menuIndex].children.push(
            {
                title: newName,
                children: []
            }
        );

        addSec([
            {
                Name: newName,
                OrderNum: orderid,
                FirstCategoryID: firstmenuid,
            }
        ]

        ).then(res => {
            console.log(res)

        })

    }
};
</script>

<style>
.menu-component {
    width: 100%;
    padding: 0 32px;
    /* Increased padding for more space */
}

.menu-list {
    list-style: none;
    padding: 0;
}

.menu-item {
    margin: 10px 0;
    cursor: pointer;
}

.menu-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.rename-btn {
    margin-left: 8px;
    /* Spacing between buttons */
    cursor: pointer;
}

.submenu-list {
    padding-left: 50px;
    /* Indentation for submenu */
    transition: opacity 0.3s;
    /* Smooth transition for submenu */
}

.submenu-item {
    margin-top: 13px;
    cursor: pointer;
    font-size: 18px;
    text-align: center;
    flex: 1;
    color: black !important;

}

.add-submenu-btn {
    margin-top: 8px;
    cursor: pointer;
}

.add-menu-btn {
    display: block;
    /* Make button take full width */
    width: 100%;
    margin-top: 20px;
    /* Space above the button */
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>