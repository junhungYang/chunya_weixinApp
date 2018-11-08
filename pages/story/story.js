// pages/story/story.js
const App = getApp()
import { _PostsList, _LikeAddOrDelete, _CollectAddorDelete, _CollectDeleteAll} from '../../utils/request'
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navActive: 1,
    list:[],
    page: 1,
    top: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    App.setWatcher(App.globalData, this.watch);
    if (App.globalData.token) {
      this.getStoryList();
    }
  },
  getStoryList() {
      wx.showLoading({
        title: "正在加载"
      });
    _PostsList({
      type: this.data.navActive,
      page: this.data.page,
      size: 10
    })
      .then(data => {
        let list = [...this.data.list, ...data.data];
        this.setData({
          list
        });
        setTimeout(() => {
          wx.hideLoading();
        }, 600);
      })
      .catch(msg => {
        // console.log(msg)
        this.showModal(msg);
      });
  },
  previewImg(e) {
    let index= e.currentTarget.dataset.index
    let imgIndex = e.currentTarget.dataset.imgindex
    let arr = this.data.list[index].postsPictureVos;
    let pathArr = []
    arr.forEach(item => {
      pathArr.push(item.picUrl)
    })
    wx.previewImage({
      current: pathArr[imgIndex],
      urls: pathArr
    })
  },
  cancelCollectAll() {
    _CollectDeleteAll({
      typeId: 2
    }).then(() => {
      this.setData({
        navActive: 3,
        page: 1,
        list: []
      })
      this.getStoryList()
    }).catch(msg => {
      wx.showModal({
        title: msg
      })
    })
  },
  zanControl(e) {
    let index = e.currentTarget.dataset.index
    let valueId = e.currentTarget.dataset.id
    let isLiked = e.currentTarget.dataset.isliked
    let isCollected = e.currentTarget.dataset.iscollected
    let type = e.currentTarget.dataset.type
    let promiseObj

    if(type === 'collect') {
      promiseObj = _CollectAddorDelete({
        typeId: 2,
        valueId
      })
    }else {
      promiseObj = _LikeAddOrDelete({
        typeId: 0,
        valueId
      })
    }
    promiseObj.then(() => {
      let arr = this.data.list
      if (type === 'zan') {
        if (isLiked) {
          arr[index].likeCount--
          arr[index].isLiked = 0
        } else {
          arr[index].likeCount++
          arr[index].isLiked = 1
        }
        this.setData({
          list: arr
        })
      } else {
        if (this.data.navActive !== 3) {
          if (isCollected) {
            arr[index].collectCount--;
            arr[index].isCollected = 0;
          } else {
            arr[index].collectCount++;
            arr[index].isCollected = 1;
          }
          this.setData({
            list: arr
          })
        } else {
          this.setData({
            page:1
          })
          this.getStoryList(3);
        }
      }
    }).catch(msg => this.showModal(msg))
  },
  changeActive(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      navActive: index,
      page: 1,
      list:[]
    });
    this.getStoryList(index)

  },
  getListByScroll() {
    this.setData({
      page: this.data.page +1
    })
    this.getStoryList()
  },
  navToDetail(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: `../storyDetail/storyDetail?id=${id}&from=list`
    });
  },
  navToWriteStory() {
    wx.navigateTo({
      url: "../writeStory/writeStory"
    });
  },
  watch: {
    token(newValue) {
      if (newValue) {
        that.getStoryList(that.data.navActive);
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});