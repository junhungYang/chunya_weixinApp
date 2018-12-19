//index.js
//获取应用实例
import {
  _GoodsList,
  _GetSensitiveInfo,
  _SendFormid,
  _UserSignin,
  _SpreadList,
  _wxappMenuList
} from "../../utils/request";
const App = getApp()
var that;
Page({
  data: {
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
    name: "junxing",
    searchText: "",
    searchListHid: true,
    searchList: [],
    searchPage: 1,
    searchTotalPage: 0,
    commonwealList: [],
    commActiveIndex: "",
    commOffset: 0,
    eventItemWidth: 0,
    haowuComp: null,
    colorMenu: [],
    searchAnimate: null,
    searchAnimateFlag: true,
    maskState: true,
    maskAnimate: null
  },

  onLoad() {
    wx.showToast({
      icon: 'loading',
      duration: 2000,
      title: '正在加载',
      mask: true
    })
    this.getCommonwealList();
    this.getColorMenu();
  },
  onReady() {
    App.startAnimate(this, 'maskAnimate', 'opacity', 1,1000)
    let haowuComp = this.selectComponent("#haowu");
    this.setData({ haowuComp });
  },
  closeMask() {
    App.startAnimate(this,'maskAnimate','opacity',0)
    setTimeout(() => {
      this.setData({
        maskState: false
      })
    }, 250);
  },
  navToBeVip() {
    wx.navigateTo({
      url: '../toBeVip/toBeVip'
    })
    this.setData({
      maskState: false
    })
  },
  getColorMenu() {
    _wxappMenuList().then(data => {
      this.setData({
        colorMenu: data
      });
    });
  },
  getCommonwealList() {
    _SpreadList({
      id: 6
    })
      .then(data => {
        this.setData({
          commonwealList: data.adList,
          commActiveIndex: "01"
        });
      })
      .catch(data => App.catchError(data));
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
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let data = e.detail;
      let num = data.scrollLeft % this.data.eventItemWidth;
      let commActiveIndex =
        parseInt(data.scrollLeft / this.data.eventItemWidth) + 1;
      commActiveIndex =
        commActiveIndex < 10 ? `0${commActiveIndex}` : commActiveIndex;
      this.setData({
        commActiveIndex
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
        case "nk":
          wx.navigateTo({ url: `../nuanke/nuanke?isPay=0` });
          break;
        case "gy":
          wx.navigateTo({ url: `../public/public` });
          break;
        case "hw":
          wx.navigateTo({ url: `../haowuList/haowuList` });
          break;
        case "gs":
          wx.navigateTo({ url: `../story/story` });
          break;
        case "qd":
          _UserSignin()
            .then(data => {
              wx.showModal({
                title: "签到成功",
                content: data,
                showCancel: false,
                confirmColor: "#2d2d2d"
              });
            })
            .catch(data => App.catchError(data));
          break;
      }
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
        if (this.data.searchListHid) {
          this.setData({
            searchListHid: false,
            searchAnimateFlag: false
          });
          App.startAnimate(this, "searchAnimate", "opacity", "1");
        }
        this.getSearchList("input");
      } else {
        if (!this.data.searchListHid) {
          App.startAnimate(this, 'searchAnimate', 'opacity', '0')
          setTimeout(() => {
            this.setData({
              searchListHid: true,
              searchAnimateFlag: true
            });
          }, 210);
        } 
      }
    }, 300);
  },
  getSearchList(type) {
    _GoodsList({
      page: this.data.searchPage,
      size: 10,
      keyword: this.data.searchText
    })
      .then(data => {
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
      })
      .catch(data => App.catchError(data));
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
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      App.startAnimate(this, 'searchAnimate', 'opacity', '0')
      setTimeout(() => {
        this.setData({ 
          searchListHid: true,
          searchAnimateFlag: true
        })
      }, 250);
    }, 310);
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  onReachBottom: function() {
    this.data.haowuComp.scrollRefresh();
  },
  onShareAppMessage: function() {
    wx.showShareMenu();
  },
  onPageScroll() {
    if (!this.data.searchListHid&&!this.data.searchAnimateFlag) {
      App.startAnimate(this, "searchAnimate", "opacity", "0");
      this.setData({ searchAnimateFlag: true})
      setTimeout(() => {
        this.setData({ searchListHid: true });
      }, 210);
    }
  },
  onPullDownRefresh() {
    wx.showToast({
      title: "正在加载",
      icon: "loading"
    });
    this.getCommonwealList();
    this.selectComponent("#my-swiper").getList();
    this.data.haowuComp.setData({
      fatherList: [],
      page: 1,
      totalPages: 0
    });
    this.data.haowuComp.getHaowuList();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
