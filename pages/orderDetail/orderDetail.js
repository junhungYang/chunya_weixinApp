// pages/orderDetail/orderDetail.js
import { _WeChatPay, _OrderDetail} from '../../utils/request'
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
  buyAgain(e) {
    let goodsList = e.currentTarget.dataset.goodslist
    goodsList.forEach((item, index) => {
      _CartAdd({
        id: item.id,
        goodsId: item.goods_id,
        number: item.number
      }).then(data => {
        if (index === goodsList.length - 1) {
          wx.showToast({
            icon: "success",
            title: "已添加至购物车",
            duration: 1000
          })
          setTimeout(() => {
            wx.switchTab({
              url: "../cart/cart"
            });
          }, 1000);
        }
      }).catch(msg => {
        wx.showModal({
          title: msg
        })
      })
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