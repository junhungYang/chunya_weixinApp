// pages/orderList/orderList.js
import { _OrderList, _WeChatPay} from '../../utils/request'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    requestCode:-1,
    pageIndex: 1
  },

  onShow: function () {
    this.getOrderList(-1)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showToast({
      title:'正在加载',
      icon:'loading',
      mask:true
    })
    this.setData({
      pageIndex:this.data.pageIndex +1
    })
    this.getOrderList(this.data.requestCode,'byScroll')
  },
  getOrderList(num,str) {
    let obj
    if(num === -1) {
      obj = { page: this.data.pageIndex, size: 10 };
    }else {
      obj = {
        page: this.data.pageIndex,
        size: 10,
        orderStatus: num
      }
    }
    _OrderList(obj).then(data => {
      if(!str) {
        this.setData({
          orderList: data.data
        })
      }else {
        this.setData({
          orderList:[...this.data.orderList,...data.data]
        })
      }
      
    })
  },
  navToOrderDetail(e) {
    let id = e.currentTarget.dataset.item.id
    wx.navigateTo({
      url:`../orderDetail/orderDetail?id=${id}`
    })
  },
  changeActive(e) {
    this.setData({
      requestCode: e.currentTarget.dataset.requestcode,
      pageIndex:1
    });
    this.getOrderList(this.data.requestCode)
  },
  pay(e) {
    let orderId = e.currentTarget.dataset.id
    _WeChatPay({orderId})
    .then(data => {
      app.pay(data)
    })
    .catch(msg => {
      wx.showModal({
        title:msg
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})