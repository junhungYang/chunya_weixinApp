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
    searchText: "",
    searchListHid: true,
    searchList: [],
    commonwealList: [],
    commActiveIndex: "",
    commOffset: 0,
    eventItemWidth: 0,
    goodsTotalPages: 0,
    goodsPage: 1,
  },

  onLoad() {
    this.getGoodsList();
    app.setWatcher(app.globalData, this.watch);
    that = this;
    _SpreadList({
      id: 6
    }).then(data => {
      this.setData({
        commonwealList: data.adList,
        commAllPage: data.adList.length,
        commActiveIndex: 1
      });
    });
  },
  watch: {
    publicSwiperIndex(nV) {
      that.setData({ commActiveIndex: nV });
    }
  },
  getGoodsList() {
    _GoodsList({
      page: this.data.goodsPage,
      size: 10
    }).then(data => {
      this.setData({
        goodsList: data.data,
        goodsTotalPages: data.totalPages
      });
    });
  },
  getEventWidth() {
    let query = wx.createSelectorQuery();
    query.select("#events-item").boundingClientRect();
    query.exec(res => {
      this.setData({ eventItemWidth: parseInt(res[0].width) });
    });
    // console.log(this.data.eventItemWidth)
  },
  changeCommIndex(e) {
    if (this.data.eventItemWidth === 0) {
      this.getEventWidth();
    }
    let data = e.detail;
    let num = data.scrollLeft % this.data.eventItemWidth;
      this.setData({
        commActiveIndex:
          parseInt(data.scrollLeft / this.data.eventItemWidth) + 1
      });
  },
  navToPublicDetail(e) {
    if (app.globalData.token) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({ url });
    } else {
      this.switchToLogin();
    }
  },
  formSubmit_collect: function(e) {
    let fromid = `${e.detail.formId}`;
    let userInfoStorage = wx.getStorageSync("userInfo");
    if (fromid && userInfoStorage) {
      let openid = JSON.parse(userInfoStorage).openId;
      _SendFormid({
        fromid,
        openid
      });
    }
  },
  switchToLogin() {
    wx.showModal({
      title: "提示",
      content: "请先进行登录操作",
      success: res => {
        if (res.confirm) {
          wx.switchTab({
            url: "../cart/cart"
          });
        }
      }
    });
  },
  navToColorBtnMod(e) {
    let type = e.currentTarget.dataset.type;
    if (app.globalData.token) {
      switch (type) {
        case "nuanke":
          wx.navigateTo({ url: `../nuanke/nuanke` });
          break;
        case "public":
          wx.navigateTo({ url: `../public/public` });
          break;
        case "haowu":
          wx.navigateTo({ url: `../haowuList/haowuList` });
          break;
        case "story":
          wx.navigateTo({ url: `../story/story` });
          break;
        case "signin":
          _UserSignin().then(data => {
            wx.showModal({
              title: "签到成功",
              content: data,
              showCancel: false,
              confirmColor: "#2d2d2d"
            });
          });
          break;
      }
    } else {
      this.switchToLogin();
    }
  },
  navToGoodDetail(e) {
    if (app.globalData.token) {
      let goodId = e.currentTarget.dataset.goodid;
      wx.navigateTo({
        url: `../goodDetail/goodDetail?goodId=${goodId}`
      });
    } else {
      this.switchToLogin();
    }
  },
  searchInput(e) {
    this.setData({
      searchText: e.detail.value
    });
    if (this.data.searchText) {
      this.setData({ searchListHid: false });
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
        });
      });
    }, 500);
  },
  hidSearchList() {
    this.setData({
      searchListHid: true
    });
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  onReachBottom: function() {
    if (this.data.goodsPage < this.data.goodsTotalPages) {
      this.setData({ page: this.data.goodsPage + 1 });
      wx.showLoading({
        title: "正在加载"
      });
      this.getHaowuList();
    } else {
      app.theEndPage();
    }
  },
  onShareAppMessage: function() {
    wx.showShareMenu();
  }
});
