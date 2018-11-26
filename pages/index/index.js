//index.js
//获取应用实例
import {
  _GoodsList,
  _GetSensitiveInfo,
  _SendFormid,
  _UserSignin,
  _SpreadList
} from "../../utils/request";
const App = getApp()
var that;
Page({
  data: {
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    name: "junxing",
    goodsList: [],
    searchText: "",
    searchListHid: true,
    searchList: [],
    searchPage: 1,
    searchTotalPage: 0,
    commonwealList: [],
    commActiveIndex: "",
    commOffset: 0,
    eventItemWidth: 0,
    goodsTotalPages: 0,
    goodsPage: 1,
    testArr: [1, 2, 3, 4, 5, 6, 78, 9, 78, 54, 2, 6, 45, 3]
  },

  onLoad() {
    this.getGoodsList();
    App.setWatcher(App.globalData, this.watch);
    that = this;
    _SpreadList({
      id: 6
    }).then(data => {
      this.setData({
        commonwealList: data.adList,
        commAllPage: data.adList.length,
        commActiveIndex: 1
      });
      }).catch(data => App.catchError(data))
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
      }).catch(data => App.catchError(data))
  },
  getEventWidth() {
    let query = wx.createSelectorQuery();
    query.select("#events-item").boundingClientRect();
    query.exec(res => {
      this.setData({ eventItemWidth: parseInt(res[0].width) });
    });
  },
  changeCommIndex(e) {
    if (this.data.eventItemWidth === 0) {
      this.getEventWidth();
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let data = e.detail;
      let num = data.scrollLeft % this.data.eventItemWidth;
      this.setData({
        commActiveIndex: parseInt(data.scrollLeft / this.data.eventItemWidth) + 1
      });
    }, 500);
  },
  navToPublicOrEvent(e) {
    if (App.globalData.token) {
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
    if (App.globalData.token) {
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
          }).catch(data => App.catchError(data))
          break;
      }
    } else {
      this.switchToLogin();
    }
  },
  navToGoodDetail(e) {
    if (App.globalData.token) {
      let goodId = e.currentTarget.dataset.goodid;
      wx.navigateTo({
        url: `../goodDetail/goodDetail?goodId=${goodId}`
      });
    } else {
      this.switchToLogin();
    }
  },
  searchInput(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setData({
        searchText: e.detail.value,
        searchPage: 1
      });
      if (this.data.searchText) {
        this.setData({ searchListHid: false });
      } else {
        this.setData({ searchListHid: true });
      }
      this.getSearchList("input");
    }, 500);
  },
  getSearchList(type) {
    _GoodsList({
      page: this.data.searchPage,
      size: 10,
      keyword: this.data.searchText
    }).then(data => {
      this.setData({ searchTotalPage: data.totalPages });
      if (type === "input") {
        this.setData({
          searchList: data.data
        });
      } else {
        this.setData({
          searchList: [...this.data.searchList, ...data.data]
        });
      }
      }).catch(data => App.catchError(data))
  },
  searchListScroll() {
    if (this.data.searchPage < this.data.searchTotalPage) {
      this.setData({
        searchPage: this.data.searchPage + 1
      });
      this.getSearchList("scroll");
    } else {
      App.theEndPage();
    }
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
      App.theEndPage();
    }
  },
  onShareAppMessage: function() {
    wx.showShareMenu();
  }
});
