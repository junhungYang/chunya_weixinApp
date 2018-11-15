// pages/couponList/couponList.js
import { _CouponForUser} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    page: 1,
    navActive: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponList()
  },
  getCouponList() {
    wx.showLoading({
      title: '正在加载'
    })
    _CouponForUser({
      type: this.data.navActive,
      page: this.data.page,
      size: 10
    }).then(data => {
      let arr = [...this.data.list, ...data.data]
      this.setData({
        list: arr
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 600);
    }).catch(msg => {
      wx.hideLoading()
      wx.showModal({
        title: msg
      })
    })
  },
  changeActive(e) {
    let navActive = e.currentTarget.dataset.index
    this.setData({
      navActive,
      list:[],
      page: 1
    })
    this.getCouponList()
  },
  onReachBottom: function () {
    this.setData({
      page: this.data.page +1
    })
    this.getCouponList()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})