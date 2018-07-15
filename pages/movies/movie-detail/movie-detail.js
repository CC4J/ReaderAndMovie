var util = require('../../../utils/util.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieId: '',
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取电影id
    var movieId = options.movieId
    this.setData({
      movieId
    })
    // 获取电影数据
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId
    util.httpDetail(url)
      .then(data => {
        var tmpData = data.data
        console.log(tmpData)
        var movie = {}
        movie.imgUrl = tmpData.images.large
        movie.title = tmpData.title
        movie.country = tmpData.countries[0]
        movie.year = tmpData.year
        movie.wishCount = tmpData.wish_count
        movie.commentCount = tmpData.comments_count
        movie.originalTitle = tmpData.original_title

        var average = tmpData.rating.average
        var fullStarCount = Math.floor(average / 2);
        var empStarCount = fullStarCount > 0 ? 5 - fullStarCount : 0;
        movie.rating = {
          average,
          fullStarCount,
          empStarCount
        }

        var casts = tmpData.casts;
        var tmpArr = []
        for (var idx in casts) {
          tmpArr.push(casts[idx].name)
        }
        movie.casts = tmpArr.join('/')

        movie.genres = tmpData.genres.join('/')
        movie.summary = tmpData.summary
        movie.castsInfo = tmpData.casts
        this.setData({
          movie
        })
      })
      .catch(error => {
        console.log(error)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  viewMoviePostImg (event) {
    var src = event.currentTarget.dataset.src
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  }
})