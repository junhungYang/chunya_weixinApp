import { _SpreadList} from '../../../utils/request'
const app = getApp();
Component({
    properties: {
        hasToken: {
            type: Boolean,
            observer(newVal,oldVal,changedPath) {
                console.log(newVal,oldVal,changedPath)
            }
        }
    },

  data: {
    adList:[]
  }, // 私有数据，可用于模版渲染
  methods: {
    navToGoodDetail(e) {
        if(this.properties.hasToken) {
            let url = e.currentTarget.dataset.item.link
            wx.navigateTo({
                url
            })
        }
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {
        _SpreadList({
            id: 4
        }).then(data => {
            this.setData({
                adList:data.adList
            })
        })
        .catch(msg => {
            wx.showModal({
                title: "Error",
                content: msg
            });
        })
    }
  }
});