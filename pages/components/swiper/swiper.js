import { _SpreadList} from '../../../utils/request'

Component({
  behaviors: [],


  data: {
    background: ["demo-text-1", "demo-text-2", "demo-text-3"]
  }, // 私有数据，可用于模版渲染



  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function() {
        _SpreadList({
            id: 1
        }).then(data => {
            // wx.setData({
            //     background:data.adList
            // })
    
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