// pages/goodDetail/goodDetail.js
import { _GoodsDetail, _CartAdd} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    htmlStr:'',
    prodListFlag:true,
    buyingInfo:{
      goodsId:'',
      productId:'',
      number:''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    _GoodsDetail({id:options.goodId}).then(data => {
      this.setData({
        detail:data
      })
    })
  },
  openProdList() {
    this.setData({
      prodListFlag:false
    })
  },
  closeProdList(e) {
    let buyingInfo = {
      goodsId: e.currentTarget.dataset.goodsid,
      productId: e.currentTarget.dataset.prodid,
      number:1
    }
    this.setData({
      prodListFlag: true,
      buyingInfo: buyingInfo
    });
    this.cartAdd()
  },
  cartAdd() {
    _CartAdd(this.data.buyingInfo).then(data => {
      wx.showToast({
        title:'添加成功',
        icon: 'success'
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