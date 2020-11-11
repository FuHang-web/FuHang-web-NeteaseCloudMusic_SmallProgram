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

const date = new Date()
// 获取当前月中的一天 (1 ~ 31)
const mGetDate = function () {
  const monthDay = date.getUTCDate()
  return monthDay
}

export default {
  getRandomArrayElements,
  mGetDate,
}