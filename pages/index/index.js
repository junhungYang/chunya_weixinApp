//index.js
//获取应用实例
import {_GoodsList} from '../../utils/request'
const app = getApp()
Page({
  data: {
    name: "junxing",
    background: ["demo-text-1", "demo-text-2", "demo-text-3"],
    goodsList:[]
  },
  onLoad() {
    _GoodsList({
      page:1,
      size:10
    }).then(data => {
      this.setData({
        goodsList:data.data
      })
    })
  },
  navToGoodDetail(e) {
    let goodId = e.currentTarget.dataset.goodid
    wx.navigateTo({
      url:`../goodDetail/goodDetail?goodId=${goodId}`
    })
  },
  shangchuan() {  
    wx.chooseImage({
      success: res => {
        let token = app.globalData.token;
        wx.uploadFile({
          url: "https://shop.chunyajkkj.com/ch/api/upload/upload",
          filePath: res.tempFilePaths[0],
          name: "file",
          success: res => {
            alert(res);
          }
        });
      }
    });
  },

  bindGetUserInfo(res) {
    if (res.detail.userInfo) {
      //用户点击了授权
      app.getSensitiveInfo();
    } else {
      //用户点击了取消
      wx.showModal({
        title: "警告通知",
        content:
          "您点击了拒绝授权,将无法正常显示个人信息,请从新点击授权按钮获取授权。"
      });
    }
  },
  onShareAppMessage() {
    return {
      title: "你好吗你好吗你毫毛你好吗你好吗你毫毛你好吗你好吗你毫毛",
      imageUrl:
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539584354&di=c4447ceab3aea25776bcea7cf215df1a&imgtype=jpg&er=1&src=http%3A%2F%2Fimg0w.pconline.com.cn%2Fpconline%2F1304%2F06%2F3243213_7.jpg"
    };
  },
  searchGoods(e) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      _GoodsList({
        page: 1,
        size: 10,
        keyword: e.detail.value
      })
        .then(data => console.log(data))
        .catch(msg => this.showMod(msg));
    }, 1000);
  },
  showMod(msg) {
    wx.showModal({
      title: "Error",
      content: msg
    });
  }
});
