// pages/cart/cart.js
import { 
    _CartIndex,
     _CartDelete, 
     _OrderCheckout, 
     _OrderSubmit,
      _OrderList, 
      _WeChatPay,
     _CartAdd,
    _CartChecked} from '../../utils/request'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: 'junxing',
    cartList:[],
    couponInfoList:[],
    cartTotal:{},
    allChoose: false
  },

  onShow: function (options) {
    _CartIndex().then(data => {
      this.setData({
        cartList: data.cartList,
        cartTotal: data.cartTotal
      })
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
  },
  //全选
  allChoose() {
    this.setData({
      allChoose: !this.data.allChoose
    })
    let arr = []
    this.data.cartList.forEach(item => {
        arr.push(item.product_id)
    })
    let str = arr.toString()
    
  },
  //单选
  choose(e) {
    let isChecked = e.currentTarget.dataset.state === 1 ? 0 : 1
    let arrindex = e.currentTarget.dataset.arrindex;
    _CartChecked({
      productIds:this.data.cartList[arrindex].product_id,
      isChecked
    }).then(data => {
      this.setData({
        cartList:data.cartList,
        cartTotal:data.cartTotal
      })
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
  },
  quantityControl(e) {
    let index = e.currentTarget.dataset.index
    let arrindex = e.currentTarget.dataset.arrindex
    let cartList = this.data.cartList
    if (index === 1) {
      this.refreshCart(arrindex,1);
    } else {
      if (cartList[arrindex].number > 1) {
        this.refreshCart(arrindex,-1);
      }
    }
  },
  refreshCart(arrindex,number) {
    let cartList = this.data.cartList
    _CartAdd({
      id: cartList[arrindex].id,
      goodsId: cartList[arrindex].goods_id,
      productId: cartList[arrindex].product_id,
      number
    }).then(data => {
      this.setData({
        cartList: data.cartList,
        cartTotal:data.cartTotal
      })
    }).catch(msg => {
      wx.showModal({
        title: msg
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