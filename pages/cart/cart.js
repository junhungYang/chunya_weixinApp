// pages/cart/cart.js
import { 
    _CartIndex,
     _CartDelete, 
     _OrderCheckout, 
     _OrderSubmit,
      _OrderList, 
      _WeChatPay,
     _CartAdd,
    _CartChecked,
  _SetToken,
  _GetSensitiveInfo,
  _WxappLogin} from '../../utils/request'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: "junxing",
    cartList: [],
    couponInfoList: [],
    cartTotal: {},
    allChoose: false,
    canIUse: false
  },
  onLoad() {
    this.setData({
      canIUse: app.globalData.canIUseFlag
    });
  },
  onShow: function(options) {
    this.getCartList()
  },
  getCartList() {
    _CartIndex()
      .then(data => {
        this.setData({
          cartList: data.cartList,
          cartTotal: data.cartTotal
        });
      })
      .catch(msg => {
        wx.showModal({ title: msg });
      });
  },
  //全选
  allChoose() {
    this.setData({
      allChoose: !this.data.allChoose
    });
    let arr = [];
    this.data.cartList.forEach(item => {
      arr.push(item.product_id);
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
  goodsDelete(e) {
    _CartDelete({
      productIds: e.currentTarget.dataset.prodid
    }).then(data => {
      this.setData({
        cartList: data.cartList
      });
    });
  },
  buyConfirm() {
    if (this.data.cartTotal.checkedGoodsAmount !== 0) {
      _OrderCheckout().then(data => {
        let dataStr = JSON.stringify(data);
        wx.navigateTo({
          url: `../beforeBalance/beforeBalance?dataStr=${dataStr}`
        });
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
    console.log(res);
    if (res.detail.userInfo) {
      //用户点击了授权
      this.getSensitiveInfo();
    } else {
      //用户点击了取消
      wx.showModal({
        title: "警告通知",
        content:
          "您点击了拒绝授权,将无法正常显示个人信息,请从新点击授权按钮获取授权。"
      });
    }
  },
  getSensitiveInfo() {
    wx.getSetting({
      success: res => {
        if (res.authSetting["scope.userInfo"]) {
          let sessionKey = wx.getStorageSync("sessionKey");
          wx.getUserInfo({
            success: res => {
              _GetSensitiveInfo({
                sessionKey,
                encryptedData: res.encryptedData,
                ivStr: res.iv
              })
                .then(data => {
                  console.log(1111);
                  wx.setStorageSync("userInfo", data);
                  this.wxappLogin();
                })
                .catch(msg => {
                  wx.showModal({
                    title: msg
                  });
                });
            }
          });
        }
      }
    });
  },
  wxappLogin() {
    let userInfoJson = wx.getStorageSync("userInfo");
    let phoneNum = wx.getStorageSync("userPhoneNum");
    if (userInfoJson) {
      let userInfo = JSON.parse(userInfoJson);
      _WxappLogin({
        openid: userInfo.openId,
        gender: userInfo.gender,
        avatarUrl: userInfo.avatarUrl,
        nickName: userInfo.nickName,
        mobile: phoneNum ? phoneNum : ""
      })
        .then(data => {
          app.globalData.userInfo = data.userInfo;
          _SetToken(data.token);
          app.globalData.token = data.token;
          this.setData({
            canIUse: true
          });
          app.globalData.canIUseFlag = true;
          this.getCartList()
        })
        .catch(msg => {
          wx.showModal();
        });
    } else {
      app.wxLoginApi();
    }
  }
});