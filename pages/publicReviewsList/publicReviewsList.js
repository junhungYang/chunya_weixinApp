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
    ],
    scrollFlag: true,
    emojiAnimate: null,
    chooseImgAnimate: null,
    release_H: '',
    emoji_H: '',
    chooseImg_H: ''
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
  onReady: function() {
    let query = wx.createSelectorQuery()
    query.select("#release").boundingClientRect();
    query.exec(res => {
      this.setData({ release_H: res[0].height});
    });
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getCommentList()
      }
    }
  },
  addImage() {
    App.addImage(this.data.imageList.length).then( data => {
      let imageList = [...this.data.imageList, ...data]
      this.setData({
        imageList
      })
      wx.hideLoading()
    })
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
  confirm() {
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    if (this.data.commentValue) {
      if(this.data.imageList.length !== 0) {
        let imagesList = [];
        this.data.imageList.forEach(item => {
          App.upLoadImg(item.path).then(data => {
            imagesList.push(data)
            if (imagesList.length === this.data.imageList.length) {
              this.postComment(imagesList)
            }
          }).catch(msg => wx.showModal({ title: msg }))
        })
      } else {
        this.postComment([]);
      }
    }else {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
    }
  },
  postComment(imagesList) {
    _CommentPost({
      typeId: 2,
      valueId: this.data.id,
      content: this.data.commentValue,
      imagesList,
    })
      .then(() => {
        wx.hideLoading()
        wx.showToast({ title: "发表成功", icon: "success" });
        this.setData({
          pageIndex: 1,
          commentValue: "",
          imageState: true,
          emojiState: true,
          imageList: []
        });
        if (this.data.chooseImg_H) {
          App.startAnimate(this, "chooseImgAnimate", "bottom", `-${this.data.chooseImg_H - this.data.release_H}px`, 0);
        }
        if (this.data.emoji_H) {
          App.startAnimate(this, "emojiAnimate", "bottom", `-${this.data.emoji_H - this.data.release_H}px`, 0);
        }
        this.getCommentList();
        this.refreshPrevPage();
      })
      .catch(data => App.catchError(data));
  },
  emojiStateManage(e) {
    if (this.data.emojiState) {
      this.setData({ 
        imageState: true,
        emojiState: false
       });
       if(!this.data.emoji_H) {
         let query = wx.createSelectorQuery()
         query.select("#emoji").boundingClientRect();
         query.exec(res => {
           this.setData({ emoji_H: res[0].height });
         });
       } 
      App.startAnimate(this, "emojiAnimate", "bottom", `${this.data.release_H}px`);
      if (this.data.chooseImg_H) {
        App.startAnimate(this, "chooseImgAnimate", "bottom", `-${this.data.chooseImg_H - this.data.release_H}px`, 0);
      }
    }else {
      App.startAnimate(this, "emojiAnimate", "bottom", `-${this.data.emoji_H-this.data.release_H}px`);
      setTimeout(() => {
        this.setData({ emojiState: true })
      }, 250);
    }
  },
  imageStateManage() {
    if(this.data.imageState) {
      this.setData({
        emojiState: true,
        imageState: false
      })
      if (!this.data.chooseImg_H) {
        let query = wx.createSelectorQuery()
        query.select("#choose-img").boundingClientRect();
        query.exec(res => {
          this.setData({ chooseImg_H: res[0].height });
        });
      }
      App.startAnimate(this, "chooseImgAnimate", "bottom", `${this.data.release_H}px`);
      if (this.data.emoji_H) {
        App.startAnimate(this, "emojiAnimate", "bottom", `-${this.data.emoji_H - this.data.release_H}px`,0);
      }
    }else {
      App.startAnimate(this, "chooseImgAnimate", "bottom", `-${this.data.chooseImg_H - this.data.release_H}px`);
      setTimeout(() => {
        this.setData({ imageState: true });
      }, 250);
    }
   
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
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    _CommentList({
      typeId: 2,
      valueId: this.data.id,
      showType: 0,
      page: this.data.pageIndex,
      sort: "desc"
    })
      .then(data => {
        if(style) {
          data.data = [...this.data.reviewsList, ...data.data]
        }
        this.setData({
          reviewsList: data.data,
          totalPages: data.totalPages,
          scrollFlag: true
        })
        setTimeout(() => {
          wx.hideLoading();
        }, 600);
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
      App.previewImg(index,arr)
    }else {
      let imageList = []
      this.data.imageList.forEach(item => imageList.push(item.path))
      App.previewImg(index,imageList)
    }
  },
  onReachBottom: function() {
    if(this.data.scrollFlag) {
      if (this.data.pageIndex < this.data.totalPages) {
        wx.showLoading({
          title: "正在加载",
          mask: true
        });
        this.setData({
          pageIndex: this.data.pageIndex + 1,
          scrollFlag: false
        });
        this.getCommentList("byScroll");
      } else {
        App.theEndPage()
      }
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