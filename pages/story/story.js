// pages/story/story.js
const App = getApp()
import {_PostsList} from '../../utils/request'
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navActive: 1,
    tuiJianList:[],
    reMenList: [],
    wenDuList:[],
    collectList: [],
    tuiJianPage: 1,
    reMenPage:1,
    wenDuPage: 1,
    collectPage: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if(App.globalData.token) {
      this.getStoryList('recommend')
      this.getStoryList('hot')
      this.getStoryList()
      this.getStoryList('collect')
    }
    App.setWatcher(App.globalData,this.watch)
  },
  getStoryList(style) {
    let res
    let postsList = (type,page,targetStr) => {
      wx.showLoading({
        title: '正在加载'
      })
      return _PostsList({
        type,
        page,
        size: 10
      }).then(data => {
        let arr = [...this.data[targetStr], ...data.data]
        let obj ={}
        obj[targetStr] = arr
        this.setData(obj)
          wx.hideLoading()
      })
        .catch(msg => {
          this.showModal(msg)
        })
    }
    if(style === 'recommend') {
      postsList(1,this.data.tuiJianPage,'tuiJianList')

    }else if(style === 'hot') {
      postsList(2, this.data.reMenPage, "reMenList");

    }else if(style === 'collect') {
      postsList(3, this.data.collectPage, "collectList");
    }else {
       postsList(0, this.data.wenDuPage, "wenDuList");
    }
  },
  changeActive(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      navActive: index
    })
  },
  getListByScroll() {
    let index = this.data.navActive
    let fn = (pageStr,modStr) => {
      let obj = {}
      obj[pageStr] = this.data[pageStr] +1
      this.setData(obj)
      this.getStoryList(modStr)
    }
    switch (index) {
      case 1:
        fn('tuiJianPage','recommend')
        break;
      case 2:
        fn("reMenPage", "hot");
        break;
      case 3:
        fn("wenDuPage");
        break;
      case 4: 
        fn("collectPage", "collect");
        break;
      }
  },
  navToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../storyDetail/storyDetail?id=${id}`
    })
  },
  navToWriteStory() {
    wx.navigateTo({
      url: '../writeStory/writeStory'
    })
  },
  watch: {
    token(newValue) {
      if(newValue) {
        that.getStoryList('recommend')
        that.getStoryList('hot')
        that.getStoryList()
        that.getStoryList('collect')
      }
    }
  },
  showModal(msg) {
    wx.showModal({
      title: msg
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})