//index.js
//获取应用实例
import {
  _GoodsList,
  _GetSensitiveInfo,
  _SendFormid,
  _UserSignin,
  _SpreadList
} from "../../utils/request";
const app = getApp()
var that;
Page({
  data: {
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    name: "junxing",
    goodsList: [],
    searchText:'',
    searchListHid:true,
    searchList:[],
    commonwealList: [],
    commActiveIndex: '',
    commAllPage:'' 
  },

  onLoad() {
    _GoodsList({
      page: 1,
      size: 10
    }).then(data => {
      this.setData({
        goodsList: data.data
      });
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
    _SpreadList({
      id: 6
    }).then(data => {
      this.setData({
        commonwealList: data.adList,
        commAllPage: data.adList.length,
        commActiveIndex: 1
      });
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
  },
  changeCommIndex(e) {
    let data = e.detail
    let num = (data.scrollLeft) % 327;
    if (num < 20 && num > -20) {
      this.setData({
        commActiveIndex: parseInt(data.scrollLeft / 327) +1
      })
    }
  },
  navToPublicDetail(e) {
    if(app.globalData.token) {
      let url = e.currentTarget.dataset.url
      wx.navigateTo({
        url
      })
    }else {
      this.switchToLogin()
    }

  },
  formSubmit_collect: function (e) {
    let fromid = `${e.detail.formId}`;
    let userInfoStorage = wx.getStorageSync('userInfo')
    if (fromid && userInfoStorage) {
      let openid = JSON.parse(userInfoStorage).openId
      _SendFormid({
        fromid,
        openid
      })
    }
  },
  switchToLogin() {
    wx.showModal({
      title: '无法跳转',
      content: '请先进行登录操作',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '../cart/cart'
          })
        }
      }
    })
  },
  navToGoodDetail(e) {
    if(app.globalData.token) {
      let goodId = e.currentTarget.dataset.goodid;
      wx.navigateTo({
        url: `../goodDetail/goodDetail?goodId=${goodId}`
      });
    }else {
      this.switchToLogin()
    }
  },
  navToNuanke() {
    if(app.globalData.token) {
      wx.navigateTo({
        url: `../nuanke/nuanke`
      });
    } else {
      this.switchToLogin()
    }
  },
  navToPublic() {
    if(app.globalData.token) {
      wx.navigateTo({
        url: `../public/public`
      })
    } else {
      this.switchToLogin()
    }
  },
  navToHaowu() {
    if (app.globalData.token) {
      wx.navigateTo({ url: "../haowuList/haowuList" });
    } else {
      this.switchToLogin();
    }
  },
  navToStory() {
    if (app.globalData.token) {
      wx.navigateTo({ url: "../story/story" });
    } else {
      this.switchToLogin();
    }
  },
  toSign() {
    if (app.globalData.token) {
      _UserSignin()
        .then(data => {
          wx.showModal({
            title: "签到成功",
            content: data,
            showCancel: false,
            confirmColor: "#2d2d2d"
          });
        })
        .catch(msg => {
          wx.showModal({
            title: msg,
            showCancel: false,
            confirmColor: "#2d2d2d"
          });
        });
    } else {
      this.switchToLogin();
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
        content:
          "您点击了拒绝授权,将无法正常显示个人信息,请从新点击授权按钮获取授权。"
      });
    }
  },
  getPhoneNumber(e) {
    let sessionKey = wx.getStorageSync("sessionKey");
    _GetSensitiveInfo({
      sessionKey,
      encryptedData: e.detail.encryptedData,
      ivStr: e.detail.iv
    })
      .then(data => {
        let dataObj = JSON.parse(data);
        wx.setStorageSync("userPhoneNum", dataObj.phoneNumber);
        app.wxappLogin();
      })
      .catch(msg => {
        wx.showModal({
          title: msg
        });
      });
  },
  searchInput(e) {
    this.setData({
      searchText:e.detail.value
    })
    if (this.data.searchText) {
      this.setData({ searchListHid: false })
    } else {
      this.setData({ searchListHid: true });
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      _GoodsList({
        page: 1,
        size: 10,
        keyword: this.data.searchText
      }).then(data => {
        this.setData({
          searchList: data.data
        })
      }).catch(msg => {
        wx.showModal({
          title: msg
        });
      });
    }, 500);
  }, 
  hidSearchList() {
      this.setData({
        searchListHid: true,
      });
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  onShareAppMessage: function() {
    wx.showShareMenu();
  }
});
