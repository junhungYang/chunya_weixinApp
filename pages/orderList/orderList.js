// pages/orderList/orderList.js
import { _OrderList, _WeChatPay} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  onShow: function () {
    _OrderList({
      page: 1,
      size: 10
    }).then(data => {
      this.setData({
        orderList: data.data
      })
    })
  },
  balance(e) {
    _WeChatPay({ orderId: e.currentTarget.dataset.orderid }).then(data => {
      wx.requestPayment({
        timeStamp: data.timeStamp,
        appId: data.appId,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success: function () {
          console.log('success')
        },
        fail: function (res) {
          console.log(res)
        }
      });
    });
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