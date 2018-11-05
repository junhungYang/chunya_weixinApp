// pages/nuankeDetail/nuankeDetail.js
const App = getApp()
import { _WarmclassDetail} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    contentDesc:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(App.globalData.token) {
      this.setData({
        id: Number(options.id)
      })
      this.getDetail()
    }
  },
  getDetail() {
    _WarmclassDetail({
      id:this.data.id
    }).then(data => {
      wx.setNavigationBarTitle({
        title: data.title
      })
      this.setData({
        contentDesc: data.contentDesc
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