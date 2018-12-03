// pages/invoice/invoice.js
import { 
  _QueryInvoiceList,
  _SaveOrUpdateInvoice
} from '../../utils/request'
const App = getApp()
var that
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contStyle: "desc",
    list: [],
    listState: true,
    data: {},
    attentionState: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this
    App.setWatcher(App.globalData,this.watch)
    this.setData({
      data: JSON.parse(options.invoice)
    });
    this.getInvoiceList();
  },
  watch: {
    token(nV) {
      if(nV) {
        that.getInvoiceList();
      }
    }
  },
  refreshData(e) {
    let data = e.currentTarget.dataset.item;
    this.setData({
      data,
      listState: true
    });
  },
  getInvoiceList() {
    _QueryInvoiceList()
      .then(data => {
        this.setData({ list: data });
      })
      .catch(data => App.catchError(data));
  },
  inputTaxpayerCode(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let data = this.data.data;
      data.taxpayerIdentificationNumber = e.detail.value;
      this.setData({
        data
      });
    }, 500);
  },
  changeDefault(e) {
    let data = this.data.data;
    if (data.isDefault) {
      data.isDefault = 0;
    } else {
      data.isDefault = 1;
    }
    this.setData({
      data
    });
  },
  listStateManage(e) {
    let listState = e.currentTarget.dataset.type;
    this.setData({
      listState
    });
  },
  changeInvStyle(e) {
    let invStyle = e.currentTarget.dataset.style;
    let data = this.data.data;
    data.invoiceType = invStyle;
    this.setData({
      data
    });
  },
  changeInvTitleStyle(e) {
    let invTitleStyle = e.currentTarget.dataset.style;
    let data = this.data.data;
    data.headerType = invTitleStyle;
    this.setData({
      data
    });
  },
  changeCont(e) {
    let contStyle = e.currentTarget.dataset.style;
    let data = this.data.data;
    data.contentType = contStyle;
    this.setData({
      data
    });
  },
  inputInvTitle(e) {
    let data = this.data.data;
    if (e.detail.value === " ") {
      data.headerContent = "";
    } else {
      data.headerContent = e.detail.value;
    }
    this.setData({
      data
    });
  },
  inputMail(e) {
    let data = this.data.data;
    if (e.detail.value === " ") {
      data.invoicerEmail = "";
    } else {
      data.invoicerEmail = e.detail.value;
    }
    this.setData({
      data
    });
  },
  inputPhoneNum(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let data = this.data.data;
      data.invoicerMobile = e.detail.value;
      this.setData({
        data
      });
    }, 600);
  },
  filterStart() {
    let data = this.data.data;
    if (data.invoiceType === 1) {
      if (data.invoicerEmail) {
        let pattern = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/;
        let res = pattern.test(data.invoicerEmail);
        if (res) {
          this.filterSecond();
        } else {
          this.showModal("请输入正确的邮箱地址");
        }
      } else {
        this.showModal("请输入您的电子邮箱");
      }
    } else {
      this.filterSecond();
    }
  },
  filterSecond() {
    let data = this.data.data;
    if (data.headerType === 2) {
      if (data.taxpayerIdentificationNumber) {
        this.filterThird();
      } else {
        this.showModal("请填写纳税人识别码");
      }
    } else {
      this.filterThird();
    }
  },
  filterThird() {
    let data = this.data.data;
    if (data.headerContent) {
      if (data.invoicerMobile && data.invoicerMobile.length === 11) {
        this.confirm();
      } else {
        this.showModal("请填写至正确的手机号码");
      }
    } else {
      this.showModal("请填写或选择发票抬头");
    }
  },
  showModal(msg) {
    wx.showModal({
      title: "提示",
      content: msg
    });
  },
  confirm() {
    let data = this.data.data;
    let obj = {
      invoiceType: data.invoiceType,
      headerType: data.headerType,
      headerContent: data.headerContent,
      isDefault: data.isDefault,
      contentType: data.contentType,
      invoicerMobile: data.invoicerMobile
    };
    data.invoiceType === 1 ? (obj.invoicerEmail = data.invoicerEmail) : "";
    data.headerType === 2
      ? (obj.taxpayerIdentificationNumber = data.taxpayerIdentificationNumber)
      : "";
    data.id ? (obj.id = data.id) : "";
    _SaveOrUpdateInvoice(obj)
      .then(data => {
        this.refreshPrevPage(data);
      })
      .catch(data => App.catchError(data));
  },
  refreshPrevPage(data) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let obj = prevPage.data.data;
    obj.checkedInvoice = data;
    prevPage.setData({
      data: obj
    });
    wx.navigateBack({
      delta: 1
    });
  },
  noInvoice() {
    let obj = {
      id: null,
      invoiceType: 1,
      headerType: 1,
      headerContent: null,
      isDefault: 1,
      contentType: 1,
      invoicerMobile: null,
      invoicerEmail: null,
      taxpayerIdentificationNumber: null
    };
    this.refreshPrevPage(obj);
  },
  showAttention() {
    this.setData({
      attentionState: !this.data.attentionState
    });
  },
  onPageScroll() {
    this.setData({ listState:true });
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