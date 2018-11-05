//index.js
//获取应用实例
import { _GoodsList, _GetSensitiveInfo, _SendFormid, _UserSignin} from '../../utils/request'
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
  },

  onShow() {
    _GoodsList({
      page: 1,
      size: 10
    }).then(data => {
      this.setData({
        goodsList: data.data
      });
    });
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
  navToGoodDetail(e) {
    if(app.globalData.token) {
      let goodId = e.currentTarget.dataset.goodid;
      wx.navigateTo({
        url: `../goodDetail/goodDetail?goodId=${goodId}`
      });
    }
  },
  navToNuanke() {
    wx.navigateTo({
        url: `../nuanke/nuanke`
      });
  },
  navToPublic() {
    wx.navigateTo({
      url: `../public/public`
    })
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  navToHaowu() {
    wx.navigateTo({
      url: "../haowuList/haowuList"
    })
  },
  navToStory() {
    wx.navigateTo({
      url: "../story/story"
    })
  },
  shangchuan() {
    // wx.chooseImage({
    //   success: res => {
    //     let token = app.globalData.token;
    //     wx.uploadFile({
    //       url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
    //       filePath: res.tempFilePaths[0],
    //       name: "file",
    //       success: res => {
    //         alert(res);
    //       }
    //     });
    //   }
    // });
    wx.chooseVideo({
      success(res) {
        console.log(res);
          wx.uploadFile({
            url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
            filePath: res.tempFilePath,
            name: "file",
            success: res => {}
          });
      }
    })
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
  toSign() {
    if(app.globalData.token) {
      _UserSignin().then(data => {
        wx.showModal({
          title: "签到成功",
          content: data,
          showCancel: false,
          confirmColor: '#2d2d2d'
        });
      }).catch(msg => {
        wx.showModal({
          title:msg,
          showCancel:false,
          confirmColor: '#2d2d2d'
        })
      })
    }
  }, 
  hidSearchList() {
      this.setData({
        searchListHid: true,
      });
  },
  onShareAppMessage: function() {
    wx.showShareMenu();
  }
});
