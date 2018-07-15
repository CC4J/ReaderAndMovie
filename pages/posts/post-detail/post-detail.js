// pages/posts/post-detail/post-detail.js
var { postList } = require('../../../data/posts-data.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: {},
    collected: false,
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.postId;
    var postData = postList[postId];
    this.setData({
      postData
    });
    // 判断当前新闻是否被收藏
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var currentCollected = postsCollected[postId];
      // 判断当前新闻收藏状态是否存在
      if (currentCollected) {
        this.setData({
          collected: currentCollected
        })
      } else {
        // 不存在
        postsCollected[postId] = false
        wx.setStorageSync('posts_collected', postsCollected)
      }
    } else {
      postsCollected = {}
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    }

    // 全局播放样式
    var g_isPlayingMusic = app.globalData.g_isPlayingMusic
    var g_isPlayingMusicPostId = app.globalData.g_isPlayingMusicPostId

    // 判断当前音乐是否播放状态
    if (g_isPlayingMusicPostId == postId && g_isPlayingMusic) {
      this.setData({
        isPlayingMusic: true
      })
    }

    // 监听外部播放器状态
    wx.onBackgroundAudioPlay(() => {
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_isPlayingMusicPostId = postId
    })
    wx.onBackgroundAudioPause(() => {
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_isPlayingMusicPostId = null
    })
    wx.onBackgroundAudioStop(() => {
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_isPlayingMusicPostId = null
    })
  },
  handleCollected () {  // 收藏按钮点击事件
    // 更改视图层收藏状态
    var collected = !this.data.collected
    this.setData({
      collected
    })
    // 更改本地缓存当前新闻收藏状态
    var postsCollected = wx.getStorageSync('posts_collected')
    var postId = this.data.postData.postId
    postsCollected[postId] = collected
    wx.setStorageSync('posts_collected', postsCollected)

    var toastTitle = collected ? '收藏成功' : '取消成功'
    wx.showToast({
      title: toastTitle,
      duration: 1000
    })
  },
  handleShare () {
    var itemList = [
      '分享到微信',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList,
      success: function (res) {
        console.log(res.tapIndex)
      }
    })
  },
  handleMusic () {
    var postId = this.data.postData.postId
    if (this.data.isPlayingMusic) {
      // 暂停音乐
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_isPlayingMusicPostId = null
    } else {
      var postData = this.data.postData
      // 播放音乐
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_isPlayingMusicPostId = postId
    }
  }
})