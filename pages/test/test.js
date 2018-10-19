// pages/test/test.js
const app = getApp()
import {_SendFormid } from '../../utils/request'

Page({
  formSubmit_collect: function (e) {
    let fromid = `${e.detail.formId}`;
    let userInfoStorage = wx.getStorageSync('userInfo')
    if(fromid&&userInfoStorage) {
      let openid = JSON.parse(userInfoStorage).openId
      _SendFormid({
        fromid,
        openid
      })
    }
  }
})
