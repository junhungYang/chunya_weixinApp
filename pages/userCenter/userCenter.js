// pages/test/test.js
const app = getApp()
import { _PositionList, _OrderList  } from '../../utils/request'
Page({
  data: {
    userInfo: {},
    orderInfo:{}
  },
  onShow() {
    if (wx.getStorageSync("userInfo")) {
      let userInfo = JSON.parse(wx.getStorageSync("userInfo"));
      this.setData({
        userInfo
      });
      this.requestOrderList(undefined)
    } else {
      this.setData({
        userInfo: null
      });
    }
  },
  bindGetUserInfo(res) {
    if (res.detail.userInfo) {
      //用户点击了授权
      app.getSensitiveInfo();
    } else {
      //用户点击了取消
      wx.showModal({
        title: "警告通知",
        content:"您点击了拒绝授权,将无法正常显示个人信息,请从新点击授权按钮获取授权。"
      });
    }
  },
  getOrderList(e) {
    let orderStatus = e.currentTarget.dataset.index
    this.requestOrderList(orderStatus)
  },
  requestOrderList(orderStatus) {
    let promiseObj
    if (orderStatus) {
      promiseObj = _OrderList({
        page: 1,
        size: 1,
        orderStatus
      })
    } else {
      promiseObj = _OrderList({
        page: 1,
        size: 1
      })
    }
    promiseObj.then(data => {
      if(data.data[0]) {
        this.setData({
          orderInfo: data.data[0]
        })
      }else {
        this.setData({
          orderInfo:null
        })
      }
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
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
  onReady() {
    this.setData({
      a: "nimeide"
    });
    _PositionList().then(data => {
      this.setData({
        myAddressList: data
      });
    });
  }
});