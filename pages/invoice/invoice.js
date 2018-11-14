// pages/invoice/invoice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invStyle: 'e-inv',
    invTitleStyle: 'person',
    invTitleText: '',
    invContText:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeInvStyle(e) {
    let  invStyle = e.currentTarget.dataset.style
    this.setData({
      invStyle
    })
  },
  changeInvTitleStyle(e) {
    let invTitleStyle = e.currentTarget.dataset.style
    this.setData({
      invTitleStyle
    })
  },
  inputInvTitle(e) {
    if(e.detail.value === ' ') {
      this.setData({
        invTitleText: ''
      })
    }else {
      this.setData({
        invTitleText: e.detail.value
      })
    }
  },
  inputInvCont(e) {
    if (e.detail.value === ' ') {
      this.setData({
        invContText: ''
      })
    } else {
      this.setData({
        invContText: e.detail.value
      })
    }
  },
  navBack() {
    wx.navigateBack({
      delta: 1
    })
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