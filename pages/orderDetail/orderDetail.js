// pages/orderDetail/orderDetail.js
import {
  _WeChatPay,
  _OrderDetail,
  _CartAdd,
  _OrderConfirmOrder,
  _OrderCancelOrder,
  _OrderDeleteOrder,
  _TakeDelay
} from "../../utils/request";
const app = getApp()
var that;
Page({

  data: {
    data:{},
    orderId:''
  },
  onLoad: function (options) {
    that = this
    app.setWatcher(app.globalData, this.watch);
    this.setData({
      orderId: options.orderId
    })
    if(app.globalData.token) {
      this.getOrderDetail()
    }
  },
  watch : {
    token(newValue) {
      that.getOrderDetail()
    }
  },
  getOrderDetail() {
    _OrderDetail({ orderId: this.data.orderId })
      .then(data => {
        this.setData({ data });
      })
      .catch(msg => {
        wx.showModal({ title: msg });
      });
  },
  navToShippingList() {
      wx.navigateTo({
        url: `../shippingList/shippingList?orderId=${this.data.orderId}`
      })
  },
  pay(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let orderId = e.currentTarget.dataset.id
      _WeChatPay({ orderId })
        .then(data => {
          app.pay(data)
        })
        .catch(msg => {
          wx.showModal({
            title: msg
          })
        })
    }, 500);
  },
  buyAgain(e) {
    app.buyAgain(e)
  },
  orderControl(e) {
    let orderId = e.currentTarget.dataset.orderid;
    let controlStyle = e.currentTarget.dataset.str;
    let promiseObj = app.orderControl(orderId, controlStyle);
    promiseObj.then(data => {
      wx.showToast({
        icon: "success",
        title: data,
        duration: 600
      });
      this.getOrderDetail()
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        pageIndex: 1
      })
      prevPage.getOrderList();
      if (controlStyle === 'delete') {
        setTimeout(() => {
          wx.navigateBack({ delta: 1 });
        }, 600);
      }
    }).catch(msg => {
      wx.showModal({
        title: msg
      });
    });
  },
  copy() {
    wx.setClipboardData({
      data: `订单编号: ${this.data.data.orderInfo.order_sn}`,
      success() {
        wx.getClipboardData({
          success(res) {
            console.log(res.data)
          }
        })
      }
    })
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
      title:'正在刷新'
    })
    _OrderDetail({ orderId: this.data.orderId })
      .then(data => {
        this.setData({ data });
        wx.stopPullDownRefresh();
        setTimeout(()=> {
          wx.hideLoading();
        },600)
      })
      .catch(msg => {
        wx.showModal({ title: msg });
      });
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