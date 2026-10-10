<script setup lang="ts">
import { ref, watch, computed, onMounted, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('logo')

const appStore = useAppStore()

const show = ref(true)

const title = computed(() => appStore.getTitle)

const layout = computed(() => appStore.getLayout)

const collapse = computed(() => appStore.getCollapse)

onMounted(async () => {
  if (unref(collapse)) show.value = false
})

watch(
  () => collapse.value,
  (collapse: boolean) => {
    if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
      show.value = true
      return
    }
    show.value = !collapse
  }
)

watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top' || layout === 'cutMenu') {
      show.value = true
    } else {
      if (unref(collapse)) {
        show.value = false
      } else {
        show.value = true
      }
    }
  }
)
</script>

<template>
  <router-link
    :class="[prefixCls, layout !== 'classic' ? `${prefixCls}__Top` : '']"
    to="/"
    :aria-label="title"
  >
    <span class="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4 13h4l3-7 3 12 3-7h3"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span v-if="show" class="brand-copy">
      <span class="brand-title">{{ title }}</span>
      <span class="brand-caption">让训练，更有章法</span>
    </span>
  </router-link>
</template>

<style lang="less" scoped>
.v-logo {
  display: flex;
  height: var(--logo-height);
  padding: 0 16px;
  overflow: hidden;
  color: var(--logo-title-text-color);
  text-decoration: none;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  color: #fff;
  background: var(--el-color-primary);
  border-radius: 10px;

  svg {
    width: 24px;
    height: 24px;
  }
}

.brand-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  white-space: nowrap;
}

.brand-title {
  font-size: 15px;
  font-weight: 650;
}

.brand-caption {
  font-size: 10px;
  letter-spacing: 1px;
  color: var(--left-menu-text-color);
}
</style>
