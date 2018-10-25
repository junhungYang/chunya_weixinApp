//app.js
import {
  _GetSessionKey,
  _GetSensitiveInfo,
  _WxappLogin,
  _SetToken,
  _CartAdd
} from "./utils/request";
App({
  onLaunch: function() {
    // 当打开app时需先判断当前登录态是否已过期
    wx.checkSession({
      success: () => {
        //未过期
        let userInfoJson = wx.getStorageSync("userInfo");
        wx.getSetting({
          success: res => {
            if (res.authSetting["scope.userInfo"] && userInfoJson) {
              this.wxappLogin(userInfoJson);
            } else {
              this.wxLoginApi();
            }
          }
        });
      },
      fail: () => {
        //已过期
        this.wxLoginApi();
      }
    });
  },
  test() {
    console.log('test')
  },
  //methods
  wxLoginApi() {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.getSessionKey(res.code);
      },
      fail: res => {}
    });
  },
  getSessionKey(code) {
    _GetSessionKey({ code })
      .then(data => {
        wx.setStorageSync("sessionKey", data.session_key);
        this.getSensitiveInfo();
      })
      .catch(msg => this.showMod(msg));
  },
  getSensitiveInfo() {
    wx.getSetting({
      success: res => {
        this.globalData.canIUseFlag = res.authSetting["scope.userInfo"];
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
                  wx.setStorageSync("userInfo", data);
                  this.wxappLogin();
                })
                .catch(msg => this.showMod(msg));
            }
          });
        } else {
          wx.switchTab({
            url:'../cart/cart'
          })
        }
      }
    });
  },
  wxappLogin() {
    let userInfoJson = wx.getStorageSync("userInfo");
    let phoneNum = wx.getStorageSync("userPhoneNum");
      let userInfo = JSON.parse(userInfoJson);
      _WxappLogin({
        openid: userInfo.openId,
        gender: userInfo.gender,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        mobile: phoneNum ? phoneNum : ""
      })
        .then(data => {
          _SetToken(data.token);
          this.globalData.token = data.token;
        })
        .catch(msg => this.showMod(msg));
  },
  pay(data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      appId: data.appId,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: "成功结算"
        });
        setTimeout(() => {
          wx.redirectTo({
            url: "../orderList/orderList"
          });
        }, 1000);
      },
      fail: function (res) {
        wx.redirectTo({
          url: "../orderList/orderList"
        });
      }
    });
  },
  buyAgain(e) {
    let goodsList = e.currentTarget.dataset.goodslist;
    goodsList.forEach((item, index) => {
      _CartAdd({
        productId: item.product_id,
        goodsId: item.goods_id,
        number: item.number
      })
        .then(data => {
          if (index === goodsList.length - 1) {
            wx.showToast({
              icon: "success",
              title: "已添加至购物车",
              duration: 1000
            });
            setTimeout(() => {
              wx.switchTab({ url: "../cart/cart" });
            }, 1000);
          }
        })
        .catch(msg => {
          wx.showModal({ title: msg });
        });
    });
  },
  showMod(msg) {
    wx.showModal({
      title: "Error",
      content: msg
    });
  },
  //监听器
  setWatcher(data, watch) {
    Object.keys(watch).forEach(v => {
      this.observe(data, v, watch[v]);
    });
  },
  observe(obj, key, watchFun) {
    var val = obj[key];
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function(value) {
        val = value;
        watchFun(value, val);
      },
      get: function() {
        return val;
      }
    });
  },
  globalData: {
    userInfo: null,
    cartInfo: {},
    token: "",
    text: "abc",
    canIUseFlag: false
  }
});
