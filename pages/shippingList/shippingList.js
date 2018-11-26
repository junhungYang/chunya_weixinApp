// pages/shippingList/shippingList.js
import { _OrderDetail} from '../../utils/request'
const App = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    data:{},
    timeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    this.setData({
      orderId: options.orderId
    })
    if(App.globalData.token) {
      this.getOrderDetail()
    }
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getOrderDetail()
      }
    }
  },
  getOrderDetail() {
    _OrderDetail({ orderId: this.data.orderId })
      .then(data => {
        this.setData({ data });
      })
      .catch(data => App.catchError(data));
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
    wx.showLoading({
      title: '正在刷新'
    })
    _OrderDetail({ orderId: this.data.orderId })
      .then(data => {
        this.setData({ data });
        wx.stopPullDownRefresh();
        setTimeout(() => {
          wx.hideLoading();
        }, 600);
      })
      .catch(data => App.catchError(data));
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