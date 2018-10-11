// pages/cart/cart.js
import { _CartIndex, _CartDelete, _OrderCheckout, _OrderSubmit, _OrderList, _WeChatPay} from '../../utils/request'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'junxing',
    cartList:[],
    couponInfoList:[],
    orderList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    _CartIndex().then(data => {
      this.setData({
        cartList: data.cartList
      })
    })
    _OrderList({
      page:1,
      size:10
    }).then(data => {
      this.setData({
        orderList:data.data
      })
    })
  },
  goodsDelete(e) {
    _CartDelete({
      productIds: e.currentTarget.dataset.prodid
    }).then(data => {
      this.setData({
        cartList:data.cartList
      })
    })
  },
  buyConfirm() {
    _OrderCheckout().then(data => {
      let addressId = data.checkedAddress.id;
      _OrderSubmit({addressId}).then( data => {
        let orderId = data.orderInfo.id
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
        success: function() {
          console.log('success')
        },
        fail:function(res) {
          console.log(res)
        }
      });
    });
  },
  navToOrderDetail(e) {
    let orderId = e.currentTarget.dataset.orderId
    wx.navigateTo({
      url: `../orderDetail/orderDetail?orderId=${orderId}`
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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