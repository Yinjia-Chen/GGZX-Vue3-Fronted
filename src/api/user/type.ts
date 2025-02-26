// 登录接口需要携带的参数ts类型
export interface loginForm {
  username: string
  password: string
}

interface dataType {
  token?: string
  message?: string
}

// 登录接口返回数据类型
export interface loginResponseData {
  code: number
  data: dataType
}

// 获取用户信息返回的数据类型
interface userInfo {
  userId: number
  avatar: string
  username: string
  password: string
  desc: string
  roles: string[]
  buttons: string[]
  routes: string[]
  token: string
}

interface user {
  checkUser: {
    checkUser: userInfo
  }
}

export interface userRespondeData {
  code: number
  data: user
}
