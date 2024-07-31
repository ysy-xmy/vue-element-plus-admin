<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { DepartmentUserItem } from '@/api/department/types'
import { useValidator } from '@/hooks/web/useValidator'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<DepartmentUserItem>,
    default: () => undefined
  },
  formSchema: {
    type: Array as PropType<FormSchema[]>,
    default: () => []
  }
})

const rules = reactive({
  // username: [required()],
  // account: [required()],
  // 'department.id': [required()],
  OpenID: [required()],
  Username: [required()],
  RoleName: [required()],
  Password: [required(), { min: 6, message: '密码长度不能小于6位' }, { trigger: 'blur' }],
  Enabel: [required(), { messages: '请选择状态' }],

})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
