import { _SpreadList} from '../../../utils/request'
const app = getApp();
Component({

  data: {
    adList:[]
  }, // 私有数据，可用于模版渲染
  created() {
      _SpreadList({
          id: 4
      }).then(data => {
          this.setData({
              adList: data.adList
          })
      })
          .catch(msg => {
              wx.showModal({
                  title: "Error",
                  content: msg
              });
          })
  },
  methods: {
    navToGoodDetail(e) {
        if(app.globalData.token) {
            let url = e.currentTarget.dataset.item.link
            wx.navigateTo({
                url
            })
        }
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
  }
});