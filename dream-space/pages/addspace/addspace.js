Page({
  data:{
    windowHeight: 0,
    windowWidth: 0,
    convertTimes: 2,
    date:'宝宝生日或预产期',
    avatarImg:'../../image/avatar3.jpg'
  },
  onLoad:function(options){
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        let convertTimes=750/res.windowWidth;
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          convertTimes: convertTimes
        })
      }
    })
  },
  formSubmit:function(e){
    console.log(e);
    wx.showToast({
      icon:'success',
      title:'添加成功'
    })
  },
  choosenImage:function(e){
    let that = this;
    wx.chooseImage({
      count: 1, 
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res){
        that.setData({
          avatarImg:res.tempFilePaths[0]
        })
      }
    })
  },
  bindDateChange: function (e) {
    this.setData({
        date: e.detail.value
    })
  }
})