// pages/test/test.js
const app = getApp()
import {
  _OrderList,
  _SetToken,
  _GetSensitiveInfo,
  _WxappLogin
} from "../../utils/request";
Page({
  data: {
    userInfo: {},
    orderInfo: {},
    canIUse: false
  },
  onLoad() {
    this.setData({
      canIUse: app.globalData.canIUseFlag
    })
  },
  onShow() {
    this.setUserInfo();
  },
  setUserInfo() {
    if (wx.getStorageSync("userInfo")) {
      let userInfo = JSON.parse(wx.getStorageSync("userInfo"));
      this.setData({ userInfo });
      this.requestOrderList(undefined);
    } else {
      this.setData({ userInfo: null });
    }
  },
  bindGetUserInfo(res) {
    console.log(res)
    if (res.detail.userInfo) {
      //用户点击了授权
      this.getSensitiveInfo();
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
    if (orderStatus) {
      promiseObj = _OrderList({
        page: 1,
        size: 1,
        orderStatus
      });
    } else {
      promiseObj = _OrderList({
        page: 1,
        size: 1
      });
    }
    promiseObj
      .then(data => {
        if (data.data[0]) {
          this.setData({
            orderInfo: data.data[0]
          });
        } else {
          this.setData({
            orderInfo: null
          });
        }
      })
      .catch(msg => {
        wx.showModal({
          title: msg
        });
      });
  },
  navToOrderList() {
    wx.navigateTo({
      url: "../orderList/orderList"
    });
  },
  navToAddressList() {
    wx.navigateTo({
      url: "../addressList/addressList?index=2"
    });
  },
  getSensitiveInfo() {
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          let sessionKey = wx.getStorageSync("sessionKey");
          wx.getUserInfo({
            success: res => {
              _GetSensitiveInfo({
                sessionKey,
                encryptedData: res.encryptedData,
                ivStr: res.iv
              })
                .then(data => {
                  console.log(1111)
                  wx.setStorageSync("userInfo", data);
                  this.wxappLogin();
                })
                .catch(msg => {
                  wx.showModal({
                    title: msg
                  });
                });
            }
          });
        }
      }
    });
  },
  wxappLogin() {
    let userInfoJson = wx.getStorageSync("userInfo");
    let phoneNum = wx.getStorageSync("userPhoneNum");
    if (userInfoJson) {
      let userInfo = JSON.parse(userInfoJson);
      _WxappLogin({
        openid: userInfo.openId,
        gender: userInfo.gender,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        mobile: phoneNum ? phoneNum : ""
      })
        .then(data => {
          app.globalData.userInfo = data.userInfo;
          _SetToken(data.token);
          app.globalData.token = data.token;
          this.setData({
            canIUse: true
          })
          app.globalData.canIUseFlag = true
          this.setUserInfo();
          this.requestOrderList(undefined)
        })
        .catch(msg => {
          wx.showModal()
        });
    } else {
      app.wxLoginApi();
    }
  },
});