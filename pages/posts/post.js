// pages/posts/post.js
var postData = require('../../data/posts-data.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    postList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postList: postData.postList
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  handleItem: function (event) {
    var postId = event.detail.postId;
    wx.navigateTo({
      url: './post-detail/post-detail?postId=' + postId
    })
  },
  handleBanner (event) {
    var postId = event.target.dataset.postId;
    wx.navigateTo({
      url: './post-detail/post-detail?postId=' + postId
    })
  }
})