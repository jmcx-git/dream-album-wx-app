var app = getApp();
Page({
  data: {
    winWidth:0,
    start:0,
    size:10,
    spaceId:0,
    version:0,
    myOpenId:'',
    createHidden:true,
    commentHidden:true,
    commentFocus:false,
    commentContent:'',
    commentFeedIndex:0,
    commentFeedId:0,
    commentDefaultValue:'',
    topData:{},
    spacetimelineList:[],
    noMoreData:false,
    noContentHidden:true
  },
  onLoad: function (options) {
    var owner=options.owner;
    if(owner!=undefined && owner!=null && owner!=''){
      app.globalData.fromOpenId=options.fromOpenId;
      app.globalData.spaceId=options.spaceId;
      app.globalData.redirectRefer=1;
      app.globalData.owner=options.owner;
       wx.switchTab({
         url: '../index/index'
       })
    }else{
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
        version:options.version,
        myOpenId:wx.getStorageSync('openId')      
      })
      setTimeout(function(){
        that.getSpaceTopData();
        that.getSpaceListData();
      },200)
    }
  },
  getSpaceTopData:function(){
    let that=this;
    wx.request({
      url: app.globalData.serverHost+'detail.json',
      data: {
        openId:wx.getStorageSync('openId'),
        spaceId:that.data.spaceId,
        version:that.data.version
      },
      method: 'GET',
      success: function(res){
        console.log("获取顶部数据");
        console.log(res);
        if(res.data.data.icon==null || res.data.data.icon==''){
          res.data.data.icon=(res.data.data.type==0)?'../../familydefault.png':'../../image/lovedefault.png';
        }
        that.setData({
          topData:res.data.data
        })
        app.globalData.modifySpaceInfoFlag=false;
        wx.setNavigationBarTitle({
          title: res.data.data.name
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
    console.log("获取数据了了，start="+that.data.start+",size="+that.data.size);
    wx.request({
      url: app.globalData.serverHost+'feed/list.json',
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
          if(res.data.data.resultList.length<that.data.size){
            console.log("到底了，别脱了");
            that.setData({
              noMoreData:true,
              
            })
          }
          console.log("noMoreData="+that.data.noMoreData);
          for(var i=0;i<res.data.data.resultList.length;i++){
            var date=(((res.data.data.resultList)[i]).dateDesc).split("-");
            if(date.length>1){
              ((res.data.data.resultList)[i]).month=date[0];
              ((res.data.data.resultList)[i]).day=date[1];
              ((res.data.data.resultList)[i]).dateflag=true;
            }else{
              ((res.data.data.resultList)[i]).dateflag=false;
            }
          }
            that.setData({
              spacetimelineList:that.data.spacetimelineList.concat(res.data.data.resultList),
              start:that.data.start+res.data.data.resultList.length
          })
          that.setData({
            noContentHidden:that.data.spacetimelineList.length>0?false:true
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
      url: '../friends/friends?spaceId='+that.data.spaceId+"&version="+that.data.version+"&secert="+that.data.topData.secert+"&name="+that.data.topData.name
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
      commentFeedIndex:e.currentTarget.dataset.feedindex,
      commentFeedId:e.currentTarget.dataset.feedid,
    })
  },
  saveComment:function(e){
    let that=this;
    var content=e.detail.value.commentContent;
    console.log("content="+content);
    if(content=='' || content==null || content==undefined){
      return;
    }
    wx.request({
      url: app.globalData.serverHost+'feed/comment/add.json',
      data: {
        openId:wx.getStorageSync("openId"),
        feedId:that.data.commentFeedId,
        version:that.data.version,
        comment:content
      },
      method: 'GET',
      success: function(res){
        var obj=new Object();
        obj.openId=wx.getStorageSync("openId");
        obj.nickname=wx.getStorageSync("nickName");
        obj.comment=content;
        ((that.data.spacetimelineList)[that.data.commentFeedIndex].comments).unshift(obj);
        that.setData({
          spacetimelineList:that.data.spacetimelineList,
          commentHidden:true,
          commentDefaultValue:''
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
  showSpaceDetail:function(e){
    let that=this;
    wx.navigateTo({
      url: "../modifySpaceInfo/modifySpaceInfo?spaceId="+that.data.spaceId+"&version="+that.data.version+"&secert="+that.data.topData.secert
    })
  },
  showPersonalPage:function(e){
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
            wx.request({
              url: app.globalData.serverHost+'feed/comment/delete.json',
              data: {
                openId:wx.getStorageSync("openId"),
                feedId:feedid,
                commentId:commentid,
                version:that.data.version
              },
              method: 'GET',
              success: function(res){
                console.log("删除成功！");
                console.log(res);
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
                wx.request({
                  url: app.globalData.serverHost+'feed/del.json',
                  data: {
                    openId:wx.getStorageSync('openId'),
                    feedId:e.currentTarget.dataset.feedid,
                    version:that.data.version
                  },
                  method: 'GET',
                  success: function(res){
                    that.data.spacetimelineList.splice(e.currentTarget.dataset.index,1);
                    that.setData({
                      spacetimelineList:that.data.spacetimelineList
                    })
                  },
                  fail: function(ron) {
                    console.log("删除失败");
                    console.log(ron);
                  }
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
          commentFocus:false,
          // commentDefaultValue:''
        })
    },500)
  },
  onShow:function(){
    console.log("我在onshow");
    console.log("show:"+app.globalData.createFinishFlag);
    let that=this;
    if(app.globalData.createFinishFlag){
        that.setData({
          start:0,
          createHidden:true,
          spacetimelineList:[]
        })
        setTimeout(function(){
          that.getSpaceTopData();
          that.getSpaceListData();
        },500)
    }
    if(app.globalData.modifySpaceInfoFlag){
        setTimeout(function(){
          that.getSpaceTopData();
        },500)
    }
    },
    toCollect:function(e){
      let that=this;
      var status=(e.currentTarget.dataset.ilike==-1)?0:-1;
      wx.request({
        url: app.globalData.serverHost+'feed/like.json',
        data: {
          openId:wx.getStorageSync("openId"),
          feedId:e.currentTarget.dataset.feedid,
          status:status,
          version:that.data.version
        },
        method: 'GET',
        success: function(res){
          var likeIconsList=((that.data.spacetimelineList)[e.currentTarget.dataset.feedindex]).likeIcons;
          if(likeIconsList.length==0 || status==0){
            var obj=new Object();
            obj.openId=wx.getStorageSync("openId");
            obj.nickName=wx.getStorageSync("nickName");
            obj.avatarUrl=wx.getStorageSync('avatarUrl');
            ((that.data.spacetimelineList)[e.currentTarget.dataset.feedindex]).ilike=0;
            ((that.data.spacetimelineList)[e.currentTarget.dataset.feedindex]).likeIcons.unshift(obj);
            setTimeout(function(){
                that.setData({
                  spacetimelineList:that.data.spacetimelineList
                })
            },500)
          }else{
            for(var i=0;i<likeIconsList.length;i++){
              if(likeIconsList[i].openId == wx.getStorageSync("openId")){
                  ((that.data.spacetimelineList)[e.currentTarget.dataset.feedindex]).likeIcons.splice(i,1);
                  ((that.data.spacetimelineList)[e.currentTarget.dataset.feedindex]).ilike=-1;
                  setTimeout(function(){
                      that.setData({
                        spacetimelineList:that.data.spacetimelineList
                      })
                  },300)
              }
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
        spacetimelineList:[],
        noMoreData:false
      })
      app.globalData.createFinishFlag=false;
      setTimeout(function(){
        that.getSpaceTopData();
        that.getSpaceListData();
      },200);
      
    },
    onReachBottom:function(){
      let that=this;
      if(!that.data.noMoreData){
        that.getSpaceListData();
      }
    },
    changeCover:function(e){
      let that=this;
      if(that.data.topData.secert==null || that.data.topData.secert=='' || that.data.topData.secert==undefined){
        return;
      }
      wx.showActionSheet({
        itemList:['更换相册封面'],
        success:function(res){
          if(res.tapIndex==0){
            wx.chooseImage({
              count: 1,
              sizeType: ['original', 'compressed'],
              sourceType: ['album', 'camera'],
              success: function(rps){
                wx.uploadFile({
                  url: app.globalData.serverHost+'cover/edit.json',
                  filePath:rps.tempFilePaths[0],
                  name:'image',
                  formData: {
                    openId:wx.getStorageSync('openId'),
                    spaceId:that.data.spaceId,
                    version:that.data.version
                  },
                  success: function(rns){
                    console.log("上传成功");
                    console.log(rns);
                    that.data.topData.cover=rps.tempFilePaths[0];
                    that.setData({
                      topData:that.data.topData
                    })
                  },
                  fail: function(rfs) {
                    console.log("上传图片失败");
                    console.log(rfs);
                  }
                })
              }
            })
          }
        }
      })
    },
    //分享
    onShareAppMessage:function(){
      let that=this;
      var fromOpenId=wx.getStorageSync('openId');
      var spaceId=that.data.spaceId;
      var owner=(that.data.topData.secert==null || that.data.topData.secert=='' || that.data.topData.secert==undefined)?0:1;
      var queryStr="/pages/spacetimeline/spacetimeline?fromOpenId="+fromOpenId+"&spaceId="+spaceId+"&owner="+owner;
      var ownerTitle=wx.getStorageSync('nickName')+"邀请您入住他(她)的私密空间"+that.data.topData.name;
      var guestTitle=wx.getStorageSync('nickName')+"邀请您使用"+app.globalData.productName;
      var ownerContent='这是属于我们的秘密';
      var guestContent="用它，您可以记录，分享您的珍贵时刻。"
      return {
        title:owner==0?guestTitle:ownerTitle,
        desc:owner==0?guestContent:ownerContent,
        path:queryStr
      }
    }
})
