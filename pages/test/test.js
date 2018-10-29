Page({
    chooseAddress() {
        wx.chooseLocation({
            success(res) {
                console.log(res)
            }
        })
    }
})