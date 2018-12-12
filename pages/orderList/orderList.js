// pages/orderList/orderList.js
import {
  _OrderList,
  _WeChatPay,
  _SendFormid,
  _CartAdd,
  _OrderConfirmOrder,
  _OrderCancelOrder,
  _OrderDeleteOrder,
  _TakeDelay
} from "../../utils/request";
const App = getApp();
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderList: ["", "", "", "", ""],
    navActive: 0,
    pageIndex: 1,
    totalPages: 0
  },
  onLoad: function(options) {
    that = this;
    App.setWatcher(App.globalData, this.watch);
    if (options.index) {
      this.setData({
        navActive: Number(options.index)
      });
    }
    this.data.orderList.forEach((item, index) => {
      this.getOrderList(1, index);
    });
  },
  getOrderList(page,index,scroll) {
    wx.showLoading({
      title: "正在加载",
      mask: true
    });
    let orderStatus;
    switch (index) {
      case 1:
        orderStatus = 0
        break;
      case 2:
        orderStatus = 201
        break;
      case 3: 
        orderStatus = 300
        break;
      case 4:
        orderStatus = 301
        break;
    }
    let obj = { page, size: 10 };
    index !== 0 ? obj.orderStatus = orderStatus : ''
    _OrderList(obj)
      .then(data => {
        let orderList = this.data.orderList
        if(scroll) {
          orderList[index].currentPage ++
          orderList[index].data = [...orderList[index].data,...data.data]
        }else {
          orderList[index] = data
        }
        this.setData({ orderList })
        setTimeout(() => {
          wx.hideLoading();
        }, 600);
      })
      .catch(data => App.catchError(data));
  },
  changeActiveByScroll(e) {
    this.setData({
      navActive: e.detail.current
    })
  },
  changeActiveByClick(e) {
    this.setData({
      navActive: e.currentTarget.dataset.navactive
    })
  },
  watch: {
    token(nV) {
      if (nV) {
        that.getOrderList();
      }
    }
  },
  refreshListByScroll(e) {
    let fatherItem = e.currentTarget.dataset.item
    let fatherIndex = e.currentTarget.dataset.index
    if(fatherItem.currentPage < fatherItem.totalPages) {
      this.getOrderList(fatherItem.currentPage + 1, fatherIndex,'scroll')
    }else {
      App.theEndPage()
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
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

  orderControl(e) {
    let orderId = e.currentTarget.dataset.orderid;
    let controlStyle = e.currentTarget.dataset.str;
    let promiseObj = App.orderControl(orderId, controlStyle, "list");
    if (promiseObj) {
      promiseObj
        .then(data => {
          wx.showToast({ icon: "success", title: data, duration: 1000 });
          this.data.orderList.forEach((item,index) => {
            this.getOrderList(1,index);
          })
        })
        .catch(data => App.catchError(data));
    }
  },
  navToOrderDetail(e) {
    let orderId = e.currentTarget.dataset.item.id;
    wx.navigateTo({
      url: `../orderDetail/orderDetail?orderId=${orderId}`
    });
  },
  navToShippingList(e) {
    let orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: `../shippingList/shippingList?orderId=${orderId}`
    });
  },
  pay(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let orderId = e.currentTarget.dataset.id;
      _WeChatPay({ orderId })
        .then(data => {
          wx.requestPayment({
            timeStamp: data.timeStamp,
            appId: data.appId,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: res => {
              wx.showToast({
                title: "成功结算"
              });
              this.data.orderList.forEach((item,index) => {
                this.getOrderList(1,index)
              });
            }
          });
        })
        .catch(data => App.catchError(data));
    }, 500);
  },
  buyAgain(e) {
    App.buyAgain(e);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});