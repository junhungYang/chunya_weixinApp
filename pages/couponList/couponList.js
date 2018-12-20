// pages/couponList/couponList.js
import { _CouponForUser} from '../../utils/request'
const App = getApp()
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: ['','',''],
    navActive: 0,
    scrollFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    App.setWatcher(App.globalData,this.watch)
    this.data.list.forEach((item,index) => {
      this.getCouponList(1,index);
    })
  },
  watch: {
    token(nV) {
      if(nV) {
        that.data.list.forEach((item, index) => {
          that.getCouponList(1, index);
        })
      }
    }
  },
  getCouponList(page,typeIndex,scroll) {
    wx.showLoading({
      title: "正在加载",
      mask:true
    });
    _CouponForUser({
      type:typeIndex,
      page,
      size: 20
    }).then(data => {
      let list = this.data.list
      if(scroll) {
        list[typeIndex].currentPage ++
        list[typeIndex].data = [...list[typeIndex].data,...data.data]
      }else {
        list[typeIndex] = data
      }
      this.setData({
        list,
        scrollFlag: true
      })
      App.hideLoadingInSwiper(this.data.list, "");
      }).catch(data => App.catchError(data))
  },
  changeActiveByScroll(e) {
    this.setData({
      navActive: e.detail.current
    })
  },
  changeActiveByClick(e) {
    let navActive = e.currentTarget.dataset.index;
    this.setData({
      navActive
    })
  },
  navToHaowu() {
    wx.navigateTo({
      url: "../haowuList/haowuList"
    });
  },
  scrollRefresh(e) {
    let fatherIndex = e.currentTarget.dataset.index
    let fatherItem = e.currentTarget.dataset.item
    if(fatherItem.currentPage < fatherItem.totalPages) {
      this.getCouponList(fatherItem.currentPage+1,fatherIndex,'scroll')
      this.setData({scrollFlag:false})
    }else {
      App.theEndPage()
    }
  }
});