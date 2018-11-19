// pages/myCollect/myCollect.js
import { _CollectList, _CollectAddorDelete} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyCollect()
  },
  getMyCollect() {
    _CollectList({
      typeId: 0,
      page: this.data.page,
      size: 10
    }).then(data => {
      let arr = [...this.data.list,...data.data]
      this.setData({
        list: arr
      })
    })
  },
  navToGoodDetail(e) {
    let goodId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../goodDetail/goodDetail?goodId=${goodId}&from=${'collect'}`
    })
  },
  delete(e) {
    let valueId = e.currentTarget.dataset.id
    _CollectAddorDelete({
      typeId: 0,
      valueId
    }).then(data => {
      this.setData({
        page: 1,
        list: []
      });
      this.getMyCollect()
    })
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