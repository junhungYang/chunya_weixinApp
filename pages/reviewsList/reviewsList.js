// pages/reviewsList/reviewsList.js
import { _GoodCommentList, _CommentPost } from "../../utils/request";
const App = getApp()
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewsList:[],
    pageIndex:1,
    totalPages: 0,
    goodId: 0,
    scrollFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    App.setWatcher(App.globalData,this.watch)
    this.setData({
      goodId: Number(options.goodId)
    })
    this.getCommentList()
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getCommentList()
      }
    }
  },
  getCommentList(style) {
    _GoodCommentList({
      goodId: this.data.goodId,
      page: this.data.pageIndex,
      size: 20
    }).then(data => {
        wx.setNavigationBarTitle({
          title: `评价(${data.count})`
        })
        setTimeout(() => {
          wx.hideLoading();
        }, 500);
        let arr = [...this.data.reviewsList,...data.data];
        this.setData({
          reviewsList: arr,
          totalPages: data.totalPages,
          scrollFlag: true
        })
      }).catch(data => App.catchError(data))
  },

  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let picList = e.currentTarget.dataset.piclist;
    let arr = [];
    picList.forEach(item => {
      arr.push(item.picUrl);
    });
    wx.previewImage({
      urls: arr,
      current: arr[index]
    });
  
  },
  onReachBottom: function () {
    if(this.data.scrollFlag) {
      if (this.data.pageIndex < this.data.totalPages) {
        wx.showLoading({
          title: "正在加载",
          mask: true
        });
        this.setData({
          pageIndex: this.data.pageIndex + 1,
          scrollFlag: false
        });
        this.getCommentList();
      } else {
        App.theEndPage()
      }
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})