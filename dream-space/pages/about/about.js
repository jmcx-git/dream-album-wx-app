var app = getApp();
Page({
    data: {
        windowHeight: 0,
        windowWidth: 0,
        convertTimes: 2
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
    },
    onShareAppMessage: function () {
        return {
            title: '关于我们', // 分享标题
            desc: '联系方式', // 分享描述
            path: '/pages/about/about' // 分享路径
        }
    }
})