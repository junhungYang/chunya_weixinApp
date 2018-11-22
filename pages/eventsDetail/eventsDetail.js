// pages/eventsDetail/eventsDetail.js
const App = getApp()
import { _ActivityDetail} from '../../utils/request'
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    this.setData({ id: Number(options.activityId) });
    if(App.globalData.token) {
      this.getDetail()
    }
    App.setWatcher(App.globalData, this.watch)
  },
  getDetail() {
    _ActivityDetail({
      id:this.data.id
    }).then(data => {
      let dateObj = new Date(data.activityStartTime);
      data.activityStartTime = `${dateObj.getFullYear()}.${dateObj.getMonth()+1}.${dateObj.getDate()}`
      this.setData({
        detail: data
      })
    })
  },
  navToEnter() {
    if(this.data.detail.isSignUp === 1) {
      wx.showModal({
        title: '提示',
        content: '您已报名'
      })
    }else {
      wx.navigateTo({
        url: `../eventEnter/eventEnter?id=${this.data.id}`
      })
    }
  },
  showModal(msg) {
    wx.showModal({
      title:msg
    })
  },
  openMap() {
    wx.openLocation({
      latitude: Number(this.data.detail.latitude),
      longitude: Number(this.data.detail.longitude)
    })
  },
  watch: {
    token(newValue) {
      if(newValue) {
        that.getDetail()
      }
    }
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