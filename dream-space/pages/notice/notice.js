var app = getApp();
Page({
    data: {
        windowHeight: 0,
        windowWidth: 0,
        convertTimes: 2,
        noticeMsgs: [],
        loadStatus: false,
        nomsgs: true,
        more: true,
        start: 0,
        size: 10
    },
    onLoad: function (options) {
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
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 5000
        })
        setTimeout(function () {
            wx.hideToast();
        }, 5000)
        that.requestData();
    },
    requestData: function () {
        let that = this;
        var url = app.globalData.serverHost + 'my/notice/list.json';
        wx.request({
            url: url,
            data: {
                'openId': app.globalData.openId,
                'version': app.globalData.version,
                'start': that.data.start,
                'size': that.data.size
            },
            method: 'GET',
            success: function (res) {
                //渲染我的数据
                console.log(res);
                if (res.statusCode == 200) {
                    if (res.data.data == null || res.data.data == '' || res.data.data.totalCount == 0) {
                        console.log("没有数据!")
                        that.setData({
                            nomsgs: true
                        })
                    } else {
                        let newStart = that.data.start + that.data.size;
                        let newItems = that.data.noticeMsgs.concat(res.data.data.resultList)
                        that.setData({
                            noticeMsgs: newItems,
                            loadStatus: true,
                            start: newStart,
                            more: res.data.data.more
                        })
                    }
                    wx.hideToast();
                } else {
                    app.errorToast(res.data.message)
                }
            },
            fail: function () {
                app.failedToast()
            }
        })
    },
    reInit: function () {
        let that = this;
        that.setData({
            noticeMsgs: [],
            nomsgs: false,
            loadStatus: false,
            start: 0,
            size: 10,
            more: false
        })
    },
    onPullDownRefresh: function () {
        let that = this;
        that.reInit();
        that.getData();
        wx.stopPullDownRefresh();
    },
    onReachBottom: function () {
        let that = this;
        if (that.data.more) {
            that.getData();
        }
    },
})