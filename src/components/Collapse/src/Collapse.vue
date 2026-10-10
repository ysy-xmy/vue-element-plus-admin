<script setup lang="ts">
import { computed, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('collapse')

defineProps({
  color: propTypes.string.def('')
})

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse)

const toggleCollapse = () => {
  const collapsed = unref(collapse)
  appStore.setCollapse(!collapsed)
}
</script>

<template>
  <button
    type="button"
    :class="prefixCls"
    :aria-label="collapse ? '展开侧栏' : '收起侧栏'"
    :aria-expanded="!collapse"
    @click="toggleCollapse"
  >
    <Icon
      :size="18"
      :icon="collapse ? 'vi-ant-design:menu-unfold-outlined' : 'vi-ant-design:menu-fold-outlined'"
      :color="color"
      class="cursor-pointer"
    />
  </button>
</template>

<style scoped>
.v-collapse {
  display: flex;
  height: 36px;
  padding: 0 12px;
  cursor: pointer;
  background: transparent;
  border: 0;
  align-items: center;
}

.v-collapse:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: -2px;
}
</style>
