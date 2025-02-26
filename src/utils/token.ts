// 封装 本地存储 存储数据 与 读取数据 方法

// 存储数据
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}

// 获取数据
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}
