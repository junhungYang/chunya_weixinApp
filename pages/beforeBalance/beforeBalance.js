// pages/beforeBalance/beforeBalance.js
import { _OrderSubmit,_WeChatPay,_OrderCheckout} from '../../utils/request'
const App = getApp()
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    allQuantity: "",
    postscript: "",
    invoice: {}
  },
  onLoad: function(options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    this.getOrderCheckout();
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getOrderCheckout()
      }
    }
  },
  navToCoupon() {
    wx.navigateTo({
      url: '../couponBeforeBalance/couponBeforeBalance'
    })
  },
  getOrderCheckout(couponId) {
    let obj = {}
    if(couponId) {
      obj.couponId = couponId
    }
    _OrderCheckout(obj)
      .then(data => {
        this.setData({ data });
        this.getAllQuantity();
        wx.stopPullDownRefresh();
      })
      .catch(data => App.catchError(data));
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
      let wxData = this.data
      if (wxData.data.checkedAddress) {
        let obj = {
          postscript:wxData.postscript,
          addressId:wxData.data.checkedAddress.id,
          fullCutCouponDec:wxData.data.fullCutCouponDec,
          isBilling: 0
        }
        if (wxData.data.checkedInvoice.invoicerMobile) {
          obj.isBilling = 1;
          obj.invoiceId = wxData.data.checkedInvoice.id;
        }
        if (wxData.data.checkedCoupon) {
          obj.couponId = wxData.data.checkedCoupon.id
          obj.couponNumber = wxData.data.checkedCoupon.coupon_number;
        }
        _OrderSubmit(obj)
          .then(data => {
            let orderId = data.orderInfo.id;
            _WeChatPay({ orderId })
              .then(data => {
                App.pay(data);
              })
              .catch(data => App.catchError(data));
          })
          .catch(data => App.catchError(data));
      } else {
        wx.showModal({
          title: "请先添加地址"
        });
      }
    }, 500);
  },
  navToInvoice() {
    wx.navigateTo({
      url: `../invoice/invoice?invoice=${JSON.stringify(this.data.data.checkedInvoice)}`
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
  onPullDownRefresh: function() {
    this.getOrderCheckout();
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