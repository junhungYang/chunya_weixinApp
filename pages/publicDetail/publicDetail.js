// pages/publicDetail/publicDetail.js
import {
  _CommonwealDetail,
  _CommonwealDonation,
  _CommentList
} from "../../utils/request";
const App = getApp()
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contActive: false,
    priceState: true,
    hiddenName: false,
    activePrice: 1,
    data: {},
    price: 5,
    id: '',
    donorName: '',
    commonData: {}
  },
  onLoad: function(options) {  
    that = this
    App.setWatcher(App.globalData,this.watch)
    this.setData({ id: Number(options.commonwealId) });
    if (App.globalData.token) {
      this.getCommonwealDetail()
      this.getCommonList()
    }
  },
  navToReviews() {
    wx.navigateTo({
      url: `../publicReviewsList/publicReviewsList?id=${this.data.id}`
    })
  },
  getCommonList() {
    _CommentList({
      typeId: 2,
      valueId: this.data.id,
      showType: 0,
      size: 3
    }).then(data => {
      this.setData({
        commonData: data
      })
      }).catch(data => App.catchError(data))
  },
  getCommonwealDetail() {
    _CommonwealDetail({
      id: this.data.id
    })
    .then(data => {
      this.setData({
        data
      });
      }).catch(data => App.catchError(data))
  },
  contActiveManage() {
    this.setData({
      contActive: !this.data.contActive
    });
  },
  priceStateManage(e) {
    let index = e.currentTarget.dataset.index;
    if (index === 1) {
      this.setData({
        priceState: false
      });
    } else {
      this.setData({
        priceState: true
      });
    }
  },
  hiddenNameStateManage() {
    this.setData({
      hiddenName: !this.data.hiddenName
    });
  },
  changeActivePrice(e) {
    let index = e.currentTarget.dataset.index;
    let price = e.currentTarget.dataset.price;
    if (price) {
      this.setData({
        activePrice: index,
        price
      });
    } else {
      this.setData({
        activePrice: index
      });
    }
  },
  inputPrice(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setData({
        price: e.detail.value
      });
    }, 200);
  },
  inputFocus(e) {
    this.setData({
      price: e.detail.value
    })
  },
  donation() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let donorAmount = this.data.price;
      if (Number(donorAmount) && Number(donorAmount) >= 0.01) {
        if (!this.data.hiddenName && !this.data.donorName) {
          wx.showModal({ title: "请输入姓名" });
        } else {
          _CommonwealDonation({
            donorAmount,
            isAnonymous: this.data.hiddenName ? 1 : 0,
            commonwealId: this.data.data.id,
            donorName: this.data.hiddenName ? "匿名" : this.data.donorName
          }).then(data => {
            this.publicPay(data)
            }).catch(data => App.catchError(data))
        }
      }else {
        wx.showModal({
          title: '金额错误',
          content: '请输入正确金额',
          showCancel: false
        })
      }
    }, 250);
  },
  getDonorName(e) {
    if(e.detail.value === ' ') {
      this.setData({
        donorName:''
      })
    }else {
      this.setData({
        donorName: e.detail.value
      })
    }
  },
  publicPay(data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      appId: data.appId,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: (res) => {
        wx.showToast({
          title: "捐款成功"
        });
        this.setData({
          priceState: true
        })
        this.getCommonwealDetail()
        this.refreshPrevPage()
      }
    });
  },
  refreshPrevPage() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2];
    prevPage.getUserInfo()
    prevPage.getCommonList()
  },
  previewImg(e) {
    let picList = e.currentTarget.dataset.piclist;
    let index = e.currentTarget.dataset.index;
    let arr = [];
    picList.forEach(item => {
      arr.push(item.pic_url);
    });
    wx.previewImage({
      urls: arr,
      current: arr[index]
    });
  },
  showModal(msg) {
    wx.showModal({
      title: msg
    });
  },
  watch: {
    token(newValue) {
      if(newValue) {
        that.getCommonwealDetail()
        that.getCommonList()
      }
    }
  },

  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});