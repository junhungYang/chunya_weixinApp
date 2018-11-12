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
    console.log(e.detail.value)
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
        this.setData({
          videoSrc: ''
        })
        res.tempFiles.forEach((item,index) => {
          if (item.size > 5000000) {
            wx.showModal({
              title: '图片过大',
              content: '个别图片过大，请重新选择'
            })
          }else {
            this.upLoadImg(res.tempFiles, index);
          }
        })
      }
    })
  },
  upLoadVideo(videoSrc,videoPoster) {
    console.log(videoPoster)
    wx.showLoading({
      title: '正在上传',
      // mask: true
    })
    let promiseObj = new Promise((resolve,reject) => {
      wx.uploadFile({
        url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
        filePath: videoSrc,
        name: "file",
        success: res => {
          let data = JSON.parse(res.data)
          if (data.errno === 0) {
            this.setData({
              videoSrc: data.data,
            })
            resolve()
          } else {
            wx.showModal({ title: data.msg })
            reject()
          }
        }
      });
    }).then(() => {
      //  wx.uploadFile({
      //   url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
      //   filePath: videoPoster,
      //   name: "file",
      //   success: res => {
      //     console.log(res)
      //     let data = JSON.parse(res.data)
      //     if (data.errno === 0) {
      //       this.setData({
      //         videoPoster: data.data,
      //         upLoadHidden: true
      //       })
      //       wx.hideLoading()
      //     } else {
      //       wx.showModal({ title: data.msg })
      //     }
      //   }
      // });
    })


  },
  upLoadImg(list,index) {
    let path = list[index].path
    wx.showLoading({
      title: '正在上传',
      mask: true
    })
    wx.uploadFile({
      url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
      filePath: path,
      name: "file",
      success: res => {
        let data = JSON.parse(res.data);
        if(data.errno === 0) {
          wx.hideLoading()
          let arr = [...this.data.imageList,data.data]
          if(arr.length > 9) {
            arr.splice(9)
          }
          this.setData({
            imageList: arr,
            upLoadHidden: true
          })
        }else {
          wx.showModal({
            title: data.msg
          })
        }
      }
    });
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
          console.log(res);
          this.upLoadVideo(res.tempFilePath, res.thumbTempFilePath);
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
  postsAdd() {
    if(this.data.titleText&&this.data.contentText) {
      let isTop = this.data.isTop ? 0 : 2
      let obj = {
        title: this.data.titleText,
        isTop,
        content: this.data.contentText,
        videoCoverUrl: ''
      }
      if (this.data.upLoadFile === 'image') {
        obj.imagesList = this.data.imageList
      }else {
        if(this.data.videoSrc) {
          obj.imagesList = [this.data.videoSrc]
          obj.videoCoverUrl = this.data.videoPoster
        }else {
          obj.imagesList = []
        }
      }
      _PostsAdd(obj).then(data => {
        wx.showToast({
          title: '发布成功',
          mask: true
        })
          this.refreshPrevPage()
          wx.navigateBack({
            delta: 1
          });
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
    console.log(11111)
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
      arr.push(item)
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