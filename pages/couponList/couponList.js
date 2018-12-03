// pages/couponList/couponList.js
import { _CouponForUser} from '../../utils/request'
const App = getApp()
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    navActive: 0,
    totalPages: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    App.setWatcher(App.globalData,this.watch)
    this.getCouponList();
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getCouponList()
      }
    }
  },
  getCouponList() {
    wx.showLoading({
      title: "正在加载",
      mask:true
    });
    _CouponForUser({
      type: this.data.navActive,
      page: this.data.page,
      size: 10
    }).then(data => {
      let arr = [...this.data.list, ...data.data];
      this.setData({
        list: arr,
        totalPages: data.totalPages
      });
      setTimeout(() => {
        wx.hideLoading();
      }, 600);
      }).catch(data => App.catchError(data))
  },
  changeActive(e) {
    let navActive = e.currentTarget.dataset.index;
    this.setData({
      navActive,
      list: [],
      page: 1
    });
    this.getCouponList();
  },
  navToHaowu() {
    wx.navigateTo({
      url: "../haowuList/haowuList"
    });
  },
  onReachBottom: function() {
    if(this.data.page < this.data.totalPages) {
      this.setData({
        page: this.data.page + 1
      });
      this.getCouponList();
    }else {
      App.theEndPage()
    }

  }
});