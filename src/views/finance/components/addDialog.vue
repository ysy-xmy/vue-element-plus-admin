<template>
  <el-dialog v-model="localVisible" @close="handleCancel" title="录入支出">
    <el-form :rules="rules" :model="formData" label-width="100px" ref="formRef">
      <el-form-item label="类型" prop="Type">
        <el-input v-model="formData.Type" disabled />
      </el-form-item>
      <el-form-item label="备注" prop="Remark">
        <el-select v-model="formData.Remark" placeholder="请选择备注">
          <el-option
            v-for="option in filteredRemarkOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总额" prop="Amount">
        <el-input type="number" v-model="formData.Amount" />
      </el-form-item>
      <el-form-item label="描述" prop="Description">
        <el-input type="textarea" v-model="formData.Description" :rows="5" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'EXPENSE'
    }
  },
  data() {
    return {
      localVisible: this.visible,
      formData: {
        Type: this.type,
        Remark: '',
        Amount: null,
        Description: ''
      },
      rules: {
        Type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
        Remark: [{ required: true, message: '备注不能为空', trigger: 'change' }],
        Amount: [{ required: true, message: '总额不能为空', trigger: 'blur' }]
      },
      remarkOptions: [
        { value: 'COACH_COMMISSION_EXPENSE', label: '教练佣金支出' },
        { value: 'COACH_SALARIES_EXPENSE', label: '教练工资支出' },
        { value: 'VENUE_EXPENSE', label: '场地支出' },
        { value: 'HYDROPOWER_EXPENSE', label: '水电支出' },
        { value: 'OTHER_EXPENSE', label: '其他支出' },
        { value: 'COURSE_INCOME', label: '课程收入' },
        { value: 'OTHER_INCOME', label: '其他收入' }
      ]
    }
  },
  computed: {
    filteredRemarkOptions() {
      return this.formData.Type === 'EXPENSE'
        ? this.remarkOptions.filter((option) => option.value.includes('EXPENSE'))
        : this.remarkOptions.filter((option) => option.value.includes('INCOME'))
    }
  },
  watch: {
    visible(newVal) {
      this.localVisible = newVal
    }
  },
  methods: {
    handleSave() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit('save', this.formData)
          this.localVisible = false
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('cancel')
      this.localVisible = false
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
