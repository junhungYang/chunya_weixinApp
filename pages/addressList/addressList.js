// pages/addressList/addressList.js
const app = getApp()
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
    addressList:[],
    fromIndex:'',
    text:app.globalData.text
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      fromIndex:options.index
    })
    console.log(this.data.fromIndex)
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
  navBackBeforeBalance(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let activeAddress = e.currentTarget.dataset.item
    let data = prevPage.data.data
    data.checkedAddress = activeAddress;
    prevPage.setData({
      data
    })
    wx.navigateBack({
      delta:1
    })
  },
  navToAddressInput(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../addressInput/addressInput?id=${id}`
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