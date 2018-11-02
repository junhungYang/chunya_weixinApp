// pages/reviewsList/reviewsList.js
import { _CommentList } from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviewsList: [],
    pageIndex: 1,
    goodId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goodId: Number(options.goodId)
    })
    this.getCommentList()
  },
  getCommentList(style) {
    _CommentList({
      typeId: 0,
      valueId: 1181007,
      showType: 0,
      page: this.data.pageIndex,
      sort: "desc"
    })
      .then(data => {
        if (!style) {
          this.setData({ reviewsList: data.data });
        } else {
          wx.hideLoading();
          let arr = [...this.data.reviewsList, ...data.data];
          this.setData({ reviewsList: arr });
        }
      })
      .catch(msg => {
        wx.showModal({ title: msg });
      });
  },
  previewImg(e) {
    let picList = e.currentTarget.dataset.piclist
    let index = e.currentTarget.dataset.index
    let arr = []
    picList.forEach(item => {
      arr.push(item.pic_url)
    })
    wx.previewImage({
      urls: arr,
      current: arr[index]
    })
  },
  onReachBottom: function () {
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    this.setData({
      pageIndex: this.data.pageIndex + 1
    });
    this.getCommentList("byScroll");
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