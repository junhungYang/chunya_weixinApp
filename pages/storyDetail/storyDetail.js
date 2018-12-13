// pages/storyDetail/storyDetail.js
const App = getApp()
import {
  _PostsDetail,
  _PostsGetCommentList,
  _PostsAddComment,
  _LikeAddOrDelete,
  _CollectAddorDelete
} from "../../utils/request";
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    detail: {},
    pageIndex: 1,
    commentList: [],
    totalPages: 0,
    from: "",
    value: "",
    reviewsCount: 0,
    scrollFlag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    if (App.globalData.token) {
      this.setData({
        id: Number(options.id),
        from: options.from
      });
      this.getCommentList();
      this.getStoryDetail();
    }
    App.setWatcher(App.globalData, this.watch);
  },
  navToWatchVideo(e) {
    let src = e.currentTarget.dataset.src
    wx.navigateTo({
      url: `../watchVideo/watchVideo?src=${src}`
    })
  },
  viewPic(e) {
    let index = e.currentTarget.dataset.index;
    let list = e.currentTarget.dataset.list
    let arr = [];
    list.forEach(item => {
      arr.push(item.picUrl)
    })
    wx.previewImage({
      current: arr[index],
      urls: arr
    })
  },
  getCommentList(type) {
      wx.showLoading({
        title: "正在加载",
        mask: true
      });
    _PostsGetCommentList({
      postId: this.data.id,
      page: this.data.pageIndex,
      size: 10
    })
      .then(data => {
        if (type) {
          data.data = [...this.data.commentList, ...data.data];
        }
        setTimeout(() => {
          wx.hideLoading();
        }, 500);
        this.setData({ 
          commentList: data.data,
           totalPages: data.totalPages, 
           scrollFlag:true,
          reviewsCount: data.count
        });
      })
      .catch(data => App.catchError(data));

  },
  getStoryDetail() {
    _PostsDetail({ id: this.data.id })
      .then(data => {
        this.setData({ detail: data });
      })
      .catch(data => App.catchError(data));

  },
  onReachBottom: function() {
    if(this.data.scrollFlag) {
      if (this.data.pageIndex < this.data.totalPages) {
        this.setData({
          pageIndex: this.data.pageIndex + 1,
          scrollFlag: false
        });
        this.getCommentList("scroll");
      } else {
        App.theEndPage()
      }
    }
  },
  inputComment(e) {
    if (e.detail.value === " ") {
      this.setData({
        value: ""
      });
    } else {
      this.setData({
        value: e.detail.value
      });
    }
  },
  confirmComment(e) {
    if (this.data.value) {
      _PostsAddComment({
        postId: this.data.id,
        content: this.data.value
      }).then(data => {
        wx.showToast({
          icon: "success",
          title: "添加成功"
        });
        this.setData({
          value: ""
        });
        wx.pageScrollTo({
          scrollTop: 0
        })
        this.refreshCommentList(data);
        }).catch(data => App.catchError(data))
    }
  },
  refreshCommentList() {
    this.setData({
      pageIndex: 1
    });
    this.getCommentList();
    this.refreshPrevPage();
  },
  refreshPrevPage() {
    let pages = getCurrentPages();
    let prevPage;
    if (this.data.from === "list") {
      prevPage = pages[pages.length - 2];
    } else if (this.data.from === "write") {
      prevPage = pages[pages.length - 3];
    }
    prevPage.data.list.forEach((item,index) => {
      prevPage.getStoryList(1,index);
    })
  },
  dianZan() {
    _LikeAddOrDelete({
      typeId: 0,
      valueId: this.data.id
    }).then( () => {
      this.getStoryDetail();
      this.refreshPrevPage();
    }).catch(data => App.catchError(data))
  },
  collect() {
    _CollectAddorDelete({
      typeId: 2,
      valueId:this.data.id
    }).then(() => {
      this.getStoryDetail();
      this.refreshPrevPage();
      }).catch(data => App.catchError(data))
  },
  watch: {
    token(newValue) {
      if (newValue) {
        that.getCommentList();
      }
    }
  },
  showModal(msg) {
    wx.showModal({
      title: msg
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});