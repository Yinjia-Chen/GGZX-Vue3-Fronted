// 封装一个函数：获取当前时间段：早上｜上午｜下午｜晚上
export const getTime = () => {
  let message = ''
  // 通过内置构造函数 Date
  let hours = new Date().getHours()
  if (hours <= 9) {
    message = '早上'
  } else if (hours <= 12) {
    message = '上午'
  } else if (hours <= 18) {
    message = '下午'
  } else {
    message = '晚上'
  }
  return message
}
