import { _OrderDetail} from '../../utils/request'
const App = getApp()
var that;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderDetail: [],
        id: null,
        fatherFrom: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        that = this
        this.setData({
            id: options.orderId,
            fatherFrom: options.fatherFrom
        })
        App.setWatcher(App.globalData, this.watch)
        if(App.globalData.token) {
            this.getDetail()
        }
    },
    getDetail() {
        _OrderDetail({
            orderId: this.data.id
        }).then(data => {
            this.setData({
                orderDetail: data
            })
        }).catch(data => App.catchError(data))
    },
    navToControl(e) {
        let from = e.currentTarget.dataset.from
        wx.navigateTo({
            url: `../refundControl/refundControl?from=${from}&fatherFrom=${this.data.fatherFrom}&orderId=${this.data.id}`
        })
    },
    watch:{
        token(nV) {
            if(nV) {
                that.getDetail()
            }
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

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