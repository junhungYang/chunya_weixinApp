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
  
    if(style === 'recommend') {
      _PostsList({
        type: 1,
        page: this.data.tuiJianPage,
        size: 10
      }).then(data => {
        let arr = [...this.data.tuiJianList,...data.data]
        this.setData({
          tuiJianList: arr
        })
      })
      .catch(msg => this.showModal(msg))
    }else if(style === 'hot') {
      _PostsList({
        type: 2,
        page: this.data.reMenPage,
        size: 10
      }).then(data => {
        let arr = [...this.data.reMenList, ...data.data]
        this.setData({
          reMenList: arr
        })
      })
      .catch(msg => this.showModal(msg))
    }else if(style === 'collect') {
      _PostsList({
        type: 3,
        page: this.data.reMenPage,
        size: 10
      }).then(data => {
        let arr = [...this.data.collectList, ...data.data];
        this.setData({
          collectList: arr
        })
      })
      .catch(msg => this.showModal(msg))
    }else {
      _PostsList({
        type: 0,
        page: this.data.wenDuPage,
        size: 10
      }).then(data => { 
        let arr = [...this.data.wenDuList, ...data.data]
        this.setData({
          wenDuList: arr
        })
      })
      .catch(msg => this.showModal(msg))
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
    switch (index) {
      case 1:
        this.setData({
          tuiJianPage: this.data.tuiJianPage +1
        })
        this.getStoryList("recommend");
        break;
      case 2:
        this.setData({
          reMenPage: this.data.reMenPage + 1
        })
        this.getStoryList("hot");
        break;
      case 3:
        this.setData({
          wenDuPage: this.data.wenDuPage + 1
        })
        this.getStoryList()
        break;
      case 4: 
        this.setData({
          collectPage: this.data.collectPage +1
        })
        this.getStoryList('collect')
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