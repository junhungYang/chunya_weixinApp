// pages/couponList/couponList.js
import { _CouponListByCart } from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    navActive: 1
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
    _CouponListByCart({
      type: this.data.navActive,
      page: this.data.page,
      size: 10
    })
      .then(data => {
        let arr = [...this.data.list, ...data.data];
        this.setData({ list: arr });
        setTimeout(() => {
          wx.hideLoading();
        }, 600);
      })
      .catch(msg => {
        wx.hideLoading();
        wx.showModal({ title: msg });
      });
  },
  useCoupon(e) {
    let couponId = e.currentTarget.dataset.id 
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2];
    prevPage.getOrderCheckout(couponId)
    wx.navigateBack({
      delta: 1
    })
  },
  changeActive(e) {
    let navActive = e.currentTarget.dataset.index
    this.setData({
      navActive,
      list: [],
      page: 1
    })
    this.getCouponList()
  },
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    this.getCouponList()
  }
})