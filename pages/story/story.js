// pages/story/story.js
const App = getApp()
import { _PostsList, _LikeAddOrDelete, _CollectAddorDelete, _CollectDeleteAll} from '../../utils/request'
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navActive: 0,
    list:['','','',''],
    scrollFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    App.setWatcher(App.globalData, this.watch);
    if (App.globalData.token) {
      this.data.list.forEach((item,index) => {
        this.getStoryList(1,index);
      })
    }
  },
  getStoryList(page,typeIndex,scroll,noLoading) {
    if(!noLoading) {
      wx.showLoading({
        title: "正在加载",
        mask: true
      });
    }
    this.setData({scrollFlag:false})
    _PostsList({
      type:typeIndex,
      page,
      size: 10
    })
      .then(data => {
        let list = this.data.list
        if(scroll) {
          list[typeIndex].currentPage ++
          list[typeIndex].data = [...list[typeIndex].data, ...data.data]
        }else {
          list[typeIndex] = data
        }
        this.setData({
          list,
          scrollFlag:true
        })
        App.hideLoadingInSwiper(this.data.list,'')
      })
      .catch(data => App.catchError(data));
  },
  changeActiveByScroll(e) {
    this.setData({
      navActive: e.detail.current
    })
  },
  changeActiveByClick(e) {
    this.setData({
      navActive: e.currentTarget.dataset.index
    })
  },
  previewImg(e) {
    let index= e.currentTarget.dataset.index
    let imgIndex = e.currentTarget.dataset.imgindex
    let fatherIndex = e.currentTarget.dataset.fatherindex
    let arr = this.data.list[fatherIndex].data[index].postsPictureVos;
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
      this.data.list.forEach((item, index) => {
        this.getStoryList(1, index);
      })
      }).catch(data => App.catchError(data))
  },
  navToIndex() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  collect(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let fatherIndex = e.currentTarget.dataset.fatherindex
      let valueId = e.currentTarget.dataset.id
      let targetIndex = e.currentTarget.dataset.index
      let count = e.currentTarget.dataset.count
      let list = this.data.list
      let collectRes = 0
      _CollectAddorDelete({
        typeId: 2,
        valueId
      }).then((data) => {
        if(fatherIndex !== 3) {
          if (data.type === 'delete') {
            list[3].data.forEach((item,index) => {
              if(item.id === valueId) {
                list[3].data.splice(index,1)
              }
            })
            collectRes = 0
            count ? count -- : ''
          } else {
            this.getStoryList(1,3,false,'noLoading')
            collectRes = 1
            count ++
          }
        }else {
          list[3].data.splice(targetIndex,1)
          collectRes = 0
          count ? count-- : ''
        }
        list.forEach((item, index) => {
          if(index !== 3) {
            item.data.forEach((item1, index1) => {
              if (item1.id === valueId) {
                item1.isCollected = collectRes
                item1.collectCount = count
                return
              }
            })
          }
        })
        this.setData({ list })
      })
    }, 300); 
  },
  likeControl(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let fatherIndex = e.currentTarget.dataset.fatherindex
      let valueId = e.currentTarget.dataset.id
      let targetIndex = e.currentTarget.dataset.index
      let count = e.currentTarget.dataset.count
      let list = this.data.list
      let likeRes = 0
      _LikeAddOrDelete({
        typeId: 0,
        valueId
      }).then(data => {
        if(data.type === 'delete') {
          likeRes = 0
          count ? count-- : ''
        }else {
          likeRes = 1
          count ++
        }
        list.forEach(item => {
          item.data.forEach(item1 => {
            if (item1.id === valueId) {
              item1.isLiked = likeRes
              item1.likeCount = count
              return
            }
          })
        })
        this.setData({ list })
      })
    }, 300);
  },
  getListByScroll(e) {
    let fatherItem = e.currentTarget.dataset.item
    let fatherIndex = e.currentTarget.dataset.index
    if(fatherItem.currentPage < fatherItem.totalPages) {
      this.getStoryList(fatherItem.currentPage + 1,fatherIndex,'scroll')
    }else {
      App.theEndPage()
    }
  },
  navToWatchVideo(e) {
    let src = e.currentTarget.dataset.src
    wx.navigateTo({
      url: `../watchVideo/watchVideo?src=${src}`
    })
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
        that.data.list.forEach((item, index) => {
          that.getStoryList(1, index);
        })
      }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getListByScroll()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});