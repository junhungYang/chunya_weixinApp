// pages/nuanke/nuanke.js
import {
    _WarmclassList,
    _WarmclassPay,
    _CollectAddorDelete
} from "../../utils/request";
const App = getApp()
var that
Page({
    /**
     * 页面的初始数据
     */
    data: {
        navIndex: 1,
        list: ['', '', '', ''],
        page: 1,
        payBtnHidden: true,
        payId: '',
        activePrice: 0,
        totalPages: 0,
        isPay: 0
    },
    onLoad: function (options) {
        that = this
        App.setWatcher(App.globalData, this.watch)
        this.setData({ isPay: options.isPay })
        App.globalData.token ? this.getList() : ''
    },
    watch: {
        token(newValue) {
            if (newValue) {
                that.getList();
            }
        }
    },
    getList() {
        wx.showLoading({
            title: '正在加载',
            mask: true
        })
        _WarmclassList({
            page: this.data.page,
            type: this.data.navIndex,
            size: 10,
            isPay: this.data.isPay
        }).then(data => {
            this.initList(data, 1)
        }).catch(data => App.catchError(data))
    },
    initList(data, type) {
        let arr = this.data.list
        this.
            this.setData({
                list: arr,
                totalPages: data.totalPages
            })
        console.log(this.data.list)
        setTimeout(() => {
            wx.hideLoading()
        }, 600);
    },
    navToDetail(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `../nuankeDetail/nuankeDetail?warmClassId=${id}`
        });
    },
    changeNav(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            navIndex: index,
            page: 1,
            list: []
        })
        this.getList()
    },
    showPayBtn(e) {
        let isPay = e.currentTarget.dataset.ispay
        let activePrice = e.currentTarget.dataset.price
        let isFree = e.currentTarget.dataset.isfree
        this.setData({
            payId: e.currentTarget.dataset.id
        })
        if (isFree || isPay) {
            wx.navigateTo({
                url: `../nuankeDetail/nuankeDetail?warmClassId=${this.data.payId}`
            });
        } else {
            this.setData({
                payBtnHidden: false,
                activePrice
            });
        }
    },
    hiddenPayBtn() {
        this.setData({
            payBtnHidden: true
        })
    },
    scrollRefreshList(e) {
        if (this.data.page < this.data.totalPages) {
            this.setData({
                page: this.data.page + 1
            })
            this.getList();
        } else {
            App.theEndPage()
        }

    },
    collect(e) {
        let valueId = e.currentTarget.dataset.id;
        let index = e.currentTarget.dataset.index;
        let list = this.data.list
        _CollectAddorDelete({
            typeId: 1,
            valueId
        }).then((data) => {
            if (this.data.navIndex !== 4) {
                if (data.type === "delete") {
                    list[index].isCollected = 0
                } else {
                    list[index].isCollected = 1
                }
                this.setData({
                    list
                })
            } else {
                list.splice(index, 1);
                this.setData({
                    list
                })
            }
        }).catch(data => App.catchError(data))
    },
    nuankePay(e) {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            _WarmclassPay({
                id: this.data.payId
            }).then(data => {
                this.wxPay(data)
            }).catch(data => App.catchError(data))
        }, 250);
    },
    wxPay(data) {
        wx.requestPayment({
            timeStamp: data.timeStamp,
            appId: data.appId,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success: (res) => {
                wx.showToast({
                    title: "成功结算"
                });
                setTimeout(() => {
                    wx.navigateTo({
                        url: `../nuankeDetail/nuankeDetail?warmClassId=${this.data.payId}`
                    });
                }, 500);
            }
        });
    },
    showModal(msg) {
        wx.showModal({
            title: msg
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () { },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () { },

    /**
     * 页面上拉触底事件的处理函数
     */

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        wx.showShareMenu();
    }
});