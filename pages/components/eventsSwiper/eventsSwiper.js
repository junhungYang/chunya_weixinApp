import { _SpreadList} from '../../../utils/request'
const app = getApp();
Component({
  properties: {
    commonwealList: {
      // 属性名
      type: Array, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
    }
  },

  created() {

  },
  methods: {
      swiperEvent(e) {
          app.globalData.publicSwiperIndex = e.detail.current +1
          console.log(app.globalData.publicSwiperIndex);
      },
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
  }
});