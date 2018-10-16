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
    buyingInfo: {
      goodsId: "",
      productId: "",
      number: ""
    }
  },

  onLoad: function(options) {
    that = this;
    app.setWatcher(this.data,this.watch)
    _GoodsDetail({ id: options.goodId }).then(data => {
      this.setData({
        detail: data
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
  switchToIndex() {
    wx.switchTab({
      url: "../index/index"
    });
  },
  reToIndex() {
    console.log(222);
    wx.navigateBack({
      url: "../index/index"
    });
  },
  navToCart() {
    console.log(111);
    wx.navigateTo({
      url: "../cart/cart"
    });
  },
  cartAdd(e) {
    let buyingInfo = {
      goodsId: e.currentTarget.dataset.goodsid,
      productId: e.currentTarget.dataset.prodid,
      number: 1
    };
    this.setData({
      buyingInfo: buyingInfo
    });
    _CartAdd(this.data.buyingInfo).then(data => {
      wx.showToast({
        title: "添加成功",
        icon: "success"
      });
    });
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