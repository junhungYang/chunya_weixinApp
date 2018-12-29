// pages/yuanDanEvent/yuanDanEvent.js
const App = getApp();
var that;
import { _CouponAdd} from '../../utils/request'

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this;
        App.setWatcher(App.globalData, this.watch)
        wx.showLoading({
            title: '正在加载',
            mask: true
        })
        if(App.globalData.token) {
            setTimeout(() => {
                wx.hideLoading();
            }, 1500);
        }
    },
    navToGoodDetail(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `../goodDetail/goodDetail?goodId=${id}`
        });
    },
    getCoupon() {
        _CouponAdd({
            couponId: 35
        }).then((data) => {
            wx.showToast({
                title: '领取成功',
                icon: 'success'
            })
            }).catch(data => App.catchError(data))
    },
    watch: {
        token(nV) {
            if(nV) {
                setTimeout(() => {
                    wx.hideLoading()
                }, 1500);
            }
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})