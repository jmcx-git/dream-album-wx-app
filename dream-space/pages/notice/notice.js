var app = getApp();
var util = require('../../utils/util.js')
Page({
    data: {
        windowHeight: 0,
        windowWidth: 0,
        convertTimes: 2,
        noticeMsgs: [],
        loadStatus: false,
        nomsgs: true,
        more: true,
        startId: 0,
        msgType: 0,//0:官方 1:个人
        size: 10,
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
        let startId = that.data.startId;
        let size = that.data.size;
        let requestNewData = {
            'openId': app.globalData.openId,
            'version': app.globalData.version,
            'size': size
        };
        let requestMoreData = {
            'openId': app.globalData.openId,
            'version': app.globalData.version,
            'size': size,
            'startId': startId,
            'type': that.data.msgType
        }
        let requestData = that.data.startId == 0 ? requestNewData : requestMoreData;
        var url = app.globalData.serverHost + 'my/notice/list.json';
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
                            nomsgs: true,
                            more: false
                        })
                    } else {
                        let length = res.data.data.resultList.length;
                        let newStartId = res.data.data.resultList[length - 1].id;
                        let newItems = [];
                        if (startId == 0) {
                            newItems = res.data.data.resultList;
                        } else {
                            newItems = that.data.noticeMsgs.concat(res.data.data.resultList)
                        }
                        that.setData({
                            noticeMsgs: newItems,
                            loadStatus: true,
                            startId: newStartId,
                            more: res.data.data.more
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
    reInit: function () {
        let that = this;
        that.setData({
            nomsgs: false,
            startId: 0,
            more: true
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