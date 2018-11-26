// pages/goodDetail/goodDetail.js
const App = getApp();
var that;
import {
  _GoodsDetail,
  _CartAdd,
  _OrderCheckout,
  _CollectAddorDelete,
  _GoodCommentList,
  _SendFormid,
  _CouponForGood,
  _CouponAdd
} from "../../utils/request";
Page({
  data: {
    detail: {},
    htmlStr: "",
    cartShowFlag: true,
    userHasCollect: 0,
    quantity: 1,
    activeProduct: {},
    goodId: "",
    reviews: [],
    domPosTop: {},
    navActive: 1,
    couponHidState: true,
    serviceHidState: true,
    from: "",
    couponList: [],
    couponPage: 1,
    couponTotal: 0
  },
  onLoad: function(options) {
    that = this;
    App.setWatcher(App.globalData, this.watch);
    this.setData({
      goodId: options.goodId,
      from: options.from ? options.from : ""
    });
    if (App.globalData.token) {
      this.getGoodDetail();
      this.getReviews();
      this.getCouponList();
    }
  },
  watch: {
    token(newValue) {
      if (newValue) {
        that.getGoodDetail();
        that.getReviews();
        that.getCouponList();
      }
    }
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
  getCouponList() {
    _CouponForGood({
      goodsId: this.data.goodId,
      page: this.data.couponPage,
      size: 6
    }).then(data => {
      let arr = [...this.data.couponList,...data.data]
      this.setData({
        couponList: arr,
        couponTotal: data.totalPages
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 400);
      }).catch(data => App.catchError(data))

  },
  addCoupon(e) {
    let state = e.currentTarget.dataset.state
    if(state) {
      wx.showModal({
        title: '优惠券提示',
        content: '该优惠券已经领取过'
      })
    }else {
      let couponId = e.currentTarget.dataset.id
      let index= e.currentTarget.dataset.index
      _CouponAdd({
        couponId
      }).then(data => {
        wx.showToast({
          title: '成功领取',
          icon: 'success'
        })
        let arr = this.data.couponList
        arr[index].isReceive = 1
        this.setData({
          couponList: arr
        })
        }).catch(data => App.catchError(data))
    }
  },
  scrollGetCoupon() {
    if(this.data.couponPage < this.data.couponTotal) {
      this.setData({
        couponPage: this.data.couponPage + 1
      })
      wx.showLoading({
        title: '正在加载'
      })
      this.getCouponList()
    }else {
      App.theEndPage()
    }
  },
  couponStateManage(e) {
    let index = e.currentTarget.dataset.index;
    if (index) {
      this.setData({ couponHidState: true });
    } else {
      this.setData({ couponHidState: false });
    }
  },
  serviceStateManage(e) {
    let index = e.currentTarget.dataset.index;
    if (index) {
      this.setData({ serviceHidState: true });
    } else {
      this.setData({ serviceHidState: false });
    }
  },
  chooseProduct(e) {
    let obj = e.currentTarget.dataset.item;
    this.setData({
      activeProduct: obj,
      productPrice: obj.retail_price,
      quantity: 1
    });
  },
  getDomPosTop() {
    let query = wx.createSelectorQuery();
    query.select("#reviews").boundingClientRect();
    query.select("#good-detail").boundingClientRect();

    let obj = {};
    obj.allTop = 0;
    query.exec(function(res) {
      obj.reviewsTop = res[0].top - 44;
      obj.detailTop = res[1].top - 44;
    });
    this.setData({
      domPosTop: obj
    });
  },
  scrollToDom(e) {
    let index = e.currentTarget.dataset.index;
    let domPosTop = this.data.domPosTop;
    this.setData({
      navActive: index
    });
    switch (index) {
      case 1:
        wx.pageScrollTo({
          scrollTop: 0
        });
        break;
      case 2:
        wx.pageScrollTo({
          scrollTop: domPosTop.detailTop
        });
        break;
      case 3:
        wx.pageScrollTo({
          scrollTop: domPosTop.reviewsTop
        });
        break;
    }
  },
  getReviews() {
    _GoodCommentList({ goodId: this.data.goodId, size: 5, page: 1 })
      .then(data => {
        this.setData({ reviews: data });
        this.getDomPosTop();
      })
      .catch(data => App.catchError(data));
  },
  getGoodDetail() {
    _GoodsDetail({ id: this.data.goodId })
      .then(data => {
        this.setData({
          detail: data,
          userHasCollect: data.userHasCollect,
          activeProduct: data.productList[0]
        });
        this.getDomPosTop();
      })
      .catch(data => App.catchError(data));
  },
  previewImg(e) {
    let picList = e.currentTarget.dataset.piclist;
    let index = e.currentTarget.dataset.index;
    let arr = [];
    picList.forEach(item => {
      arr.push(item.picUrl);
    });
    wx.previewImage({
      urls: arr,
      current: arr[index]
    });
  },
  navToReviewsList(e) {
    wx.navigateTo({
      url: `../reviewsList/reviewsList?goodId=${this.data.goodId}`
    });
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
      if(data.type === 'delete') {
        this.setData({
          userHasCollect: 0
        });
      }else {
        this.setData({
          userHasCollect: 1
        });
      }
      if (this.data.from === "collect") {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
          page: 1,
          list: []
        });
        prevPage.getMyCollect();
      }
      }).catch(data => App.catchError(data))
  },
  //跳转至首页
  navToIndex() {
    wx.switchTab({
      url: "../index/index"
    });
  },
  switchToCart() {
    wx.switchTab({
      url: "../cart/cart"
    });
  },
  cartAdd() {
    if (this.data.activeProduct.is_on_sale) {
      let buyingInfo = {
        goodsId: this.data.activeProduct.goods_id,
        productId: this.data.activeProduct.id,
        number: this.data.quantity
      };
      _CartAdd(buyingInfo)
        .then(data => {
          wx.showToast({ title: "添加成功", icon: "success" });
          setTimeout(() => {
            wx.switchTab({ url: "../cart/cart" });
          }, 1500);
        })
        .catch(data => App.catchError(data));
    } else {
      wx.showModal({
        title: "提示",
        content: "该商品已下架",
        showCancel: false,
        confirmColor: "#b2b2b2"
      });
    }
  },
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData({
      navActive: 1
    });
  },
  onPageScroll(res) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let domPosTop = this.data.domPosTop;
      let navActive;
      if (res.scrollTop < domPosTop.reviewsTop) {
        navActive = 1
      } else if (
        res.scrollTop >= domPosTop.reviewsTop &&
        res.scrollTop < domPosTop.detailTop
      ) {
        navActive = 3
      } else if (res.scrollTop >= domPosTop.detailTop) {
        navActive = 2
      }
      this.setData({
        navActive,
        cartShowFlag: true,
        couponHidState: true,
        serviceHidState: true
      });
    }, 500);
  },
  onShareAppMessage: function() {
    wx.showShareMenu();
  }
});