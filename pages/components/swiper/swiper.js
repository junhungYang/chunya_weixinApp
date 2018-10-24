import { _SpreadList} from '../../../utils/request'

Component({
  behaviors: [],


  data: {
    adList:[]
  }, // 私有数据，可用于模版渲染



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