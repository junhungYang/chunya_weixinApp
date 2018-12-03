
// 获取video的url
const requestVideoUrls = function (reqData) {
    var keyApi = "https://vv.video.qq.com/getkey?otype=json&platform=11&format=" + reqData.part_format_id + "&vid=" + reqData.vid + "&filename=" + reqData.filename + "&appver=3.2.19.333"
    return new Promise(resolve => {
        wx.request({
            url: keyApi,
            success: function (res) {
                var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
                var dataJson1 = dataJson.replace(/;qwe/, '');
                var data = JSON.parse(dataJson1);
                if (data.key != undefined) {
                    var vkey = data['key']
                    var url = reqData.host + reqData.filename + '?vkey=' + vkey;
                    resolve(String(url));
                }
            }
        })
    })
}


// 获取视频信息
const getVideoInfo = function (vid) {
    var urlString = 'https://vv.video.qq.com/getinfo?otype=json&appver=3.2.19.333&platform=11&defnpayver=1&vid=' + vid;
    return new Promise(resolve => {
        wx.request({
            url: urlString,
            success: function (res) {
                var dataJson = res.data.replace(/QZOutputJson=/, '') + "qwe";
                var dataJson1 = dataJson.replace(/;qwe/, '');
                var data = JSON.parse(dataJson1);
                var fn_pre = data.vl.vi[0].lnk
                var host = data['vl']['vi'][0]['ul']['ui'][0]['url']
                var streams = data['fl']['fi']
                var seg_cnt = data['vl']['vi'][0]['cl']['fc']
                if (parseInt(seg_cnt) == 0) {
                    seg_cnt = 1
                }
                var best_quality = streams[streams.length - 1]['name']
                var part_format_id = streams[streams.length - 1]['id']
                for (var i = 1; i < (seg_cnt + 1); i++) {
                    var filename = fn_pre + '.p' + (part_format_id % 10000) + '.' + i + '.mp4';
                    let reqData = {
                        part_format_id,
                        vid,
                        filename,
                        index: 'index' + i,
                        host
                    }
                    resolve(reqData);
                }

            }
        })
    })
   
}

module.exports = {
  getVideoInfo,
    requestVideoUrls
};