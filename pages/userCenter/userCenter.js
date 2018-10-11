
// pages/userCenter/userCenter.js

import { 
  _OrderCheckout,
  _OrderSubmit,
  _WeChatPay
} from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  pay() {
    _OrderCheckout().then(data => {
      let addressId = 10
      _OrderSubmit({ addressId }).then( data => {
        let orderId = data.orderInfo.id
        _WeChatPay({orderId}).then()
      }
      )
    })
  },
  pay1() {
    wx.requestPayment({
      timeStamp: "1490840662",
      appId: "wxd678efh567hg6787",
      nonceStr: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
      package: "prepay_id=wx2017033010242291fcfe0db70013231072",
      signType: "paySign = MD5(appId=wxd678efh567hg6787&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=1490840662&key=qazwsxedcrfvtgbyhnujmikolp111111) = 22D9B4E54AB1950F51E0649E8810ACD6",
      paySign: "123456",
      success:function() {
        console.log(111)
      },
      fail:function(res) {
        console.log(res)
      }
    });
  }
})