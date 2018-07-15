var app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: [],
    containerShow: true,
    searchPanelShow: false,
    movies: [],
    xxShow: false,
    searchVal: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var doubanBase = app.globalData.doubanBase
    // 正在热映API
    var inTheatersUrl = doubanBase + "/v2/movie/in_theaters"
    // 即将上映
    var comingSoonUrl = doubanBase + "/v2/movie/coming_soon"
    // top250
    var top250Url = doubanBase + "/v2/movie/top250"
    // 请求页面数据
    var that = this;
    Promise.all([
      this.requestMoviesData(inTheatersUrl, 0, 3, '正在热映'),
      this.requestMoviesData(comingSoonUrl, 0, 3, '即将上映'),
      this.requestMoviesData(top250Url, 0, 3, 'Top250'),
    ]).then(values => {
      // console.log(values)
      that.setData({
        movieList: values
      })
    }).catch(error => {
      console.log(error)
    })
  },
  requestMoviesData(url, start, count, movieType) { // 获取电影数据
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data: {
          start,
          count
        },
        success(res) {
          // console.log(res)
          var movies = []

          for (var idx in res.data.subjects) {
            var movie = {}
            var tmpOne = res.data.subjects[idx]
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

            movie.movieType = movieType
            movies.push(movie)
          }
          resolve(movies)
        },
        fail(error) {
          reject(error)
        }
      })
    })
  },
  handleMore(event) { // 点击更多进行跳转
    var moreType = event.currentTarget.dataset.moreType
    wx.navigateTo({
      url: './more-movies/more-movies?moreType=' + moreType
    })
  },
  onHandleFocus (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
      xxShow: true
    })
  },
  onHandleChange (event) {
    var that = this
    var text = event.detail.value
    var searchApi = app.globalData.doubanBase + '/v2/movie/search?q=' + text
    util.http(searchApi)
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
  onCancelSearch (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      xxShow: false,
      searchVal: ''
    })
  },
  onMovieTap (event) { // 电影点击事件
    var movieId = event.currentTarget.dataset.movieId
    wx.navigateTo({
      url: './movie-detail/movie-detail?movieId=' + movieId
    })
  }
})