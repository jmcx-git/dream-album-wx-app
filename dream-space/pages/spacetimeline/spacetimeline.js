var app = getApp();
Page({
  data: {
    winWidth:0,
    start:0,
    size:10,
    spaceId:0,
    version:0,
    createHidden:true,
    commentHidden:true,
    commentFocus:false,
    commentContent:'',
    commentFeedIndex:0,
    topData:{},
    spacetimelineList:[]
  },
  onLoad: function (options) {
    let that=this;
     wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth:res.windowWidth
        })
      }
    })
    this.setData({
      spaceId:options.spaceId,
      version:options.version
    })
    setTimeout(function(){
      that.getSpaceTopData();
      that.getSpaceListData();
    },500)
  },
  getSpaceTopData:function(){
    let that=this;
    console.log(that.data.spaceId);
    wx.request({
      url: 'https://developer.mokous.com/space/detail.json',
      data: {
        openId:wx.getStorageSync('openId')+'',
        spaceId:that.data.spaceId,
        version:that.data.version
      },
      method: 'GET',
      success: function(res){
        that.setData({
          topData:res.data.data
        })
      },
      fail: function(rns) {
        console.log("获取顶部数据失败！");
        console.log(rns);
      }
    })
  },
  getSpaceListData:function(){
    let that=this;
    wx.request({
      url: 'https://developer.mokous.com/space/feed/list.json',
      data: {
        openId:wx.getStorageSync('openId')+'',
        spaceId:that.data.spaceId,
        start:that.data.start,
        size:that.data.size,
        version:that.data.version
      },
      method: 'GET',
      success: function(res){
        console.log("数据列表啦");
        console.log(res);
        if(res.data.status==0){
            that.setData({
              spacetimelineList:that.data.spacetimelineList.concat(res.data.data.resultList),
              start:that.data.start+res.data.data.totalCount
          })
          wx.stopPullDownRefresh();
          app.globalData.createFinishFlag=false;
        }
      },
      fail:function(rns){
        console.log("获取列表数据失败！");
        console.log(rns);
      }
    })
  },
  showAllFriends:function(e){
    let that=this;
    wx.navigateTo({
      url: '../friends/friends?openId='+wx.getStorageSync("openId")+"&spaceId="+that.data.spaceId+"&version="+that.data.version
    })
  },
  showMyRecord:function(){
    wx.navigateTo({
      url: '../myrecord/myrecord'
    })
  },
  openCreatePage:function(){
    this.setData({
      createHidden:false
    })
  },
  closeCreatePage:function(){
    this.setData({
      createHidden:true
    })
  },
  toCreateWord:function(){
    let that=this;
    wx.navigateTo({
      url: '../wordCreate/wordCreate?spaceId='+that.data.spaceId+"&version="+that.data.version
    })
  },
  tocratePhoto:function(e){
    let that=this;
    wx.navigateTo({
      url: '../photoCreate/photoCreate?spaceId='+that.data.spaceId+"&version="+that.data.version
    })
  },
  toreplay:function(e){
    this.setData({
      commentHidden:false,
      commentFocus:true,
      commentFeedIndex:e.currentTarget.dataset.feedindex
    })
  },
  saveComment:function(e){
    let that=this;
    console.log("保存评论");
    console.log("评论内容内容："+that.data.commentContent);
    wx.request({
      url: 'https://developer.mokous.com/space/feed/comment/add.json',
      data: {
        openId:wx.getStorageSync("openId"),
        feedId:e.currentTarget.dataset.feedid,
        version:that.data.version,
        comment:that.data.commentContent
      },
      method: 'GET',
      success: function(res){
        var obj=new Object();
        obj.openId=wx.getStorageSync("openId");
        obj.nickname=wx.getStorageSync("nickname");
        obj.comment=that.data.commentContent;
        ((that.data.spacetimelineList)[that.data.commentFeedIndex].comments).unshift(obj);
        that.setData({
          spacetimelineList:that.data.spacetimelineList
        })
      },
      fail: function(ron) {
        console.log("评论失败！");
        console.log(ron);
      }
    })
  },
  hideComment:function(e){
    let that=this;
    this.setData({
      commentContent:e.detail.value
    })
  },
  showSpaceDetail:function(){
    wx.navigateTo({
      url: '../addspace/addspace'
    })
  },
  showPersonalPage:function(e){
    console.log("openId="+e.currentTarget.dataset.openid);
    let that=this;
    wx.navigateTo({
      url: '../psersonalPage/psersonalPage?openId='+e.currentTarget.dataset.openid+"&spaceId="+that.data.spaceId+"&version="+that.data.version
    })
  },
  previewImage:function(e){
    var urls=[];
    urls.push(e.currentTarget.dataset.src);
    wx.previewImage({
      urls: urls
    })
  },
  delComment:function(e){
    let that=this;
    if(e.currentTarget.dataset.openid!=wx.getStorageSync("openId")){
      return;
    }
    console.log(e);
    wx.showActionSheet({
      itemList:['删除'],
      success:function(res){
        if(res.tapIndex==0){
          that.showModal(e.currentTarget.dataset.feedid,e.currentTarget.dataset.commentid,e.currentTarget.dataset.feedindex,e.currentTarget.dataset.commentindex);
        }
      }
    })
  },
  showModal:function(feedid,commentid,feedindex,commentindex){
    let that=this;
    wx.showModal({
        title:'提示',
        content:'是否确定要删除这条评论?',
        showCancel:true,
        success:function(ron){
          if(ron.confirm){
            console.log("删除成功！");
            wx.request({
              url: 'https://developer.mokous.com/space/feed/comment/delete.json',
              data: {
                openId:wx.getStorageSync("openId"),
                feedId:feedid,
                commentId:commentid,
                version:that.data.version
              },
              method: 'GET',
              success: function(res){
                ((that.data.spacetimelineList)[feedindex].comments).splice(commentindex,1);
                that.setData({
                  spacetimelineList:that.data.spacetimelineList
                })
              },
              fail: function(rps) {
                console.log("删除评论失败！");
                console.log(rps);
              }
            })
          }
        }
      })
  },
  showHandle:function(e){
    let that=this;
     wx.showActionSheet({
      itemList:['删除'],
      success:function(res){
        if(res.tapIndex==0){
          wx.showModal({
            title:'提示',
            content:'是否确定要删除这条记录?',
            showCancel:true,
            success:function(ron){
              if(ron.confirm){
                //做删除操作
                console.log("删除成功！");
                that.data.spacetimelineList.splice(e.currentTarget.dataset.index,1);
                that.setData({
                  spacetimelineList:that.data.spacetimelineList
                })
              }
            }
          })
        }
      }
    })
  },
  hideCommentWindow:function(e){
    let that=this;
    setTimeout(function(){
        that.setData({
          commentHidden:true,
          commentFocus:false   
        })
    },500)
  },
  onShow:function(){
    console.log("show:"+app.globalData.createFinishFlag);
    let that=this;
    if(app.globalData.createFinishFlag){
        that.setData({
          start:0,
          createHidden:true,
          spacetimelineList:[]
        })
        setTimeout(function(){
           that.getSpaceListData();
        },500)
    }
    },
    toCollect:function(e){
      let that=this;
      var status=(e.currentTarget.dataset.ilike==-1)?0:-1;
      wx.request({
        url: 'https://developer.mokous.com/feed/like.json',
        data: {
          openId:wx.getStorageSync("openId"),
          feedId:e.currentTarget.dataset.feedid,
          status:status,
          version:that.data.version
        },
        method: 'GET',
        success: function(res){
          var likeIconsList=that.data.spacetimelineList.likeIcons;
          for(var i=0;i<likeIconsList.length;i++){
            if(likeIconsList[i].openId == wx.getStorageSync("openId")){
                if(status==-1){
                  that.data.spacetimelineList.likeIcons.splice(i,1);
                }else{
                  var obj=new Object();
                  obj.openId=wx.getStorageSync("openId");wx.getsto
                  obj.nickname=wx.getStorageSync("nickname");
                  obj.ilike=-1;
                  that.data.spacetimelineList.likeIcons.unshift(obj);
                }
                setTimeout(function(){
                    that.setData({
                      spacetimelineList:that.data.spacetimelineList
                    })
                },500)
            }
          }
        },
        fail: function(ron) {
          console.log("赞操作失败!");
          console.log(ron);
        }
      })
    },
    onPullDownRefresh:function(){
      let that=this;
      that.setData({
        start:0,
        topData:{},
        spacetimelineList:[]
      })
      app.globalData.createFinishFlag=false;
      that.getSpaceTopData();
      that.getSpaceListData();
    }
})
