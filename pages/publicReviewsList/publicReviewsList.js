// pages/reviewsList/reviewsList.js
import { 
  _CommentList,
  _CommentPost
 } from "../../utils/request";
 const App = getApp()
 var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reviewsList: [],
    pageIndex: 1,
    totalPages: 0,
    id: 0,
    commentValue: "",
    emojiState: true,
    imageState: true,
    imageList: [],
    emojiList: [
      "😠", "😩", "😲", "😞", "😵", "😰", "😒", "😍", "😤", "😜", 
      "😝", "😋", "😘", "😚", "😷", "😳", "😃", "😅", "😆", "😁", 
      "😉", "😫", "😥", "😓", "😏", "😪", "😱", "😔", "😖", "😌", 
      "☀", "☁", "☔", "⛄", "⚡", "🌀", "🌂", "🌃", "🌄", "🌆", 
      "🌊", "🌋", "🌌", "🌏", "🌟", "🍀", "🌷", "🌱", "🍁", "🌸",
      "🍄", "🌰", "🌼", "🌿", "🍒", "🍌", "🍎", "🍊", "🍓", "🍅",
      "👀", "👂", "👃", "👄", "👅", "💄", "💅", "💆", "💇", "👤"
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    this.setData({
      id: Number(options.id)
    });
    this.getCommentList();
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getCommentList()
      }
    }
  },
  addImage() {
    wx.chooseImage({
      sizeType: 'compressed',
      success: res => {
        res.tempFiles.forEach((item, index) => {
          if (item.size > 5000000) {
            wx.showModal({
              title: '图片过大',
              content: '个别图片过大，请重新选择'
            })
          } else {
            this.upLoadImg(res.tempFiles, index);
            wx.showLoading({
              title: '正在上传',
              mask: true
            })
          }
        })
      }
    })
  },
  upLoadImg(list, index) {
    let path = list[index].path
    wx.uploadFile({
      url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
      filePath: path,
      name: "file",
      success: res => {
        let data = JSON.parse(res.data);
        if (data.errno === 0) {
          if(index === list.length-1) {
            wx.hideLoading()
          }
          let arr = [...this.data.imageList, data.data]
          if (arr.length > 9) {
            arr.splice(9)
          }
          this.setData({
            imageList: arr
          })
        } else {
          wx.hideLoading()
          wx.showModal({
            title: data.msg
          })
        }
      }
    });
  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.index
    let arr = this.data.imageList
    arr.splice(index, 1)
    this.setData({
      imageList: arr
    })
  },
  inputComment(e) {
    let value = e.detail.value;
    if (value === " ") {
      this.setData({
        commentValue: ""
      });
    } else {
      this.setData({
        commentValue: value
      });
    }
  },
  postComment() {
    if (this.data.commentValue) {
      _CommentPost({
        typeId: 2,
        valueId: this.data.id,
        content: this.data.commentValue,
        imagesList: this.data.imageList
      })
        .then(() => {
          wx.showToast({ title: "发表成功", icon: "success" });
          this.setData({
            pageIndex: 1,
            commentValue: "",
            imageState: true,
            emojiState: true,
            imageList: []
          });
          this.getCommentList();
          this.refreshPrevPage();
        })
        .catch(data => App.catchError(data));
    }
  },
  emojiStateManage(e) {
    this.setData({
      imageState: true,
      emojiState:!this.data.emojiState
    })
  },
  imageStateManage() {
    this.setData({
      emojiState: true,
      imageState: ! this.data.imageState
    })
  },
  refreshPrevPage() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.getCommonList();
  },
  inputEmoji(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      commentValue: `${this.data.commentValue}${this.data.emojiList[index]}`
    })
  },
  getCommentList(style) {
    _CommentList({
      typeId: 2,
      valueId: this.data.id,
      showType: 0,
      page: this.data.pageIndex,
      sort: "desc"
    })
      .then(data => {
        if (!style) {
          this.setData({
            reviewsList: data.data,
            totalPages: data.totalPages
          });
        } else {
          wx.hideLoading();
          let arr = [...this.data.reviewsList, ...data.data];
          this.setData({ reviewsList: arr, totalPages: data.totalPages });
        }
      })
      .catch(data => App.catchError(data));
  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type
    if(type === "cont") {
      let picList = e.currentTarget.dataset.piclist;
      let arr = [];
      picList.forEach(item => {
        arr.push(item.pic_url);
      });
      wx.previewImage({
        urls: arr,
        current: arr[index]
      });
    }else {
      wx.previewImage({
        urls: this.data.imageList,
        current: this.data.imageList[index]
      })
    }
  },
  onReachBottom: function() {
    if (this.data.pageIndex < this.data.totalPages) {
      wx.showLoading({
        title: "正在加载",
        mask: true
      });
      this.setData({
        pageIndex: this.data.pageIndex + 1
      });
      this.getCommentList("byScroll");
    }else {
      App.theEndPage()
    }

  },
  onPageScroll() {
    if (this.data.emojiState === false) {
      this.setData({ emojiState:true });
    } else if (this.data.imageState === false) {
      this.setData({
        imageState: true
      })
    }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});