// 配置公共的工具函数
// 随机从数组中取出n个元素
function getRandomArrayElements(arr, count) {
  let shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
// 将歌曲时长(毫秒)转为 分秒 的格式
const formatMillisecond = function (time) {
  let m = Math.floor(time / 1000 / 60 % 60)
  m = m < 10 ? '0' + m : m
  let s = Math.floor(time / 1000 % 60);
  s = s < 10 ? '0' + s : s
  let result = m + ':' + s
  return result
}

const date = new Date()
// 获取当前月中的一天 (1 ~ 31)
const mGetDate = function () {
  const monthDay = date.getDate()
  return monthDay
}
// 获取当天的时间戳
const getTimeStamp = function () {
  const timeStamp = date.getTime()
  return timeStamp
}
// 获取设备信息
const deviceInformation = function () {
  const a = wx.getSystemInfoSync()
  return a
}
export default {
  getRandomArrayElements,
  formatMillisecond,
  mGetDate,
  getTimeStamp,
  deviceInformation
}