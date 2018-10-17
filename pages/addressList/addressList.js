// pages/addressList/addressList.js
import {
  _PositionList,
  _PositionSave,
  _PositionDelete
} from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPositionList()
  },
  getPositionList() {
    _PositionList().then(data => {
      this.setData({
        addressList: data
      })
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
  },
  addressDefault(e) {
    let data = e.currentTarget.dataset.index
    let is_default = data.is_default === 0 ? true : false
    _PositionSave({
      id: data.id,
      userName: data.userName,
      provinceName: data.provinceName,
      cityName: data.cityName,
      countyName: data.countyName,
      detailInfo: data.detailInfo,
      telNumber: data.telNumber,
      is_default
    }).then(data => {
      this.getPositionList()
    }).catch(msg => {
      wx.showModal({ title: msg });
    })
  },
  addressDel(e) {
    let id = e.currentTarget.dataset.id
    _PositionDelete({
      id
    }).then(data => {
      this.getPositionList();
    }).catch(msg => {
      wx.showModal({
        title:msg
      })
    })
  },
  navToAddressInput(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../addressInput/addressInput?id=${id}`
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