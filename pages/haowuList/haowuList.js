// pages/haowuList/haowuList.js
import { _HaowuList, _GoodsList, _SendFormid } from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fatherList:[],
    page: 1,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHaowuList()
  },
  getHaowuList() {
    let length = this.data.fatherList.length
    _HaowuList({
      page: this.data.page,
      size: 2
    }).then(data => {
      this.setData({
        fatherList: [...this.data.fatherList, ...data.data]
      })
      data.data.forEach((item,index) => {
        this.changeChildPage(length + index,1)
      })
      setTimeout(() => {
        wx.hideLoading()
      }, 600);
    })
  },
  changeChildPage(targetIndex,page) {
    let fatherList = this.data.fatherList
    _GoodsList({
      page,
      categoryId: fatherList[targetIndex].id,
      size: 6
    }).then(childData => {
      fatherList[targetIndex].subCategoryList = childData;
      setTimeout(() => {
        wx.hideLoading()
      }, 500);
      this.setData({
        fatherList
      })
    })
  },
  changePageEnter(e) {
    let page = e.currentTarget.dataset.page
    let type = e.currentTarget.dataset.type
    let targetIndex = e.currentTarget.dataset.targetindex
    let fatherList = this.data.fatherList
    if(type === 'add') {
      if (fatherList[targetIndex].subCategoryList.data.length!==0) {
        this.changeChildPage(targetIndex, page += 1);
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }else {
        wx.showToast({
          title: "产品上新中，敬请期待",
          icon: "none",
          duration: 1000
        });
      }
    }else {
      if(page===1) {
        wx.showToast({
          title: '已经是第一页',
          icon: 'none',
          duration: 1000
        })
      }else {
        this.changeChildPage(targetIndex, page -= 1);
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
  },
  navToGoodDetail(e) {
      let goodId = e.currentTarget.dataset.goodid;
      wx.navigateTo({
        url: `../goodDetail/goodDetail?goodId=${goodId}`
      });
  },
  formSubmit_collect: function (e) {
    let fromid = `${e.detail.formId}`;
    let userInfoStorage = wx.getStorageSync('userInfo')
    if (fromid && userInfoStorage) {
      let openid = JSON.parse(userInfoStorage).openId
      _SendFormid({
        fromid,
        openid
      })
    }
  },
  onReachBottom: function () {
    this.setData({
      page: this.data.page +1
    })
    wx.showLoading({
      title: '正在加载'
    })
    this.getHaowuList()
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


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})