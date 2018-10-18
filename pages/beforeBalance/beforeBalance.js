// pages/beforeBalance/beforeBalance.js
import { _OrderSubmit,_WeChatPay} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    allQuantity:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.dataStr)
    console.log(data)
    this.setData({
      data
    })
    this.getAllQuantity()
  },
  getAllQuantity() {
    let allQuantity = 0
    this.data.data.checkedGoodsList.forEach(item => {
        allQuantity += item.number
    });
    this.setData({
      allQuantity
    })
  },
  navToAddressInput() {
    if(this.data.data.checkedAddress) {
      let id = this.data.data.checkedAddress.id
      wx.navigateTo({ url: `../addressInput/addressInput?id=${id}` });
    }else {
      wx.navigateTo({ url: `../addressInput/addressInput` });
    }
    
  },
  orderConfirm() {
    _OrderSubmit({
      postscript: "",
      addressId: this.data.data.checkedAddress.id,
      fullCutCouponDec: this.data.data.fullCutCouponDec
    }).then(data => {
      let orderId = data.orderInfo.id;
      _WeChatPay({ orderId }).then(data => {
        wx.requestPayment({
          timeStamp: data.timeStamp,
          appId: data.appId,
          nonceStr: data.nonceStr,
          package: data.package,
          signType: data.signType,
          paySign: data.paySign,
          success: function(res) {
            wx.showToast({
              title:'成功结算',
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '../orderList/orderList'
              })
            }, 1000);
          },
          fail: function(res) {
            wx.redirectTo({
              url:'../orderList/orderList'
            })
          }
        });
      });
    });
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})