// pages/goodDetail/goodDetail.js
const app = getApp();
var that;
import {
  _GoodsDetail,
  _CartAdd,
  _OrderCheckout,
  _CollectAddorDelete
} from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    htmlStr: "",
    cartShowFlag: true,
    collectState:"",
    collectText: "",
    allPrice:0,
    quantity:1
  },

  onLoad: function(options) {
    that = this;
    app.setWatcher(this.data,this.watch)
    _GoodsDetail({ id: options.goodId }).then(data => {
      this.setData({
        detail: data,
        allPrice: data.info.retail_price
      });
      this.collect()
    });
  },
  watch: {
    collectState(newValue) {
      if(newValue === "add") {
        that.setData({
          collectText: "已收藏"
        })
      }else {
        that.setData({
          collectText: "收藏"
        })
      }
    },
    quantity(newValue) {
      let allPrice = newValue * that.data.detail.info.retail_price
      that.setData({
        allPrice
      })
    }
  },
  //数量操作
  quantityControl(e) {
    let index = e.currentTarget.dataset.index
    let newQuantity = this.data.quantity
    if(index === 1) {
      this.setData({
        quantity: newQuantity +1
      })
    }else {
      if(newQuantity > 1) {
        this.setData({
          quantity: newQuantity - 1
        })
      }
    }
  },
  //购物车开关回调
  cartStateManage(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let index = e.currentTarget.dataset.index
      if (index === 1) {
        this.setData({
          cartShowFlag: false
        });
      }else  {
        this.setData({
          cartShowFlag: true
        });
      }
    }, 400);
  },
  //点击收藏
  collect() {
    _CollectAddorDelete({
      typeId:0,
      valueId:this.data.detail.info.id
    }).then(data => {
      this.setData({
        collectState: data.type
      })
    })
  },
  //跳转至首页
  navToIndex() {
    wx.navigateBack({
      url: "../index/index"
    });
  },
  switchToCart() {
    wx.switchTab({
      url: "../cart/cart"
    });
  },
  cartAdd() {
    let buyingInfo = {
      goodsId: this.data.detail.productList[0].goods_id,
      productId: this.data.detail.productList[0].id,
      number: this.data.quantity
    };
    _CartAdd(buyingInfo).then(data => {
      wx.showToast({
        title: "添加成功",
        icon: "success"
      })
      setTimeout(() => {
        wx.switchTab({
          url: "../cart/cart"
        });
      }, 1500);
    }).catch(msg => 　{
      wx.showModal({
        title: msg
      })
    });;
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  orderCheckout() {
    _OrderCheckout().then(data => {
      let addressId = data.checkedAddress.id;
      if (data.checkedAddress) {
        let dataStr = JSON.stringify(data);
        wx.navigateTo({
          url: `../orderDetail/orderDetail?dataStr=${dataStr}`
        });
      } else {
        wx.showModal({
          title: "请添加地址",
          success() {
            wx.redirectTo({
              url: "../userCenter/userCenter"
            });
          }
        });
      }
    });
  }
});