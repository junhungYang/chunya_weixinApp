// pages/writeStory/writeStory.js
import { _PostsAdd} from '../../utils/request'
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
     videoInfo: {

     }
  },

  onLoad: function (options) {

  },
  getTitleText(e) {
      this.setData({
        titleText: e.detail.value
      })
  },
  getContentText(e) {
      this.setData({
        contentText: e.detail.value
      })
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
    wx.chooseImage({
      sizeType: 'compressed',
      success: res => {
        console.log(res)
        this.setData({
          videoInfo: {}
        })
        res.tempFiles.forEach((item,index) => {
          if (item.size > 5000000) {
            wx.showModal({
              title: '图片过大',
              content: '个别图片过大，请重新选择'
            })
            res.tempFilePaths.splice(index,1)
          }
        })
        let arr = [...this.data.imageList, ...res.tempFilePaths];
        if(arr.length > 9) {
          arr.splice(9)
        }
        this.setData({
          imageList: arr
        })
      }
    })
  },
  addVideo() {
    this.setData({
      upLoadFile: 'video'
    })
    wx.chooseVideo({
      success:(res) => {
        console.log(res);
        if (res.size > 20970000) {
          wx.showModal({
            title: '视频过大',
            content: '视频过大，请进行裁剪或上传其他视频'
          })
        }else {
          this.setData({
            imageList:[]
          })
          let videoInfo = {
            src: res.tempFilePath,
            poster: res.thumbTempFilePath
          }
          this.setData({
            videoInfo
          })
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
      videoInfo: {}
    })
  },
  postsAdd() {
    if(this.data.titleText&&this.data.contentText) {
      let obj = {
        title: this.data.titleText,
        isTop: this.data.isTop,
        content: this.data.contentText,
      }
      if (this.data.upLoadFile === 'image') {
        obj.imagesList = this.data.imageList
      }else {
        if(this.data.videoInfo.src) {
          obj.imagesList = [this.data.videoInfo.src]
        }else {
          obj.imagesList = []
        }
      }
      _PostsAdd(obj).then(data => {
        wx.showToast({
          title: '发布成功'
        })
      }).catch(msg => {
        wx.showModal({
          title: msg
        })
      })
    }else {
      wx.showModal({
        title: '请填写完整内容',
        content: '请填写您要发布的内容或标题'
      })
    }
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
    let arr = [];
    this.data.imageList.forEach(item => {
      arr.push(item.path)
    })
    wx.previewImage({
      current: arr[index],
      urls: arr
    })
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