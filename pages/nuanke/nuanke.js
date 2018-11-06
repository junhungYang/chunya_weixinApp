// pages/nuanke/nuanke.js
import {
  _WarmclassList,
  _WarmclassPay,
  _CollectAddorDelete
} from "../../utils/request";
const App = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 1,
    meiWenList:[],
    visualList:[],
    radioList:[],
    payBtnHidden: true,
    payId: ''
  },
  onLoad: function () {
    if(App.globalData.token) {
      this.getList()
    }
  },
  getList() {
    let size= 10
    _WarmclassList({
      type: 1,
      size
    }).then(data => {
      this.setData({
        meiWenList: data.data
      })
    }).catch(msg => this.showModal(msg))
    _WarmclassList({
      type: 2,
      size
    }).then(data => {
      this.setData({
        visualList: data.data
      })
    }).catch(msg => this.showModal(msg))
    _WarmclassList({
      type: 3,
      size
    }).then(data =>  {
      this.setData({
        radioList: data.data
      })
    }).catch(msg => this.showModal(msg))
  },
  navToDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../nuankeDetail/nuankeDetail?id=${id}`
    });
  },
  changeNav(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      navIndex: index
    })
  },
  showPayBtn(e) {
    let isPay = e.currentTarget.dataset.ispay
    this.setData({
      payId: e.currentTarget.dataset.id
    })
    if(isPay) {
      wx.navigateTo({
        url: `../nuankeDetail/nuankeDetail?id=${this.data.payId}`
      });
    }else {
      this.setData({
        payBtnHidden: false,
      });
    }
  },
  hiddenPayBtn() {
    this.setData({
      payBtnHidden: true
    })
  },
  collect(e) {
    let valueId = e.currentTarget.dataset.id;
    _CollectAddorDelete({
      typeId: 1,
      valueId
    }).catch(msg => this.showModal(msg))
  },
  nuankePay(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      _WarmclassPay({
        id: this.data.payId
      }).then(data => {
        this.wxPay(data)
      }).catch(msg => this.showModal(msg))
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
        setTimeout(() => {
          wx.navigateTo({
            url: `../nuankeDetail/nuankeDetail?id=${this.data.payId}`
          });
        }, 500);
      }
    });
  },
  showModal(msg) {
    wx.showModal({
      title: msg
    })
  },
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