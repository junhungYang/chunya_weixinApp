//index.js
//获取应用实例
import { _GoodsList, _GetSensitiveInfo} from '../../utils/request'
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    name: "junxing",
    goodsList:[],
    searchIconFlag:false
  },
  onShow() {
    app.setWatcher(this.data,this.watch)
    _GoodsList({
      page:1,
      size:10
    }).then(data => {
      this.setData({
        goodsList:data.data
      })
    })
  },
  test() {
    console.log('nimeide')
  },
  navToGoodDetail(e) {
    let goodId = e.currentTarget.dataset.goodid
    wx.navigateTo({
      url:`../goodDetail/goodDetail?goodId=${goodId}`
    })
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  shangchuan() {  
    wx.chooseImage({
      success: res => {
        let token = app.globalData.token;
        wx.uploadFile({
          url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
          filePath: res.tempFilePaths[0],
          name: "file",
          success: res => {
            alert(res);
          }
        });
      }
    });
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
        let dataObj = JSON.parse(data)
        wx.setStorageSync("userPhoneNum", dataObj.phoneNumber);
        app.wxappLogin();
      })
      .catch(msg => {
        wx.showModal({
          title: msg
        })
      });
  },
  searchGoods(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      _GoodsList({
        page: 1,
        size: 10,
        keyword: e.detail.value
      }).catch(msg => {
          wx.showModal({
            title: msg
          })
        });
    }, 1000);
  },
  watch: {
  }
});
