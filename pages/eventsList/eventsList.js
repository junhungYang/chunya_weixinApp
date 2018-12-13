// pages/eventsList/eventsList.js
const App = getApp()
import { _ActivityList} from '../../utils/request'
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: ['',''],
    navActive: 0,
    scrollFlag:true
  },
  onLoad: function (options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    if(App.globalData.token) {
      this.data.list.forEach((item,index) => {
        this.getActivityList(1,index);
      })
    }
  },
  getActivityList(page,index,scroll) {
    wx.showLoading({
      title: '正在加载',
      mask:true
    })
    this.setData({scrollFlag:false})
    _ActivityList({
      page,
      type: index,
      size: 5
    }).then(data => {
      data.data = this.dataTranslate(data.data);
      let list = this.data.list
      if(scroll) {
        list[index].currentPage ++
        list[index].data = [...list[index].data,...data.data]
      }else {
        list[index] = data
      }
      this.setData({
        list,
        scrollFlag:true
      })
      App.hideLoadingInSwiper(this.data.list, "");
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
     return dataList
  },
  changePageIndex(e) {
    let type = e.currentTarget.dataset.type
    if(type === 'scroll') {
      this.setData({
        navActive: e.detail.current
      })
    }else {
      this.setData({
        navActive: e.currentTarget.dataset.index
      })
    }
  },
  scrollRefresh(e) {
    let fatherItem = e.currentTarget.dataset.fatheritem
    if(fatherItem.currentPage < fatherItem.totalPages) {
      this.getActivityList(fatherItem.currentPage+1, this.data.navActive, 'scroll')
    }else {
      App.theEndPage()
    }
  },
  navToDetail(e) {
    wx.navigateTo({
      url: `../eventsDetail/eventsDetail?activityId=${e.currentTarget.dataset.id}`
    })
  },

  watch: {
    token(newValue) {
      if(newValue) {
        that.data.list.forEach((item, index) => {
          that.getActivityList(1, index);
        })
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