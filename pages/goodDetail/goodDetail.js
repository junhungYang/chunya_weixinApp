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
    collectState: "",
    collectText: "",
    productPrice: 0,
    quantity: 1,
    activeProduct: {},
    goodId:''
  },
  chooseProduct(e) {
    let obj = e.currentTarget.dataset.item;
    this.setData({
      activeProduct: obj,
      productPrice: obj.retail_price
    });
  },
  onLoad: function(options) {
    that = this;
    app.setWatcher(this.data, this.watch);
    this.setData({
      goodId: options.goodId
    })
    if(app.globalData.token) {
      console.log('有token')
      this.getGoodDetail()
    }else {
      console.log('无token')
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            console.log('之前已经进行过授权登录')
            let state = app.wxappLogin()
            console.log(`state的状态: ${state}`)
            if(state === 'loginOk') {
              console.log('getGoodDetail接口')
              this.getGoodDetail()
            }
          }else {
            wx.showModal({
              title:'登录失败',
              content: '请点击确认跳转至个人中心进行登录操作',
              success(res) {
                if(res.confirm === true) {
                  wx.navigateTo({
                    url:'../userCenter/userCenter'
                  })
                }
              }
            })
          }
        }
      });
    }
  },
  getGoodDetail() {
    _GoodsDetail({ id: this.data.goodId }).then(data => {
      this.setData({
        detail: data,
        productPrice: data.productList[0].retail_price,
        activeProduct: data.productList[0]
      }).catch(msg => {
        wx.showModal({
          title:msg
        })
      })
      this.collect();
    });
  },
  watch: {
    collectState(newValue) {
      if (newValue === "add") {
        that.setData({
          collectText: "已收藏"
        });
      } else {
        that.setData({
          collectText: "收藏"
        });
      }
    }
  },
  //数量操作
  quantityControl(e) {
    let index = e.currentTarget.dataset.index;
    let newQuantity = this.data.quantity;
    if (index === 1) {
      this.setData({
        quantity: newQuantity + 1
      });
    } else {
      if (newQuantity > 1) {
        this.setData({
          quantity: newQuantity - 1
        });
      }
    }
  },
  share() {
    wx.showShareMenu();
  },
  //购物车开关回调
  cartStateManage(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let index = e.currentTarget.dataset.index;
      if (index === 1) {
        this.setData({
          cartShowFlag: false
        });
      } else {
        this.setData({
          cartShowFlag: true
        });
      }
    }, 400);
  },
  //点击收藏
  collect() {
    _CollectAddorDelete({
      typeId: 0,
      valueId: this.data.detail.info.id
    }).then(data => {
      this.setData({
        collectState: data.type
      });
    });
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
      goodsId: this.data.activeProduct.goods_id,
      productId: this.data.activeProduct.id,
      number: this.data.quantity
    };
    _CartAdd(buyingInfo)
      .then(data => {
        wx.showToast({
          title: "添加成功",
          icon: "success"
        });
        setTimeout(() => {
          wx.switchTab({
            url: "../cart/cart"
          });
        }, 1500);
      })
      .catch(msg => {
        wx.showModal({
          title: msg
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
  },
  onShareAppMessage: function() {
    wx.showShareMenu();
  }
});