var app = getApp();
Page({
    data: {
        windowHeight: 0,
        windowWidth: 0,
        convertTimes: 2,
        openId: '',
        fromOpenId: '',
        spaceId: 0,
        name: '',
        avatarUrl: '',
        bornDate: '',
        spaceType: 0
    },
    onLoad: function (options) {
        let that = this;
        let openId = options.openId;
        let fromOpenId = options.fromOpenId;
        let spaceId = options.spaceId;
        wx.getSystemInfo({
            success: function (res) {
                let convertTimes = 750 / res.windowWidth;
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    convertTimes: convertTimes,
                    openId: openId,
                    fromOpenId: fromOpenId,
                    spaceId: spaceId,
                })
            }
        })
        that.requestInfo();
    },
    requestInfo: function () {
        let that = this;
        let openId = that.data.openId;
        let fromOpenId = that.data.fromOpenId;
        let spaceId = that.data.spaceId;
        wx.request({
            url: app.globalData.serverHost + 'info.json',
            data: {
                openId: openId,
                spaceId: spaceId,
                version: app.globalData.version
            },
            method: 'GET',
            success: function (res) {
                console.log(res);
                if (res.statusCode == 200 && res.data.status == 0) {
                    that.setData({
                        name: res.data.data.name,
                        avatarUrl: res.data.data.icon,
                        bornDate: res.data.data.bornDate,
                        spaceType: res.data.data.type
                    })
                } else {
                    app.showWeLittleToast(that,'服务器请求异常','error');
                }
            },
            fail: function () {
                app.showWeLittleToast(that,'服务器请求异常','error');
            }
        })
    },
    confirmJoin: function () {
        let that = this;
        let openId = that.data.openId;
        let fromOpenId = that.data.fromOpenId;
        let spaceId = that.data.spaceId;
        wx.request({
            url: app.globalData.serverHost + 'join.json',
            data: {
                openId: openId,
                fromOpenId: fromOpenId,
                spaceId: spaceId,
                version: app.globalData.version
            },
            method: 'GET',
            success: function (res) {
                if (res.statusCode == 200 && res.data.status == 0) {
                    wx.redirectTo({
                        url: '../spacetimeline/spacetimeline?spaceId=' + spaceId + "&version=" + app.globalData.version
                    })
                } else {
                    app.showWeLittleToast(that,'服务器请求异常','error');
                }
            },
            fail: function () {
                app.showWeLittleToast(that,'服务器请求异常','error');
            }
        })
    }
})