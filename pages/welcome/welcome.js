// pages/welcome/welcome.js
Page({
  handleTap () {
    wx.switchTab({
      url: '../posts/post'
    })
  }
})