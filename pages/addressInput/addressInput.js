// pages/addressInput/addressInput.js
const app = getApp()
import {
  _PositionDetail,
  _GetSensitiveInfo,
  _PositionSave
} from "../../utils/request";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    addressText: "选择 省/市/区"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id !== 'undefined') {
      let id = options.id;
      _PositionDetail({
        id
      }).then(data => {
          this.setData({
            detail: data
          });
        }).catch(msg => {
          wx.showModal({
            title: msg
          });
        });
    }
  },
  getPhoneNumber(e) {
    let sessionKey = wx.getStorageSync("sessionKey");
    _GetSensitiveInfo({
      sessionKey,
      encryptedData: e.detail.encryptedData,
      ivStr: e.detail.iv
    })
      .then(data => {
        let dataObj = JSON.parse(data);
        let detail = this.data.detail;
        detail.telNumber = dataObj.phoneNumber;
        this.setData({
          detail
        });
        wx.setStorageSync("userPhoneNum", dataObj.phoneNumber);
        app.wxappLogin();
      })
      .catch(msg => {
        wx.showModal({
          title: msg
        });
      });
  },
  chooseAddress() {
    wx.chooseAddress({
      success:(res) => {
          res.id = this.data.detail.id
          res.is_default = this.data.detail.is_default
        this.setData({
          detail: res,
          addressText: `${res.provinceName}${res.cityName}${res.countyName}`
        });
      }
    });
  },
  inputControl(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let index = e.currentTarget.dataset.index
        let detail = this.data.detail
        switch (index) {
          case 1:
            detail.userName = e.detail.value
            break;
          case 2:
            detail.telNumber = e.detail.value
            break;
          case 3:
            detail.detailInfo = e.detail.value
        }
        this.setData({ detail })
      }, 300);
  },
  saveAddress() {
    let detail = this.data.detail
    let obj = {
      userName: detail.userName,
      provinceName: detail.provinceName,
      cityName: detail.cityName,
      countyName: detail.countyName,
      detailInfo: detail.detailInfo,
      telNumber: detail.telNumber,
      is_default:true
    }
    if(detail.id) {
      obj.id = detail.id
    }
    _PositionSave(obj).then(() => {
      wx.showToast({
        title:'保存成功',
        icon:'success'
      })
      let pages = getCurrentPages()
      let prevPage = pages[pages.length - 2];
      prevPage.getPositionList()
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1500);
    });
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