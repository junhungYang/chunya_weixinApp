//app.js
import {
  _GetSessionKey,
  _GetSensitiveInfo,
  _WxappLogin,
  _SetToken,
} from "./utils/request";
App({
  onLaunch: function() {
    // 当打开app时需先判断当前登录态是否已过期
    wx.checkSession({
      success: () => {

        //未过期
        // this.wxappLogin();
        this.wxLoginApi();
      },
      fail: () => {
        //已过期
        this.wxLoginApi();
      }
    });
  },


  //methods
  wxLoginApi() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.getSessionKey(res.code);
      },
      fail: res => {
      }
    });
  },
  getSessionKey(code) {
    _GetSessionKey({code})
    .then(data => {
        wx.setStorageSync("sessionKey", data.session_key);
        this.getSensitiveInfo();
      }).catch(msg => this.showMod(msg))
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
              }).then(data => {
                  wx.setStorageSync("userInfo", data);
                  this.wxappLogin();
              }).catch(msg => this.showMod(msg))
            }
          });
        }
      }
    });
  },
  wxappLogin(data) {
    let userInfoJson = wx.getStorageSync("userInfo")
    let phoneNum = wx.getStorageSync("userPhoneNum");
    if(userInfoJson) {
      let userInfo = JSON.parse(userInfoJson);
      _WxappLogin({
        openid: userInfo.openId,
        gender: userInfo.gender,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        mobile: phoneNum ? phoneNum : ''
      }).then(data => {
        this.globalData.userInfo = data.userInfo;
        _SetToken(data.token)
        this.globalData.token = data.token;
      }).catch(msg => this.showMod(msg))
    }else {
      this.wxLoginApi();
    }
  },
  showMod(msg) {
    wx.showModal({
      title: 'Error',
      content: msg
    })
  },
  //监听器
  setWatcher(data, watch) {
    Object.keys(watch).forEach(v => {
      this.observe(data, v, watch[v]);
    })
  },
  observe(obj, key, watchFun) {
    var val = obj[key];
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        val = value;
        watchFun(value, val)
      },
      get: function () {
        return val
      }
    })
  },
  globalData: {
    userInfo: null,
    cartInfo:{},
    token:''
  }
});
