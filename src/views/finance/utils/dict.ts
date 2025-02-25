// 建议放在 src/utils/dict.ts 或专用字典文件中
export const FINANCE_TYPE_DICT: Record<string, string> = {
  venue_expense: '场地费用',
  coach_commission_expense: '教练佣金支出',
  coach_salaries_expense: '教练薪资支出',
  other_expense: '其他支出',
  course_income: '课程收入',
  other_income: '其他收入',
  month: '月',
  all_months: '全部月份'
}

// 根据备注类型设置不同的标签颜色
export const getTagType = (remark: string): string => {
  const remarkUpper = remark.toUpperCase()
  if (remarkUpper.includes('EXPENSE')) {
    if (remarkUpper.includes('COACH_COMMISSION')) {
      return 'danger'
    } else if (remarkUpper.includes('COACH_SALARIES')) {
      return 'warning'
    } else if (remarkUpper.includes('VENUE')) {
      return 'info'
    } else {
      return 'danger' // 其他支出
    }
  } else if (remarkUpper.includes('INCOME')) {
    return 'success' // 所有收入
  } else {
    return 'primary' // 默认颜色
  }
}
