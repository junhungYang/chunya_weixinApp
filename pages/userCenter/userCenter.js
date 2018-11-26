// pages/test/test.js
const App = getApp()
var that;
import {
  _UserCenterOrderCount,
  _GetUserInfo
} from "../../utils/request";
Page({
  data: {
    userInfo: {},
    canIUse: false,
    orderCount: {},
    hasToken: false
  },
  onLoad() {
    that = this
    App.setWatcher(App.globalData, this.watch);
    if(App.globalData.token) {
      this.setData({
        hasToken: true
      })
    }
  },
  onShow() {
    if(App.globalData.token) {
      this.setUserInfo();
      this.requestOrderList();
    }
  },
  watch: {
    token(newValue) {
      if(newValue) {
        that.setData({
          hasToken:true
        })
        that.setUserInfo();
        that.requestOrderList()
      }
    }
  },
  setUserInfo() {
    _GetUserInfo()
      .then(data => {
        this.setData({ userInfo: data });
      })
      .catch(data => App.catchError(data));
  },
  bindGetUserInfo(res) {
    if (res.detail.userInfo) {
      //用户点击了授权
      App.getSensitiveInfo();
    } else {
      //用户点击了取消
      wx.showModal({
        title: "警告通知",
        content:
          "您点击了拒绝授权,将无法正常显示个人信息,请从新点击授权按钮获取授权。"
      });
    }
  },
  requestOrderList() {
      _UserCenterOrderCount()
        .then(data => {
          this.setData({ orderCount: data });
        })
        .catch(data => App.catchError(data)); 
  },
  navToOtherMod(e) {
    let type = e.currentTarget.dataset.type
    if(App.globalData.token) {
      switch (type) {
        case "couList":
          wx.navigateTo({ url: "../couponList/couponList" });
          break;
        case "collect":
          wx.navigateTo({ url: "../myCollect/myCollect" });
          break;
        case "events":
          wx.navigateTo({ url: "../eventsList/eventsList" });
          break;
        case "nuanke":
          wx.navigateTo({ url: "../nuanke/nuanke" });
          break;
        case "address":
          wx.navigateTo({ url: "../addressList/addressList?index=2" });
          break;
        case "about":
          wx.navigateTo({ url: "../aboutChunya/aboutChunya" });
          break;
      }
    }else {
      wx.showModal({
        title: '提示',
        content: '无法进行跳转，请先点击头像进行授权登录'
      })
    }
  },
  navToOrderList(e) {
    if(App.globalData.token) {
      let requestCode = e.currentTarget.dataset.requestcode
      let url = requestCode !== undefined ? `../orderList/orderList?requestCode=${requestCode}` : `../orderList/orderList`;
      wx.navigateTo({
        url
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '无法进行跳转，请先点击头像进行授权登录'
      })
    }
  },
  navToOrderDetail(e) {
    if(App.globalData.token) {
      let orderId = e.currentTarget.dataset.orderid;
      wx.navigateTo({
        url: `../orderDetail/orderDetail?orderId=${orderId}`
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '无法进行跳转，请先点击头像进行授权登录'
      })
    }
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在刷新'
    })
    _GetUserInfo()
      .then(data => {
        this.data.userInfo = data;
        _UserCenterOrderCount()
          .then(data => {
            this.setData({ orderCount: data });
            wx.stopPullDownRefresh();
            setTimeout(() => {
              wx.hideLoading();
            }, 600);
          })
          .catch(data => App.catchError(data));
      })
      .catch(data => App.catchError(data));
  }
});