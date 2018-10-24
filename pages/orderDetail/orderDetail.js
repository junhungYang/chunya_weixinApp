// pages/orderDetail/orderDetail.js
import { 
  _WeChatPay, 
  _OrderDetail, 
  _CartAdd,
  _OrderConfirmOrder,
  _OrderCancelOrder,
  _OrderDeleteOrder
  } from '../../utils/request'
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
    let promiseObj;
    switch (controlStyle) {
      case 'delete':
        promiseObj = _OrderDeleteOrder({ orderId })

        break;
      case 'cancel':
        promiseObj = _OrderCancelOrder({ orderId })
        break;
      case 'confirm':
        promiseObj = _OrderConfirmOrder({ orderId })
        break
    }
    promiseObj.then(data => {
      wx.showToast({
        icon: "success",
        title: data,
        duration: 600
      });
      setTimeout(() => {
        if (controlStyle === 'delete') {
          let pages = getCurrentPages()
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            requestCode: -1,
            pageIndex: 1
          })
          prevPage.getOrderList()
          wx.navigateBack({
            delta: 1
          })
        }else {
          this.getOrderDetail();
        }
      }, 600); 
    }).catch(msg => {
      wx.showModal({
        title: msg
      });
    });
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