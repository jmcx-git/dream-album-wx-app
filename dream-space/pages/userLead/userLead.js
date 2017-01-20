var app = getApp();
Page({
    data: {
        windowHeight: 0,
        windowWidth: 0,
        convertTimes: 2,
        items: [],
        loadStatus: false,
        nomsgs: true,
        productName: app.globalData.productName
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
        let requestData = {
            'openId': app.globalData.openId,
            'version': app.globalData.version
        };
        var url = app.globalData.serverHost + 'my//wiki/list.json';
        wx.request({
            url: url,
            data: requestData,
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
                        let newItems = res.data.data.resultList;
                        that.setData({
                            items: newItems,
                            loadStatus: true
                        })
                    }
                } else {
                    app.showWeLittleToast(that, '服务器请求异常', 'error');
                }
            },
            fail: function () {
                app.showWeLittleToast(that, '服务器请求异常', 'error');
            }
        })
    },
    toDetailPage: function (e) {
        let id = e.currentTarget.id;
        let url = '../userLeadDetail/userLeadDetail?id=' + id
        wx.navigateTo({
            url: url
        })
    }
})