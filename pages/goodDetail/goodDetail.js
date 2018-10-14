// pages/goodDetail/goodDetail.js
import { _GoodsDetail, _CartAdd, _OrderCheckout} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    htmlStr:'',
    buyingInfo:{
      goodsId:'',
      productId:'',
      number:''
    }
  },

  onLoad: function (options) {
    _GoodsDetail({id:options.goodId}).then(data => {
      this.setData({
        detail:data
      })
    })
  },
  reToIndex() {
    console.log(222)
    wx.navigateBack({
      url:'../index/index'
    })
  },
  navToCart() {
    console.log(111)
    wx.navigateTo({
      url:'../cart/cart'
    })
  },
  cartAdd(e) {
    let buyingInfo = {
      goodsId: e.currentTarget.dataset.goodsid,
      productId: e.currentTarget.dataset.prodid,
      number: 1
    }
    this.setData({
      buyingInfo: buyingInfo
    });
    _CartAdd(this.data.buyingInfo).then(data => {
      wx.showToast({
        title:'添加成功',
        icon: 'success'
      })
    })
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  orderCheckout() {
    _OrderCheckout().then(data => {
      let addressId = data.checkedAddress.id;
      if (data.checkedAddress) {
        let dataStr = JSON.stringify(data)
        wx.navigateTo({
          url: `../orderDetail/orderDetail?dataStr=${dataStr}`
        })
      } else {
        wx.showModal({
          title: '请添加地址',
          success() {
            wx.redirectTo({
              url: '../userCenter/userCenter'
            })
          }
        })
      }
    })
  }
})