var app = getApp();
Page({
    data: {
        windowHeight: 0,
        windowWidth: 0,
        convertTimes: 2,
        aboutInfo: {}
    },
    onLoad: function (options) {
        new app.WeToast();
        let that = this;
        wx.getSystemInfo({
            success: function (res) {
                let convertTimes = 750 / res.windowWidth;
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    convertTimes: convertTimes
                })
            }
        })
        that.getData();
    },
    getData: function () {
        let that = this;
        wx.request({
            url: app.globalData.serverHost + 'my/about/us.json',
            data: {
                'openId': app.globalData.openId,
                'version': app.globalData.version
            },
            method: 'GET',
            success: function (res) {
                console.log(res);
                if (res.statusCode == 200 && res.data.status == 0) {
                    that.setData({
                        aboutInfo: res.data.data,
                    })
                } else {
                    app.showWeLittleToast(that, '服务器请求异常', 'error');
                }
            },
            fail: function () {
                app.showWeLittleToast(that, '服务器请求异常', 'error');
            }
        })
    },
    viewImg: function (e) {
        let url = e.currentTarget.dataset.url;
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: [url] // 需要预览的图片http链接列表
        })
    },
    onShareAppMessage: function () {
        return {
            title: '关于' + app.globalData.productName, // 分享标题
            desc: '这里有' + app.globalData.productName + '团队的联系方式', // 分享描述
            path: '/pages/about/about' // 分享路径
        }
    }
})