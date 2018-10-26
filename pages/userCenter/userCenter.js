// pages/test/test.js
const app = getApp()
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
    app.setWatcher(app.globalData, this.watch);
    if(app.globalData.token) {
      this.setData({
        hasToken: true
      })
    }
  },
  onShow() {
    if(app.globalData.token) {
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
    _GetUserInfo().then(data => {
      this.setData({
        userInfo:data
      })
    }).catch(msg => wx.showModal({title:msg}));
  },
  bindGetUserInfo(res) {
    if (res.detail.userInfo) {
      //用户点击了授权
      app.getSensitiveInfo();
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
      _UserCenterOrderCount().then(data => {
        this.setData({
          orderCount: data
        })
      }).catch(msg => {
        wx.showModal({
          title
        })
      })    
  },
  navToOrderList(e) {
    let requestCode = e.currentTarget.dataset.requestcode
    let url = requestCode !== undefined ? `../orderList/orderList?requestCode=${requestCode}` : `../orderList/orderList`;
    wx.navigateTo({
      url
    });
  },
  navToAddressList() {
    wx.navigateTo({
      url: "../addressList/addressList?index=2"
    });
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '正在刷新'
    })
    _GetUserInfo().then(data => {
      this.data.userInfo = data;
      _UserCenterOrderCount().then(data => {
        this.setData({
          orderCount:data
        })
        wx.stopPullDownRefresh();
        setTimeout(() => {
          wx.hideLoading();
        }, 600)
      }).catch(msg => {
        wx.showModal({
          title: msg
        })
      })
    }).catch(msg => wx.showModal({ title: msg }));
  }
});