// pages/public/public.js
import {
  _GetUserInfo,
  _CommonwealList
} from "../../utils/request"
const App = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    activePage: 1,
    commonList: [],
    totalPages: 0,
    scrollFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    if(App.globalData.token) {
      this.getUserInfo()
      this.getCommonList()
    }
  },
  getUserInfo() {
    _GetUserInfo()
      .then(data => {
        this.setData({ userInfo: data });
      })
      .catch(data => App.catchError(data));
  },
  getCommonList(style) {
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    _CommonwealList({
      page: this.data.activePage,
      size: 10,
    }).then(data => {
      data.data.forEach( item => {
        let arr = item.tags.split(',')
        item.tags = arr
      })
      if(style) {
        data.data = [...this.data.commonList, ...data.data]
      }
      this.setData({
        commonList: data.data,
        totalPages: data.totalPages,
        scrollFlag: true
      });
      wx.hideLoading()
      }).catch(data => App.catchError(data))
  },
  onReachBottom: function () {
    if(this.data.scrollFlag) {
      if (this.data.page < this.data.totalPages) {
        this.setData({
          activePage: this.data.activePage + 1,
          scrollFlag:false
        })
        this.getCommonList('byScroll')
      } else {
        App.theEndPage()
      }
    }
 
  },
  showModal(msg) {
    wx.showModal({
      title: msg
    })
  },
  navToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../publicDetail/publicDetail?commonwealId=${id}`
    });
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在刷新',
      mask:true
    })
    _GetUserInfo().then(data => {
      this.setData({
        userInfo: data
      })
      wx.stopPullDownRefresh();
      this.getCommonList()
      setTimeout(() => {
        wx.hideLoading()
      }, 600);
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



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  watch: {
    token(newValue) {
      if (newValue) {
        that.getUserInfo()
        that.getCommonList()
      }
    }
  }
})