import { _SpreadList} from '../../../utils/request'
const app = getApp();
Component({
  data: {
    list: [[1,2],[2,3],[3,4],[4,5]]
  },


  created() {

  },
  methods: {
      swiperEvent(e) {
          app.globalData.publicSwiperIndex = e.detail.current +1
      },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
  }
});