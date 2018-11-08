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
    from: "",
    value: ""
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
    }
    App.setWatcher(App.globalData, this.watch);
  },
  getCommentList(type) {
    if (type) {
      wx.showLoading({
        title: "正在加载",
        mask: true
      });
    }
    _PostsGetCommentList({
      postId: this.data.id,
      page: this.data.pageIndex,
      size: 10
    })
      .then(data => {
        this.getStoryDetail();
        if (type) {
          let arr = [...this.data.commentList, ...data.data];
          setTimeout(() => {
            wx.hideLoading();
            this.setData({
              commentList: arr
            });
          }, 500);
        } else {
          this.setData({
            commentList: data.data
          });
        }
      })
      .catch(msg => this.showModal(msg));
  },
  getStoryDetail() {
    _PostsDetail({
      id: this.data.id
    })
      .then(data => {
        this.setData({
          detail: data
        });
      })
      .catch(msg => this.showModal(msg));
  },
  onReachBottom: function() {
    this.setData({
      pageIndex: this.data.pageIndex + 1
    });
    this.getCommentList("scroll");
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
        this.refreshCommentList(data);
      });
    }
  },
  refreshCommentList(data) {
    this.setData({
      pageIndex: 1
    });
    this.getCommentList();
    let pages = getCurrentPages();
    let prevPage;
    if (this.data.from === "list") {
      prevPage = pages[pages.length - 2];
    } else if (this.data.from === "write") {
      prevPage = pages[pages.length - 3];
    }
    prevPage.setData({
      page: 1,
      list: []
    });
    prevPage.getStoryList();
    // let detail = this.data.detail
    // detail.commentCount ++
    // let arr = this.data.commentList;
    // arr.unshift(data)
    // this.setData({
    //   commentList: arr,
    //   detail
    // })
    // wx.pageScrollTo({
    //   scrollTop: 0
    // })
    // let pages = getCurrentPages()
    // let prevPage = pages[pages.length - 2];
    // let arrPrevPage = prevPage.data.list
    // arrPrevPage[this.data.index].commentCount++;
    // prevPage.setData({
    //   list: arrPrevPage
    // })
  },
  dianZan() {
    _LikeAddOrDelete({
      typeId: 0,
      valueId: this.data.id
    }).then( () => {
      this.getCommentList();
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
  },
  collect() {
    _CollectAddorDelete({
      typeId: 2,
      valueId:this.data.id
    }).then(() => {
      this.getCommentList()
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
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