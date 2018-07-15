const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const http = (url, start, count) => {
  start = start || 0;
  count = count || 20;
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: {
        start,
        count
      },
      success(res) {
        resolve(res)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

const httpDetail = (url) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      success(res) {
        resolve(res)
      },
      fail(error) {
        reject(error)
      }
    })
  })
}

module.exports = {
  formatTime,
  http,
  httpDetail
}
