// pages/nuanke/nuanke.js
import {
  _WarmclassList,
  _WarmclassPay,
  _CollectAddorDelete
} from "../../utils/request";
const App = getApp()
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 0,
    list:[{},{},{},{}],
    page:1,
    payBtnHidden: true,
    payId: '',
    activePrice: 0,
    totalPages: 0,
    isPay: 0,
    list1: [[1,2],[3,4],[5,6]]
  },
  onLoad: function (options) {
    that= this
    App.setWatcher(App.globalData,this.watch)
    this.setData({isPay:options.isPay})
    if(App.globalData.token) {
      this.data.list.forEach((item,index) => {
        this.getList(1,index+1);
      })
    }
  },
  watch: {
    token(newValue) {
      if(newValue) {
        that.getList();
      }  
    }
  },
  getList(page,type,scroll) {
    wx.showLoading({
      title: '正在加载'
    })
      _WarmclassList({
        page,
        type,
        size: 8,
        isPay: this.data.isPay
      }).then(data => {
        let arr = this.data.list
        if(scroll) {
          arr[type-1].currentPage ++
          arr[type-1].data = [...arr[type-1].data, ...data.data];
        }else {
          arr[type-1] = data
        }
        setTimeout(() => {
          wx.hideLoading()
        }, 1000);
        this.setData({
          list: arr
        })
      }).catch(data => App.catchError(data))
  },
  changeIndex(e) {
    this.setData({
      navIndex: e.detail.current
    })
  },
  changeNav(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      navIndex: index,
    })
  },
  scrollRefresh(e) {
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    if (item.currentPage < item.totalPages) {
      this.getList(item.currentPage+1,index+1,'scroll');
    } else {
      App.theEndPage()
    }
  },
  navToDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../nuankeDetail/nuankeDetail?warmClassId=${id}`
    });
  },
  showPayBtn(e) {
    let isPay = e.currentTarget.dataset.ispay
    let activePrice = e.currentTarget.dataset.price
    let isFree = e.currentTarget.dataset.isfree
    let payId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../nuankeDetail/nuankeDetail?warmClassId=${payId}`
    });
    if(isFree || isPay) {
      wx.navigateTo({
        url: `../nuankeDetail/nuankeDetail?warmClassId=${payId}`
      });
    }else {
      wx.showModal({
        title: '兑换提示',
        content: `需${activePrice}积分进行兑换`,
        success: (res) => {
          if(res.confirm) {
            _WarmclassPay({
              id: payId
            }).then(data => {
              wx.navigateTo({
                url: `../nuankeDetail/nuankeDetail?warmClassId=${payId}`
              });
              this.data.list.forEach((item, index) => {
                this.getList(1, index + 1);
              })
            }).catch(data => App.catchError(data))
          }
        }
      })
    }
  },
  hiddenPayBtn() {
    this.setData({
      payBtnHidden: true
    })
  },
  collect(e) {
    let valueId = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let fatherIndex = e.currentTarget.dataset.fatherindex
    let otherIndex = e.currentTarget.dataset.contenttype -1
    let list = this.data.list
    _CollectAddorDelete({
      typeId: 1,
      valueId
    }).then((data) => {
      if(this.data.navIndex < 3) {
        if (data.type === "delete") {
          list[fatherIndex].data[index].isCollected = 0
        } else {
          list[fatherIndex].data[index].isCollected = 1
        }
        this.setData({ list })
        this.getList(1, 4);
      }else {
        list[otherIndex].data.forEach(item =>{
          if(item.id === valueId) {
            item.isCollected = 0
          }
        })
        list[fatherIndex].data.splice(index, 1);
        this.setData({
          list
        })
      }
     
    }).catch(data => App.catchError(data))
  },
  showModal(msg) {
    wx.showModal({
      title: msg
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    wx.showShareMenu();
  }
});