// pages/haowuList/haowuList.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    haowuComp:null
  },


  onReachBottom: function () {
    this.data.haowuComp.scrollRefresh()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let haowuComp = this.selectComponent('#haowu');
    this.setData({
      haowuComp
    })
  },

})