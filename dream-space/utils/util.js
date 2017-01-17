function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatDateToBlurred(date) {
  let minute = 60;
  let hour = 3600;
  let day = 86400;
  let now = new Date().getTime();
  if (typeof (date) == 'number') {
    let diff = (now - date) / 1000;
    if (diff < minute) {
      return '刚刚'
    } else if (diff > minute && diff < (hour / 2)) {
      return Math.floor(diff / minute) + '分钟以前'
    } else if (diff > (hour / 2) && diff < hour) {
      return '半小时以前'
    } else if (diff > hour && diff < day) {
      return Math.floor(diff / hour) + '小时以前'
    } else if (diff > day) {
      return Math.floor(diff / day) + '天以前'
    }
  }
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatDateToBlurred: formatDateToBlurred
}
