// pages/cart/cart.js
import { _CartIndex, _CartDelete, _OrderCheckout, _OrderSubmit, _OrderList, _WeChatPay} from '../../utils/request'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'junxing',
    cartList:[],
    couponInfoList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    _CartIndex().then(data => {
      this.setData({
        cartList: data.cartList
      })
    })
  },
  goodsDelete(e) {
    _CartDelete({
      productIds: e.currentTarget.dataset.prodid
    }).then(data => {
      this.setData({
        cartList:data.cartList
      })
    })
  },
  buyConfirm() {
    _OrderCheckout().then(data => {
      let addressId = data.checkedAddress.id;
      if(data.checkedAddress) {
        let dataStr = JSON.stringify(data)
        wx.navigateTo({
          url: `../orderDetail/orderDetail?dataStr=${dataStr}`
        })
      }else {
        wx.showModal({
          title:'请添加地址',
          success() {
            wx.redirectTo({
              url: '../userCenter/userCenter'
            })
          }
        })
      }

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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