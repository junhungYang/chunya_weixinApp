import { _HaowuList, _GoodsList, _SendFormid } from "../../../utils/request";
const App = getApp();
Component({
  data: {
    fatherList: [],
    page: 1,
    totalPages: 0,
  },
  properties: {
    ishot:Number
  },
  created() {
    this.getHaowuList()
  },
  methods: {
    getHaowuList() {
      let length = this.data.fatherList.length
      _HaowuList({
        page: this.data.page,
        size: 3
      }).then(data => {
        this.setData({
          fatherList: [...this.data.fatherList, ...data.data],
          totalPages: data.totalPages
        })
        data.data.forEach((item, index) => {
          this.changeChildPage(length + index, 1)
        })
        setTimeout(() => {
          wx.hideLoading()
        }, 600);
      }).catch(data => App.catchError(data))
    },
    changeChildPage(targetIndex, page) {
      let fatherList = this.data.fatherList
      _GoodsList({
        page,
        categoryId: fatherList[targetIndex].id,
        size: 30,
        isHot: this.data.ishot
      }).then(childData => {
        fatherList[targetIndex].subCategoryList = childData;
        setTimeout(() => {
          wx.hideLoading()
        }, 500);
        this.setData({
          fatherList
        })
      }).catch(data => App.catchError(data))
    },
    changePageEnter(e) {
      let page = e.currentTarget.dataset.page
      let type = e.currentTarget.dataset.type
      let targetIndex = e.currentTarget.dataset.targetindex
      let fatherList = this.data.fatherList
      if (type === 'add') {
        if (fatherList[targetIndex].subCategoryList.data.length !== 0) {
          this.changeChildPage(targetIndex, page += 1);
          wx.showLoading({
            title: '正在加载',
            mask: true
          })
        } else {
          wx.showToast({
            title: "产品上新中，敬请期待",
            icon: "none",
            duration: 1000
          });
        }
      } else {
        if (page === 1) {
          wx.showToast({
            title: '已经是第一页',
            icon: 'none',
            duration: 1000
          })
        } else {
          this.changeChildPage(targetIndex, page -= 1);
          wx.showLoading({
            title: '正在加载',
            mask: true
          })
        }
      }
    },
    navToGoodDetail(e) {
      if(App.globalData.token) {
        let goodId = e.currentTarget.dataset.goodid;
        wx.navigateTo({
          url: `../goodDetail/goodDetail?goodId=${goodId}`
        });
      }else {
        this.switchToLogin()
      }
    },
    switchToLogin() {
      wx.showModal({
        title: "提示",
        content: "请先进行登录操作",
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: "../cart/cart"
            });
          }
        }
      });
    },
    formSubmit_collect: function (e) {
      let fromid = `${e.detail.formId}`;
      let userInfoStorage = wx.getStorageSync('userInfo')
      if (fromid && userInfoStorage) {
        let openid = JSON.parse(userInfoStorage).openId
        _SendFormid({
          fromid,
          openid
        })
      }
    },
    scrollRefresh() {
      if (this.data.page < this.data.totalPages) {
        this.setData({
          page: this.data.page + 1
        })
        wx.showLoading({
          title: '正在加载'
        })
        this.getHaowuList()
      } else {
        App.theEndPage()
      }
    }
  }
});