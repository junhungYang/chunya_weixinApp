// pages/eventsList/eventsList.js
const App = getApp()
import { _ActivityList} from '../../utils/request'
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageIndex: 1,
    navActive: 0,
    totalPages: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    if(App.globalData.token) {
      this.getActivityList()
    }
  },
  changeActive(e) {
    this.setData({
      navActive: e.currentTarget.dataset.index,
      page: 1,
      list: []
    })
    this.getActivityList()
  },
  getActivityList() {
    _ActivityList({
      page: this.data.pageIndex,
      type: this.data.navActive,
      size: 10
    }).then(data => {
      this.dataTranslate(data.data)
      this.setData({ totalPages:data.totalPages });
      wx.hideLoading()
      }).catch(data => App.catchError(data))
  },
  dataTranslate(dataList) {
    dataList.forEach(item => {
      let tagsArr = item.tags.split(',');
      item.tags = tagsArr
      let dateObj = new Date(item.activityStartTime)
      let year =  dateObj.getFullYear()
      let month = dateObj.getMonth() + 1
      let date = dateObj.getDate()
      let activityStartTime = `${year}.${month}.${date}`
      item.activityStartTime = activityStartTime;
    })
      let arr = [...this.data.list,...dataList]
      this.setData({
        list: arr
      })
  },
  navToDetail(e) {
    wx.navigateTo({
      url: `../eventsDetail/eventsDetail?activityId=${e.currentTarget.dataset.id}`
    })
  },
  onReachBottom: function () {
    if (this.data.pageIndex < this.data.totalPages) {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      wx.showLoading({
        title: '正在加载',
        mask: true
      })
      this.getActivityList();
    }else {
      App.theEndPage();
    }

  },

  watch: {
    token(newValue) {
      if(newValue) {
        that.getActivityList() 
      }
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})