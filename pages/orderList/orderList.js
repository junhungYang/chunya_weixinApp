// pages/orderList/orderList.js
import {
  _OrderList,
  _WeChatPay,
  _SendFormid,
  _CartAdd,
  _OrderConfirmOrder,
  _OrderCancelOrder,
  _OrderDeleteOrder,
  _TakeDelay
} from "../../utils/request";
const App = getApp();
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    requestCode: -1,
    pageIndex: 1,
    totalPages: 0
  },
  onLoad: function(options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    if(options.requestCode) {
      this.setData({
        requestCode: Number(options.requestCode)
      })
    }
    this.getOrderList();
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getOrderList()
      }
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.pageIndex < this.data.totalPages) {
      wx.showToast({
        title: "正在加载",
        icon: "loading",
        mask: true
      });
      this.setData({
        pageIndex: this.data.pageIndex + 1
      });
      this.getOrderList("byScroll");
    }else {
      App.theEndPage()
    }
  },
  formSubmit_collect: function(e) {
    let fromid = `${e.detail.formId}`;
    let userInfoStorage = wx.getStorageSync("userInfo");
    if (fromid && userInfoStorage) {
      let openid = JSON.parse(userInfoStorage).openId;
      _SendFormid({
        fromid,
        openid
      });
    }
  },
  getOrderList(str) {
    let obj = { page: this.data.pageIndex, size: 10 };
    if (this.data.requestCode !== -1) {
      obj = {
        page: this.data.pageIndex,
        size: 10,
        orderStatus: this.data.requestCode
      };
    }
    _OrderList(obj)
      .then(data => {
        if (!str) {
          this.setData({
            orderList: data.data,
            totalPages: data.totalPages
          });
        } else {
          this.setData({
            orderList: [...this.data.orderList, ...data.data],
            totalPages: data.totalPages
          });
        }
      })
      .catch(data => App.catchError(data));
  },
  orderControl(e) {
    let orderId = e.currentTarget.dataset.orderid;
    let controlStyle = e.currentTarget.dataset.str;
    let promiseObj = App.orderControl(orderId,controlStyle,'list');
    if(promiseObj) {
      promiseObj
        .then(data => {
          wx.showToast({ icon: "success", title: data, duration: 1000 });
          this.setData({ pageIndex: 1 });
          this.getOrderList();
        })
        .catch(data => App.catchError(data));
    }
      
  },
  navToOrderDetail(e) {
    let orderId = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: `../orderDetail/orderDetail?orderId=${orderId}`
    });
  },
  navToShippingList(e) {
    let orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: `../shippingList/shippingList?orderId=${orderId}`
    })
  },
  changeActive(e) {
    this.setData({
      requestCode: e.currentTarget.dataset.requestcode,
      pageIndex: 1
    });
    wx.pageScrollTo({ scrollTop: 0 });
    this.getOrderList();
  },
  pay(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let orderId = e.currentTarget.dataset.id;
      _WeChatPay({ orderId })
        .then(data => {
          App.pay(data);
        })
        .catch(data => App.catchError(data));
    }, 500);
  },
  buyAgain(e) {
    App.buyAgain(e);
  },
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});