var app = getApp();
Page({
    data: {
        windowHeight: 0,
        windowWidth: 0,
        convertTimes: 2,
        detailId: 0,
        itemDetail: {},
        loadStatus: false,
        nomsgs: true,
        productName: app.globalData.productName
    },
    onLoad: function (options) {
        new app.WeToast();
        let that = this;
        let detailId = options.id;
        wx.getSystemInfo({
            success: function (res) {
                let convertTimes = 750 / res.windowWidth;
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight,
                    convertTimes: convertTimes,
                    detailId: detailId
                })
            }
        })
        that.getData();
    },
    getData: function () {
        let that = this;
        let contents = [];
        for (let i = 0; i < 5; i++) {
            let content = {};
            content.content = "一分钟极简制作记录生活中的每一点感动,一分钟极简制作记录生活中的每一点感动,一分钟极简制作记录生活中的每一点感动,一分钟极简制作记录生活中的每一点感动"
            content.imgUrl = "../../image/lovedefaultcover.jpg"
            contents.push(content);
        }
        let itemDetail = that.data.itemDetail;
        itemDetail.title = "光阴之旅";
        itemDetail.time = "2018-08-08 08:08:08";
        itemDetail.content = contents;
        that.setData({
            itemDetail: itemDetail
        })
        // let id = that.data.detailId;
        // let requestData = {
        //     'openId': app.globalData.openId,
        //     'version': app.globalData.version,
        //     'id': id
        // };
        // var url = app.globalData.serverHost + 'my//wiki/detail.json';
        // wx.request({
        //     url: url,
        //     data: requestData,
        //     method: 'GET',
        //     success: function (res) {
        //         //渲染我的数据
        //         console.log(res);
        //         if (res.statusCode == 200) {
        //             if (res.data.data == null || res.data.data == '' || res.data.data == undefined) {
        //                 console.log("没有数据!")
        //                 that.setData({
        //                     nomsgs: true
        //                 })
        //             } else {
        //                 let newItem = res.data.data;
        //                 that.setData({
        //                     itemDetail: newItem,
        //                     loadStatus: true
        //                 })
        //             }
        //         } else {
        //             app.showWeLittleToast(that, '服务器请求异常', 'error');
        //         }
        //     },
        //     fail: function () {
        //         app.showWeLittleToast(that, '服务器请求异常', 'error');
        //     }
        // })
    }
})