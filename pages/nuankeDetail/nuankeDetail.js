// pages/nuankeDetail/nuankeDetail.js
const App = getApp()
import { _WarmclassDetail, _WarmclassPay} from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    contentDesc:'',
    isPay:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(App.globalData.token) {
      this.setData({
        id: Number(options.id)
      })
      this.getDetail()
    }
  },
  getDetail() {
    _WarmclassDetail({
      id:this.data.id
    }).then(data => {
      wx.setNavigationBarTitle({
        title: data.title
      })
      this.setData({
        contentDesc: data.contentDesc,
        isPay: data.isPay
      })
    })
  },
  nuankePay(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      _WarmclassPay({
        id: this.data.payId
      }).then(data => {
        this.wxPay(data)
      })
    }, 250);
  },
  wxPay(data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      appId: data.appId,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: (res) => {
        wx.showToast({
          title: "成功结算"
        });
        this.getDetail();
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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