var app = getApp()
var util = require('../../../utils/util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navTitle: '',
    reqUrl: '',
    movies: [],
    endFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var moreType = options.moreType
    this.setData({
      navTitle: moreType
    })
    var reqUrl = ''
    if (moreType == '正在热映') {
      reqUrl = app.globalData.doubanBase + '/v2/movie/in_theaters'
    } else if (moreType == '即将上映') {
      reqUrl = app.globalData.doubanBase + '/v2/movie/coming_soon'
    } else if (moreType == 'Top250') {
      reqUrl = app.globalData.doubanBase + '/v2/movie/top250'
    }
    this.setData({
      reqUrl
    })
    var that = this;
    util.http(reqUrl, 0, 9)
      .then(that.handleResData)
      .then(data => {
        that.setData({
          movies: data
        })
      })
      .catch(error => {
        console.log(error)
      })
  },
  onReady() {
    wx.setNavigationBarTitle({
      title: this.data.navTitle
    })
  },
  handleResData(res) {
    return new Promise((resolve, reject) => {
      var movies = []
      for (var idx in res.data.subjects) {
        var tmpOne = res.data.subjects[idx]
        var movie = {}

        movie.movieId = tmpOne.id
        movie.imgUrl = tmpOne.images.large
        // 计算标题长度
        var title = tmpOne.title
        if (title.length >= 6) {
          title = title.substring(0, 6) + '...'
        }
        movie.title = title
        // 计算星星个数
        var average = tmpOne.rating.average
        var fullStarCount = Math.floor(average / 2);
        var empStarCount = fullStarCount > 0 ? 5 - fullStarCount : 0;
        movie.rating = {
          average,
          fullStarCount,
          empStarCount
        }
        movies.push(movie)
      }
      resolve(movies)
    })
  },
  onPullDownRefresh() { // 下拉刷新事件
    wx.showNavigationBarLoading()
    var that = this
    util.http(
        this.data.reqUrl,
        0,
        9
      ).then(that.handleResData)
      .then(data => {
        that.setData({
          movies: data
        })
        setTimeout(() => {
          wx.stopPullDownRefresh()
          // 重置数据是否取完状态
          that.setData({
            endFlag: false
          })
          wx.hideNavigationBarLoading()
        }, 500)
      }).catch(error => {
        console.log(error)
        setTimeout(() => {
          wx.hideNavigationBarLoading()
        }, 2000)
      })
  },
  onReachBottom() { // 上拉触底
    wx.showNavigationBarLoading()
    var that = this
    var movieLen = this.data.movies.length
    // 判断是否数据已取完,如果取完则给出提示
    if (this.data.endFlag) {
      // 提示y用户暂无更多数据
      wx.showToast({
        title: '暂无更多数据',
        icon: 'none',
        duration: 2000
      })
      return
    }
    util.http(
        this.data.reqUrl,
        movieLen,
        9
      ).then(that.handleResData)
      .then(data => {
        // 判断数据是否全部取完
        if (data.length < 9) {
          that.setData({
            endFlag: true
          })
        }
        var newMovies = this.data.movies.concat(data)
        this.setData({
          movies: newMovies
        })
        setTimeout(() => {
          wx.hideNavigationBarLoading()
        }, 2000)
      }).catch(error => {
        console.log(error)
        setTimeout(() => {
          wx.hideNavigationBarLoading()
        }, 2000)
      })
  },
  onMovieTap(event) { // 电影点击事件
    var movieId = event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + movieId
    })
  }
})