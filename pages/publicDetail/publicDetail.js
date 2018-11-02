// pages/publicDetail/publicDetail.js
import { 
  _CommonwealDetail,
  _CommonwealDonation
} from '../../utils/request'
const app = getApp()
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
    price: 0,
    isAnonymous: true,
    donorName: ''
  },
  onLoad: function(options) {
    let id = Number(options.id);
    if (app.globalData.token) {
      _CommonwealDetail({
        id
      })
        .then(data => {
          this.setData({
            data
          });
        })
        .catch(msg => {
          this.showModal(msg);
        });
    }
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
    console.log(this.data.hiddenName)
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
  donation() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let donorAmount = this.data.price;
      if (Number(donorAmount) && Number(donorAmount) > 0) {
        _CommonwealDonation({
          donorAmount,
          commonwealId: this.data.data.id,
          donorName: "junxing"
        });
      }else {
  
      }
    }, 250);
  },
  showModal(msg) {
    wx.showModal({
      title: msg
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
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