// pages/writeReviews/writeReviews.js

import { _OrderDetail, _PostComment } from "../../utils/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: "",
    goodsList: [],
    orderInfo: {},
    packageStar: [],
    speedStar: [],
    serviceStar: [],
    isAnonymous: 1,
    fatherIndexByUpload: 0,
    from: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderId: Number(options.orderId),
      from: options.from
    });
    this.getOrder();
    this.orderStarInit();
  },
  orderStarInit() {
    function arrInit() {
      let arr = new Array(5);
      arr[0] = "../../img/starRed.png";
      arr.fill("../../img/starGlay.png", 1, 5);
      return arr;
    }
    this.setData({
      packageStar: arrInit(),
      speedStar: arrInit(),
      serviceStar: arrInit()
    });
  },
  getOrder() {
    _OrderDetail({
      orderId: this.data.orderId
    }).then(data => {
      let goodsList = data.orderGoods;
      goodsList.forEach(item => {
        let starArr = new Array(5);
        starArr[0] = "../../img/starRed.png";
        starArr.fill("../../img/starGlay.png", 1, 5);
        item.starList = starArr;
        item.imgList = [];
        item.reviewText = "";
      });
      this.setData({
        goodsList: data.orderGoods,
        orderInfo: data.orderInfo
      });
    });
  },
  chooseGoodsPoint(e) {
    let goodIndex = e.currentTarget.dataset.goodindex;
    let starIndex = e.currentTarget.dataset.starindex;
    let goodsList = this.data.goodsList;
    goodsList[goodIndex].starList.fill(
      "../../img/starGlay.png",
      1,
      goodsList[goodIndex].starList.length + 1
    );
    goodsList[goodIndex].starList.fill(
      "../../img/starRed.png",
      1,
      starIndex + 1
    );
    this.setData({
      goodsList
    });
  },
  chooseOrderPoint(e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let arr = this.data[type];
    arr.fill("../../img/starGlay.png", 1, arr.length + 1);
    arr.fill("../../img/starRed.png", 1, index + 1);
    let obj = {};
    obj[type] = arr;
    this.setData(obj);
  },
  hasName() {
    if (this.data.isAnonymous) {
      this.setData({
        isAnonymous: 0
      });
    } else {
      this.setData({
        isAnonymous: 1
      });
    }
  },
  inputReview(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let index = e.target.dataset.index;
      let goodsList = this.data.goodsList;
      goodsList[index].reviewText = e.detail.value;
      this.setData({
        goodsList
      });
      console.log(this.data.goodsList[index].reviewText);
    }, 500);
  },
  addImage(e) {
    let fatherIndexByUpload = e.currentTarget.dataset.index;
    this.setData({ fatherIndexByUpload });
    let imgList = this.data.goodsList[fatherIndexByUpload].imgList;
    wx.chooseImage({
      sizeType: "compressed",
      success: res => {
        let totalLen = imgList.length + res.tempFiles.length;
        if (totalLen > 9) {
          res.tempFiles.splice(res.tempFiles.length - (totalLen - 9));
        }
        res.tempFiles.forEach((item, index) => {
          if (item.size > 5000000) {
            wx.showModal({
              title: "图片过大",
              content: "个别图片过大，请重新选择"
            });
          } else {
            this.upLoadImg(res.tempFiles, index);
            wx.showLoading({
              title: "正在上传",
              mask: true
            });
          }
        });
      }
    });
  },
  upLoadImg(list, index) {
    let path = list[index].path;
    wx.uploadFile({
      url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
      filePath: path,
      name: "file",
      success: res => {
        let data = JSON.parse(res.data);
        if (data.errno === 0) {
          if (index === list.length - 1) {
            wx.hideLoading();
          }
          this.controlImgList(data.data);
        } else {
          wx.hideLoading();
          wx.showModal({
            title: data.msg
          });
        }
      }
    });
  },
  controlImgList(data) {
    let goodsList = this.data.goodsList;
    goodsList[this.data.fatherIndexByUpload].imgList.push(data);
    this.setData({ goodsList });
  },
  deleteImg(e) {
    let index = e.currentTarget.dataset.index;
    let imgIndex = e.currentTarget.dataset.imgindex;
    let goodsList = this.data.goodsList;
    goodsList[index].imgList.splice(imgIndex, 1);
    this.setData({
      goodsList
    });
  },
  previewImg(e) {
    let index = e.currentTarget.dataset.index;
    let imgIndex = e.currentTarget.dataset.imgindex;
    let goodsList = this.data.goodsList;
    wx.previewImage({
      urls: goodsList[index].imgList,
      current: goodsList[index].imgList[imgIndex]
    });
  },
  beforSubmit() {
    let goodsList = this.data.goodsList;
    let patt = /^[\s]*$/;
    for (let i = 0; i < goodsList.length; i++) {
      if (patt.test(goodsList[i].reviewText)) {
        wx.showModal({
          title: "提示",
          content: "部分商品评价为空"
        });
        break;
      }
      if (i === goodsList.length - 1) {
        this.submitTranslate();
      }
    }
  },
  submitTranslate() {
    let obj = {}
    let data = this.data
    function starTranslate(starList) {
      let quantity = 0
      starList.forEach(item => {
        item === "../../img/starRed.png" ? quantity++ : "";
      })
      return quantity
    }
    obj.orderId = data.orderInfo.id
    obj.isAnonymous = data.isAnonymous
    obj.expressPackagingStar = starTranslate(data.packageStar);
    obj.deliverySpeedStar = starTranslate(data.speedStar);
    obj.staffAttitudeStar = starTranslate(data.serviceStar);
    obj.comment = []
    data.goodsList.forEach(item => {
      let goodsObj = {}
      goodsObj.goodId = item.goods_id
      goodsObj.productId = item.product_id;
      goodsObj.star = starTranslate(item.starList);
      goodsObj.content = item.reviewText
      goodsObj.imagesList = item.imgList
      obj.comment.push(goodsObj)
    })
    this.reviewSubmit(obj)
  },
  reviewSubmit(obj) {
    _PostComment(obj).then(() => {
      wx.showToast({
        title: '评论添加成功',
        icon: 'success',
        mask: true
      })
      this.refreshPrevPage()
    })
  },
  refreshPrevPage() {
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2];
    function listPage (target) {
      target.setData({ pageIndex: 1 });
      target.getOrderList()
    }
    if (this.data.from === 'detail') {
      prevPage.getOrderDetail();
      listPage(pages[pages.length - 3]); 
    }else {
      listPage(prevPage)
    }
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 1000);
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