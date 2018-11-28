// pages/writeStory/writeStory.js
import { _PostsAdd} from '../../utils/request'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     titleText: '',
     contentText: '',
     isTop:true,
     imageList:[],
     upLoadHidden:true,
     upLoadFile: 'image',
     videoSrc: '',
     videoPoster: ''
  },

  onLoad: function (options) {
  },
  getTitleText(e) {
    if(e.detail.value===' ') {
      this.setData({
        titleText:''
      })
    }else {
      this.setData({
        titleText: e.detail.value
      })
    }
  },
  getContentText(e) {
    if (e.detail.value === ' ') {
      this.setData({
        contentText: ''
      })
    }else {
      this.setData({
        contentText: e.detail.value
      })
    }
  },
  changeIsTop(e) {
    this.setData({
      isTop: e.detail.value
    })
  },
  addImage() {
    this.setData({
      upLoadFile: 'image'
    })
    App.addImage(this.data.imageList.length).then(data => {
      let imageList = [...this.data.imageList,...data]
      this.setData({ 
        imageList,
        upLoadHidden: true
       });
       wx.hideLoading()
    })
  },
  upLoadVideo() {
    return new Promise((resolve,reject) => {
      wx.uploadFile({
        url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
        filePath: this.data.videoSrc,
        name: "file",
        success: res => {
          let data = JSON.parse(res.data)
          console.log(data)
          if (data.errno === 0) {
            console.log(123456)
           resolve(data.data)
          } else {
            reject(data.msg)
          }
        }
      })
    })
  },
  addVideo() {
    this.setData({
      upLoadFile: 'video'
    })
    wx.chooseVideo({
      success:(res) => {
        if (res.size > 20970000) {
          wx.showModal({
            title: '视频过大',
            content: '视频过大，请进行裁剪或上传其他视频'
          })
        }else {
          this.setData({ 
            videoSrc: res.tempFilePath,
            upLoadHidden: true
           });
        }
      }
    })
  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.index
    let arr = this.data.imageList
    arr.splice(index,1)
    this.setData({
      imageList: arr
    })
  },
  deleteVideo() {
    this.setData({
      videoSrc: '',
      videoPoster: ''
    })
  },
  navToWatchVideo() {
    wx.navigateTo({
      url:`../watchVideo/watchVideo?src=${this.data.videoSrc}`
    })
  },
  confirm() {
    if(this.data.titleText&&this.data.contentText) {
      wx.showLoading({
        title: '正在上传',
        mask: true
      })
      let isTop = this.data.isTop ? 0 : 2
      let obj = {
        title: this.data.titleText,
        isTop,
        content: this.data.contentText,
        videoCoverUrl: ''
      }
      if (this.data.upLoadFile === 'image') {
        obj.imagesList = []
        this.upLoadImg(obj)
      }else {
        if(this.data.videoSrc) {
          this.upLoadVideo().then(data => {
            obj.imagesList = [data]
            this.postsAdd(obj)
          })
        }else {
          obj.imagesList = []
          this.postsAdd(obj)
        }
      }
    }else {
      wx.showModal({
        title: '请填写完整内容',
        content: '请填写您要发布的内容或标题'
      })
    }
  },
  upLoadImg(obj) {
    this.data.imageList.forEach(item => {
      App.upLoadImg(item.path).then(data => {
        obj.imagesList.push(data)
        if (obj.imagesList.length === this.data.imageList.length) {
          this.postsAdd(obj)
        }
      }).catch(msg => wx.showModal({ title: msg }))
    })
  },
  postsAdd(data) {
    _PostsAdd(data)
      .then(() => {
        wx.hideLoading()
        wx.showToast({ title: "发布成功", mask: true });
        this.refreshPrevPage();
        wx.navigateBack({ delta: 1 });
      })
      .catch(data => App.catchError(data));
  },
  refreshPrevPage() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      page:1,
      list:[]
    })
    prevPage.getStoryList()
  },
  upLoadHiddenManage(e) {
    let index = e.currentTarget.dataset.index
    if(index === 1) {
      this.setData({
        upLoadHidden: true
      })
    }else  {
      this.setData({
        upLoadHidden: false
      })
    }
  },
  viewPic(e) {
    let index = e.currentTarget.dataset.index
    let imageList = []
    this.data.imageList.forEach(item => imageList.push(item.path))
    App.previewImg(index, imageList)
  },
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