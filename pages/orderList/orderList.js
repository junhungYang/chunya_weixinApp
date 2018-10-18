// pages/orderList/orderList.js
import { _OrderList, _WeChatPay} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    active:1,
    pageIndex: 1
  },

  onShow: function () {
    this.getOrderList(-1)
  },
  getOrderList(num) {
    if(num === -1) {
      _OrderList({
        page: this.data.pageIndex,
        size: 10
      }).then(data => {
        this.setData({
          orderList: data.data
        })
      })
    }else {
      _OrderList({
        page: this.data.pageIndex,
        size: 10,
        orderStatus:num
      }).then(data => {
        this.setData({
          orderList: data.data
        })
      })
    }
    
  },
  navToOrderDetail(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url:`../orderDetail/orderDetail?id=${id}`
    })
  },
  changeActive(e) {
    let index= e.currentTarget.dataset.index
    let requestCode
    switch (index) {
      case 1:
        requestCode = -1
        this.setData({
          active: 1
        })
        break;
      case 2:
        requestCode = 0
        this.setData({
          active: 2
        })
        break;
      case 3:
        requestCode = 300
        this.setData({
          active: 3
        })
        break;
      case 4:
        requestCode = 301
        this.setData({
          active:4
        })
    }
    this.getOrderList(requestCode)
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