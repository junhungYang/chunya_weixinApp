// pages/haowuList/haowuList.js
import {
  _GoodsList
} from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[1,2,3,4],
    searchText: '',
    searchListHid: true,
    searchList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  searchInput(e) {
    this.setData({
      searchText: e.detail.value
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})