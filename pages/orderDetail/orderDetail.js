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
const App = getApp()
var that;
Page({

  data: {
    data:{},
    orderId:''
  },
  onLoad: function (options) {
    that = this
    App.setWatcher(App.globalData, this.watch);
    this.setData({
      orderId: options.orderId
    })
    if(App.globalData.token) {
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
      .catch(data => App.catchError(data));
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
          wx.requestPayment({
            timeStamp: data.timeStamp,
            appId: data.appId,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: (res) => {
              wx.showToast({
                title: "成功结算"
              });
              this.refreshPrevPage();
              this.getOrderDetail()
            },
          });
        })
        .catch(data => App.catchError(data));
    }, 500);
  },
  buyAgain(e) {
    App.buyAgain(e)
  },
  orderControl(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let orderId = e.currentTarget.dataset.orderid;
      let controlStyle = e.currentTarget.dataset.str;
      let promiseObj = App.orderControl(orderId, controlStyle, 'detail');
      if (promiseObj) {
        promiseObj.then(data => {
            wx.showToast({ icon: "success", title: data, duration: 600 });
            this.getOrderDetail();
            this.refreshPrevPage()
            if (controlStyle === "delete") {
              setTimeout(() => {
                wx.navigateBack({ delta: 1 });
              }, 600);
            }
          }).catch(data => App.catchError(data));
      }
    }, 300);
  },
  navToRefund(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let orderId = e.currentTarget.dataset.orderid
      let orderState = e.currentTarget.dataset.orderstate
      if (orderState === 201 || orderState === 301) {
        wx.navigateTo({
          url: `../refundControl/refundControl?orderId=${orderId}&fatherFrom=detail&orderState=${orderState}`
        });
      } else {
        wx.navigateTo({
          url: `../refundEnter/refundEnter?orderId=${orderId}&fatherFrom=detail`
        })
      }
    }, 300);
  },
  refreshPrevPage() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.data.orderList.forEach((item, index) => {
      prevPage.getOrderList(1, index)
    })
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