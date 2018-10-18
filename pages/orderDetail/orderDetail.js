// pages/orderDetail/orderDetail.js
import { _OrderSubmit, _WeChatPay, _OrderDetail} from '../../utils/request'
Page({

  data: {
    data:{}
  },


  onLoad: function (options) {
   let orderId = options.id
    _OrderDetail({
      orderId
    }).then(data => {
      this.setData({
        data
      })
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
  },
  onReady: function () {

  },
  buyConfirm() {
    let addressId = this.data.orderDetail.checkedAddress.id;
    _OrderSubmit({ addressId }).then(data => {
      let orderId = data.orderInfo.id;
      _WeChatPay({ orderId }).then(data => {
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
        })
      })
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