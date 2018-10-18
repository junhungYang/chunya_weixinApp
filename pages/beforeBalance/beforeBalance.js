// pages/beforeBalance/beforeBalance.js
import { _OrderSubmit,_WeChatPay} from '../../utils/request'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    allQuantity: "",
    postscript:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let data = JSON.parse(options.dataStr);
    this.setData({
      data
    });
    this.getAllQuantity();
  },
  postscriptInput(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setData({
        postscript: e.detail.value
      });
    }, 500);
  },
  getAllQuantity() {
    let allQuantity = 0;
    this.data.data.checkedGoodsList.forEach(item => {
      allQuantity += item.number;
    });
    this.setData({
      allQuantity
    });
  },
  navToAddressList() {
      wx.navigateTo({ url: `../addressList/addressList?index=1` });
  },
  orderConfirm() {
    _OrderSubmit({
      postscript: this.data.postscript,
      addressId: this.data.data.checkedAddress.id,
      fullCutCouponDec: this.data.data.fullCutCouponDec
    }).then(data => {
      let orderId = data.orderInfo.id;
      _WeChatPay({ orderId }).then(data => {
        app.pay(data)
      });
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});