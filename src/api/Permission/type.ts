export interface UserInfo {
  ID: number
  OpenID: string
  Username: string
  Phone: number | ''
  RoleName: string
  Enable: boolean
  LastLoginTime: Date | null // 使用Date类型代替string
  CreatedAt: Date // 使用Date类型代替string
  UpdatedAt: Date // 使用Date类型代替string
}

export interface UserParams {
  Page?: string
  Size?: string
  /**
   * ADMIN、COACH、STUDENT、COACH&STUDENT (旧角色筛选)；
   * ALL_USERS、TRAINING_COACH (管理端按实际带教关系筛选)
   */
  UserSelectType?: 'ADMIN' | 'COACH' | 'STUDENT' | 'COACH&STUDENT' | 'ALL_USERS' | 'TRAINING_COACH'
  [property: string]: any
}
