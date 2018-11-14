// pages/beforeBalance/beforeBalance.js
import { _OrderSubmit,_WeChatPay,_OrderCheckout} from '../../utils/request'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    allQuantity: "",
    postscript: ""
  },
  onShow: function (options) {
    console.log(2);
  },
  onHide: function (options) {
    console.log(3);
  },
  onLoad: function(options) {
    this.getOrderCheckout();
  },
  getOrderCheckout(fromIndex) {
    _OrderCheckout()
      .then(data => {
        this.setData({
          data
        });
        this.getAllQuantity();
        if (fromIndex) {
          wx.stopPullDownRefresh();
          setTimeout(() => {
            wx.hideLoading();
          }, 600);
        }
      })
      .catch(msg => {
        wx.showModal({
          title: msg
        });
      });
  },
  postscriptInput(e) {
    clearTimeout(this.timer);
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
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.data.data.checkedAddress) {
        _OrderSubmit({
          postscript: this.data.postscript,
          addressId: this.data.data.checkedAddress.id,
          fullCutCouponDec: this.data.data.fullCutCouponDec
        }).then(data => {
          let orderId = data.orderInfo.id;
          _WeChatPay({ orderId })
            .then(data => {
              app.pay(data);
            })
            .catch(msg => {
              wx.showModal({
                title: msg
              });
            });
        });
      } else {
        wx.showModal({
          title: "请先添加地址"
        });
      }
    }, 500);
  },
  navToInvoice() {
    wx.navigateTo({
      url: '../invoice/invoice'
    })
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
  onPullDownRefresh: function() {
    console.log(123456);
    wx.showLoading({
      title: "正在刷新"
    });
    this.getOrderCheckout("pullDown");
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});