// pages/orderList/orderList.js
import {
  _OrderList,
  _WeChatPay,
  _SendFormid,
  _CartAdd,
  _OrderConfirmOrder,
  _OrderCancelOrder,
  _OrderDeleteOrder
} from "../../utils/request";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    requestCode: -1,
    pageIndex: 1
  },
  onLoad: function() {
    this.getOrderList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showToast({
      title: "正在加载",
      icon: "loading",
      mask: true
    });
    this.setData({
      pageIndex: this.data.pageIndex + 1
    });
    this.getOrderList("byScroll");
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
    _OrderList(obj).then(data => {
      if (!str) {
        this.setData({
          orderList: data.data
        });
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        this.setData({
          orderList: [...this.data.orderList, ...data.data]
        });
      }
    });
  },
  orderControl(e) {
    let orderId = e.currentTarget.dataset.orderid;
    let controlStyle = e.currentTarget.dataset.str;
    console.log(controlStyle);
    let promiseObj;
    switch (controlStyle) {
      case 'delete':
        promiseObj = _OrderDeleteOrder({ orderId})
        break;
      case 'cancel':
        promiseObj = _OrderCancelOrder({orderId})
        break;
      case 'confirm':
        promiseObj = _OrderConfirmOrder({orderId})
        break
    }
      promiseObj.then(data => {
        wx.showToast({
          icon: "success",
          title: data,
          duration: 1000
        });
        this.setData({
          pageIndex: 1
        })
        this.getOrderList();
      }).catch(msg => {
        wx.showModal({
          title: msg
        });
      });
  },
  navToOrderDetail(e) {
    let orderId = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: `../orderDetail/orderDetail?orderId=${orderId}`
    });
  },
  changeActive(e) {
    this.setData({
      requestCode: e.currentTarget.dataset.requestcode,
      pageIndex: 1
    });
    this.getOrderList();
  },
  pay(e) {
    let orderId = e.currentTarget.dataset.id;
    _WeChatPay({ orderId })
      .then(data => {
        app.pay(data);
      })
      .catch(msg => {
        wx.showModal({
          title: msg
        });
      });
  },
  buyAgain(e) {
    app.buyAgain(e);
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