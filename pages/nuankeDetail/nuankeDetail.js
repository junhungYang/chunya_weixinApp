// pages/nuankeDetail/nuankeDetail.js
const App = getApp()
import { _WarmclassDetail, _WarmclassPay} from '../../utils/request'
import {getVideoInfo,requestVideoUrls} from '../../utils/transVideoInfo'
var that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    contentDesc:'',
    isPay:null,
    videoId: null,
    poster: '',
    videoSrc: null,
    isFree: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    this.setData({ id: options.warmClassId});
    if (App.globalData.token) {
      this.getDetail()
    }
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getDetail()
      }
    }
  },
  getDetail() {
    _WarmclassDetail({
      id:this.data.id
    }).then(data => {
      wx.stopPullDownRefresh();
        this.initDom(data)
      }).catch(data => {
        if(data.errno === 1) {
          wx.showModal({
            title: '提示',
            content: data.errmsg,
            success: (res) => {
              if (res.confirm) {
                this.payControl()
              }else {
                wx.switchTab({
                  url: '../index/index'
                })
              }
            }
          })
        }else {
          App.catchError(data);
        }
      })
  },
  payControl() {
    _WarmclassPay({
      id: this.data.id
    }).then(data => {
      this.getDetail()
    }).catch(data => App.catchError(data))
  },
  initDom(data) {
    wx.setNavigationBarTitle({
      title: data.title
    })
    this.setData({
      contentDesc: data.contentDesc,
      isPay: data.isPay,
      videoId: data.videoId,
      isFree: data.isFree,
      poster: data.listCoverUrl
    });
    this.getVideo()
  },
  getVideo() {
    if(this.data.videoId) {
      getVideoInfo(this.data.videoId)
      .then(requestVideoUrls)
      .then(data => {
        this.setData({
          videoSrc: data
        })
      })
    }
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
    if (App.globalData.token) {
      this.getDetail()
    }
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
     wx.showShareMenu();
  }
})