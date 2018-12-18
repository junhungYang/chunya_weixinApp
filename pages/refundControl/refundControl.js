import { _GetRefundReasonList, _ApplyRefund } from "../../utils/request";
const App = getApp();
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    from: null,
    orderDetail: null,
    fatherFrom: null,
    goodsStateHid: true,
    reasonStateHid: true,
    inputText: "",
    inputStateHid: false,
    goodsState: "请选择",
    refundReasonList: [],
    activeReason: { name: "请选择" },
    imageList: [],
    inputPrice: "",
    goodsStateAnimate: null,
    goodsMaskAnimate: null,
    reasonStateAnimate: null,
    reasonMaskAnimate: null,
    stateList_H: '',
    reasonList_H: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    this.setData({
      id: options.orderId,
      from: Number(options.from),
      fatherFrom: options.fatherFrom,
      orderDetail: prevPage.data.orderDetail
    });
    console.log(this.data.orderDetail);
    App.setWatcher(App.globalData, this.watch);
    if (App.globalData.token) {
      this.getRefundReasonList();
    }
  },
  watch: {
    token(nV) {
      if (nV) {
        that.getRefundReasonList();
      }
    }
  },
  getRefundReasonList() {
    _GetRefundReasonList({
      refundType: this.data.from
    })
      .then(data => {
        this.setData({ refundReasonList: data });
      })
      .catch(data => App.catchError(data));
  },
  goodsStateManage(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (this.data.goodsStateHid) {
        this.setData({
          goodsStateHid: false,
          inputStateHid: true
        });
        if (!this.data.stateList_H) {
          const query = wx.createSelectorQuery()
          query.select("#state-list").boundingClientRect()
          query.exec((res) => {
            this.setData({ stateList_H: res[0].height })
            App.startAnimate(this, "goodsStateAnimate", 'bottom', '0%');
            App.startAnimate(this, 'goodsMaskAnimate', 'opacity', '0.6')
          })
        } else {
          App.startAnimate(this, "goodsStateAnimate", 'bottom', '0%');
          App.startAnimate(this, 'goodsMaskAnimate', 'opacity', '0.6')
        }
      } else {
        App.startAnimate(this, "goodsStateAnimate", "bottom", `-${this.data.stateList_H}px`);
        App.startAnimate(this, 'goodsMaskAnimate', 'opacity', '0')
        setTimeout(() => {
          this.setData({
            goodsStateHid: true,
            inputStateHid: false
          })
        }, 250);
      }
    }, 300);
  },
  reasonStateManage(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (this.data.reasonStateHid) {
        this.setData({
          reasonStateHid: false,
          inputStateHid: true
        });
        if (!this.data.reasonList_H) {
          const query = wx.createSelectorQuery();
          query.select("#reason-list").boundingClientRect();
          query.exec(res => {
            this.setData({ reasonList_H: res[0].height });
            App.startAnimate(this, "reasonStateAnimate", "bottom", "0%");
            App.startAnimate(this, "reasonMaskAnimate", "opacity", "0.6");
          });
        } else {
          App.startAnimate(this, "reasonStateAnimate", "bottom", "0%");
          App.startAnimate(this, "reasonMaskAnimate", "opacity", "0.6");
        }
      } else {
        App.startAnimate(this, "reasonStateAnimate", "bottom", `-${this.data.reasonList_H}px`);
        App.startAnimate(this, "reasonMaskAnimate", "opacity", "0");
        setTimeout(() => {
          this.setData({
            reasonStateHid: true,
            inputStateHid: false
          });
        }, 250);
      }
    }, 300);
  },
  inputControl(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (e.currentTarget.dataset.type === "text") {
        this.setData({ inputText: e.detail.value });
      } else {
        this.setData({ inputPrice: e.detail.value });
      }
    }, 500);
  },
  chooseGoodsState(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      App.startAnimate(this, "goodsStateAnimate", "bottom", `-${this.data.stateList_H}px`);
      App.startAnimate(this, 'goodsMaskAnimate', 'opacity', '0')
      setTimeout(() => {
        this.setData({
          goodsState: e.currentTarget.dataset.type,
          goodsStateHid: true,
          inputStateHid: false
        });
      }, 250);
    }, 300);
  },
  chooseReason(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      App.startAnimate(this, "reasonStateAnimate", "bottom", `-${this.data.reasonList_H}px`);
      App.startAnimate(this, "reasonMaskAnimate", "opacity", "0");
      setTimeout(() => {
        this.setData({
          activeReason: e.currentTarget.dataset.item,
          reasonStateHid: true,
          inputStateHid: false
        });
      }, 250);
    }, 300);
    
  },
  addImage() {
    App.addImage(this.data.imageList.length).then(data => {
      let imageList = [...this.data.imageList, ...data];
      this.setData({ imageList });
      wx.hideLoading();
    });
  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.index;
    let arr = this.data.imageList;
    arr.splice(index, 1);
    this.setData({
      imageList: arr
    });
  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let imageList = [];
    this.data.imageList.forEach(item => imageList.push(item.path));
    wx.previewImage({ current: imageList[index], urls: imageList });
  },
  submit() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      if (this.data.from === 2 && this.data.goodsState === "请选择") {
        this.showModal("请选择货物状态");
        return;
      }
      if (this.data.activeReason.name === "请选择") {
        this.showModal("请选择退款原因");
        return;
      }
      if (this.data.inputPrice === "") {
        this.showModal("请输入退款金额");
        return;
      }
      if ( Number(this.data.inputPrice) > this.data.orderDetail.orderInfo.order_price) {
        this.showModal(`退款金额最多为￥${this.data.orderDetail.orderInfo.order_price}`)
        return;
      }
      if (Number(this.data.inputPrice) === 0 || Number(this.data.inputPrice) < 0.01) {
        this.showModal("请输入正确的退款金额");
        return;
      }
      let obj = {}
      obj.orderId = this.data.id
      obj.refundType = this.data.from
      if (this.data.from === 1) {
        obj.goodsStatus = 0
      } else {
        obj.goodsStatus = this.data.goodsState === "未收到货" ? 0 : 1;
      }
      obj.refundReason = this.data.activeReason.name
      obj.refundAmount = this.data.inputPrice
      obj.refundRemark = this.data.inputText
      obj.imgList = [];
      wx.showLoading({
        title: '正在提交',
        mask: true
      })
      if (this.data.imageList.length > 0) {
        this.upLoadImg(obj)
      } else {
        this.applyRefund(obj)
      }
    }, 300);
  },
  upLoadImg(obj) {
    this.data.imageList.forEach(item => {
      App.upLoadImg(item.path)
        .then(data => {
          obj.imgList.push(data);
          if (obj.imgList.length === this.data.imageList.length) {
            this.applyRefund(obj);
          }
        })
        .catch(msg => wx.showModal({ title: msg }));
    });
  },
  applyRefund(data) {
    _ApplyRefund(data).then(data => {
      wx.hideLoading()
      wx.showToast({
        title: data,
        icon: 'success',
        duration: 2200,
        mask: true
      })
      setTimeout(() => {
        this.refreshPrevPage()
      }, 2100);
    }).catch(data => App.catchError(data))
  },
  refreshPrevPage() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 3];
    if(this.data.fatherFrom === 'list') {
      prevPage.data.orderList.forEach((item,index) => {
        prevPage.getOrderList(1,index)
      })
    }else {
      let prevPrevPage = pages[pages.length - 4]
      prevPage.getOrderDetail()
      prevPrevPage.data.orderList.forEach((item,index) => {
        prevPrevPage.getOrderList(1,index)
      })
    }
    wx.navigateBack({
      delta: 2
    })
  },
  showModal(content) {
    wx.showModal({
      title:'提示',
      content
    })
  },
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
