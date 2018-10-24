// pages/cart/cart.js
import { 
    _CartIndex,
     _CartDelete, 
     _CartAdd,
    _CartChecked,
  _SendFormid} from '../../utils/request'
const app = getApp();
var that;
Page({
  data: {
    name: "junxing",
    cartList: [],
    couponInfoList: [],
    cartTotal: {},
    allChoose: false,
    hasToken: false,
  },
  onLoad() {
    that = this;
    app.setWatcher(app.globalData, this.watch);
  },
  onShow: function(options) {
    if (app.globalData.token) {
      this.setData({
        hasToken: true
      });
      this.getCartList();
    }
  },
  watch: {
    token(newValue) {
      if (newValue) {
        that.setData({
          hasToken: true
        });
        that.getCartList();
      }
    }
  },
  getCartList() {
    _CartIndex()
      .then(data => {
        this.setData({
          cartList: data.cartList,
          cartTotal: data.cartTotal
        });
        this.checkAllChoose()
      })
      .catch(msg => {
        wx.showModal({ title: msg });
      });
  },
  formSubmit_collect: function(e) {
    let fromid = `${e.detail.formId}`;
    let userInfoStorage = wx.getStorageSync("userInfo");
    if (fromid && userInfoStorage) {
      let openid = JSON.parse(userInfoStorage).openId;
      _SendFormid({
        fromid,
        openid
      });
    }
  },
  checkAllChoose() {
    let cartTotal = this.data.cartTotal
    if (cartTotal.checkedGoodsCount === cartTotal.goodsCount) {
      this.setData({
        allChoose: true
      })
    } else {
      this.setData({
        allChoose: false
      })
    }
  },
  //全选
  allChoose() {
      this.setData({
        allChoose: !this.data.allChoose
      });
      let arr = [];
      this.data.cartList.forEach(item => {
        if (item.product_status) {
          arr.push(item.product_id);
        }
      });
      let productIds = arr.toString();
      let isChecked;
      this.data.allChoose === true ? (isChecked = 1) : (isChecked = 0);
      this.cartChecked(productIds, isChecked);
  },
  //单选
  choose(e) {
      let isChecked = e.currentTarget.dataset.state === 1 ? 0 : 1;
      let arrindex = e.currentTarget.dataset.arrindex;
      let productIds = this.data.cartList[arrindex].product_id;
      this.cartChecked(productIds, isChecked);  
  },
  cartChecked(productIds, isChecked) {
    _CartChecked({
      productIds,
      isChecked
    })
      .then(data => {
        this.setData({
          cartList: data.cartList,
          cartTotal: data.cartTotal
        });
        this.checkAllChoose()
      })
      .catch(msg => {
        wx.showModal({
          title: msg
        });
      });
  },
  quantityControl(e) {
    let index = e.currentTarget.dataset.index;
    let arrindex = e.currentTarget.dataset.arrindex;
    let cartList = this.data.cartList;
    if (index === 1) {
      this.refreshCart(arrindex, 1);
    } else {
      if (cartList[arrindex].number > 1) {
        this.refreshCart(arrindex, -1);
      }
    }
  },
  refreshCart(arrindex, number) {
    let cartList = this.data.cartList;
    _CartAdd({
      id: cartList[arrindex].id,
      goodsId: cartList[arrindex].goods_id,
      productId: cartList[arrindex].product_id,
      number
    })
      .then(data => {
        this.setData({
          cartList: data.cartList,
          cartTotal: data.cartTotal
        });
      })
      .catch(msg => {
        wx.showModal({
          title: msg
        });
      });
  },
  buyConfirm() {
    if (this.data.cartTotal.checkedGoodsAmount !== 0) {
      wx.navigateTo({
        url: `../beforeBalance/beforeBalance`
      });
    } else {
      wx.showToast({
        icon: "none",
        title: "请先选择商品",
        duration: 1000
      });
    }
  },
  bindGetUserInfo(res) {
    if (res.detail.userInfo) {
      //用户点击了授权
      app.getSensitiveInfo();
    } else {
      //用户点击了取消
      wx.showModal({
        title: "警告通知",
        content:
          "您点击了拒绝授权,将无法正常显示个人信息,请从新点击授权按钮获取授权。"
      });
    }
  },
  onPullDownRefresh: function() {
    wx.showLoading({
      title: "正在刷新"
    });
    if (app.globalData.token) {
      _CartIndex()
        .then(data => {
          this.setData({
            cartList: data.cartList,
            cartTotal: data.cartTotal
          });
          wx.stopPullDownRefresh();
          setTimeout(() => {
            wx.hideLoading();
          }, 600);
        })
        .catch(msg => {
          wx.showModal({ title: msg });
        });
    }
  },
  goodsDelete() {
    let arr = []
    this.data.cartList.forEach(item => {
      if (item.checked === 1 || item.product_status === 0) {
        arr.push(item.product_id)
      }
    })
    if(arr.length > 0) {
      let productIds = arr.toString();
      _CartDelete({
        productIds
      }).then(data => {
        this.setData({
          cartList: data.cartList,
          cartTotal: data.cartTotal
        })
      })
    }
  },
  pullOff() {

  }
});