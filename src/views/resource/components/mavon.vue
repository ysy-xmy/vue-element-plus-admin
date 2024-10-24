<template>
    <ContentWrap title="动作详情内容编辑器" message="按照排版在小程序那边进行显示">
        <Editor v-model="props.modelValue" ref="editorRef" @change="change" />
    </ContentWrap>
</template>
<script lang="ts" setup>
import { ref, onMounted, unref,defineProps } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Editor, EditorExpose } from '@/components/Editor'
import { IDomEditor } from '@wangeditor/editor'
const editorRef = ref<typeof Editor & EditorExpose>()
//props传入的prop modelValue,监听input事件，获取到值，改值，emit
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
const change = (editor: IDomEditor) => {
    emit('update:modelValue', editor.getHtml())
}

onMounted(async () => {
    const editor = await unref(editorRef)?.getEditorRef()
    console.log(editor)
})

// setTimeout(() => {
//     defaultHtml.value = '<p>hello <strong>world</strong></p>'
// }, 3000)
</script>