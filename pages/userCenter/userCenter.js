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
    orderInfo: null,
    canIUse: false
  },
  onLoad() {
    that = this
    app.setWatcher(app.globalData, this.watch);
    if(app.globalData.token) {
      this.setData({
        hasToken: true
      })
      this.setUserInfo();
    }
  },
  onShow() {
    if(app.globalData.token) {
      this.requestOrderList(300);
    }
  },
  watch: {
    token(newValue) {
      if(newValue) {
        that.setData({
          hasToken:true
        })
        that.setUserInfo();
        that.requestOrderList(300)
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
  getOrderList(e) {
    let orderStatus = e.currentTarget.dataset.index;
    this.requestOrderList(orderStatus);
  },
  requestOrderList(orderStatus) {
    let promiseObj;
    if (!orderStatus) {
      this.setData({
        orderInfo: null
      });
    } else {
      _UserCenterOrderCount().then(data => {
        if(data.orderInfo) {
          this.setData({
            orderInfo: data.orderInfo
          })
        } else {
          this.setData({
            orderInfo: null
          })
        }
      }).catch(msg => {
        wx.showModal({
          title
        })
      })
    }      
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
        if (data.orderInfo) {
          this.setData({
            orderInfo: data.orderInfo
          })
        } else {
          this.setData({
            orderInfo: null
          })
        }
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