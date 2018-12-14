// pages/eventEnter/eventEnter.js
import { 
  _ActivityDetail,
  _ActivitySignUp
} from '../../utils/request'
const App = getApp()
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    enterSucState: true,
    id: "",
    detail: {},
    name: "",
    sex: 1,
    phone: "",
    desc: "",
    eventState: '我要报名',
    animate:null
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
    this.getDetail();
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getDetail()
      }
    }
  },
  getDetail() {
    _ActivityDetail({ id: this.data.id })
      .then(data => {
        let dateObj = new Date(data.activityStartTime);
        data.activityStartTime = `${dateObj.getFullYear()}.${dateObj.getMonth() + 1}.${dateObj.getDate()}`;
        this.setData({ detail: data });
      })
      .catch(data => App.catchError(data));
  },
  inputName(e) {
    let value = e.detail.value;
    if (value === " ") {
      this.setData({
        name: ""
      });
    } else {
      this.setData({
        name: value
      });
    }
  },
  chooseSex(e) {
    let sex = e.currentTarget.dataset.sex
    this.setData({
      sex
    })
  },
  inputPhone(e) {
    let value = e.detail.value;
    if (value === " ") {
      this.setData({
        phone: ""
      });
    } else {
      this.setData({
        phone: value
      });
    }
  },
  inputDesc(e) {
    let value = e.detail.value;
    if (value === " ") {
      this.setData({
        desc: ""
      });
    } else {
      this.setData({
        desc: value
      });
    }
  },
  signupEnter() {
    if(!this.data.name) {
      wx.showModal({
        title: '提示',
        content: '请输入您的姓名'
      })
    }else if(!this.data.phone) {
      wx.showModal({
        title: '提示',
        content: '请输入您的手机号码'
      })
    }else if(this.data.phone.length !== 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码'
      })
    }else {
      wx.showLoading({
        title: '正在提交',
        mask:true
      })
      _ActivitySignUp({
        id: this.data.id,
        name: this.data.name,
        sex: this.data.sex,
        mobile: this.data.phone,
        remark: this.data.desc
      }).then(data => {
        setTimeout(() => {
          wx.hideLoading()
        }, 400);
        this.setData({
          enterSucState: false
        })
        App.startAnimate(this,'animate','opacity',1)
        }).catch(data => App.catchError(data))
    }
  },
  navBackToEventDetail() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 3];
    prevPage.data.list.forEach((item,index) => {
      prevPage.getActivityList(1, index)
    })
    wx.navigateBack({
      delta: 2
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});