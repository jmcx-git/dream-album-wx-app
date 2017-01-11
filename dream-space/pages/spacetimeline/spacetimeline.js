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
    topData:{
      records:10,
      occupants:8,
      avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      info:'这是我的第一个相册，快来看看吧这是我的第一个相册，快来看看吧这是我的第一个相册，快来看看吧这是我的第一个相册，快来看看吧',
      occupantInfos:[
        {
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },
        {
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },{
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },{
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },{
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },{
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },{
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },{
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },{
          avatarUrl: "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
          openId:1
        },
          ],
    },
    spacetimelineList:[{
        avatarUrl:      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        nickname:'12dfffffffffffff34',
        type:0,
        authorOpenId:12,
        resourceUrl:'http://static.yingyonghui.com/article/1483498347160_a.jpg',
        content:'这个机器人还不错吧！怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧',
        timeDesc:'9分钟前',
        dateDesc:'03-19',
          likeIcons:[
            {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          },
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          },
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          },
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          },
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          },
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          }
    ],
       comments:[{
      nickname:'1234',comment:'你说的太对啦！',openId:1
    },{
      nickname:'左左',comment:'这张图片好酷呀！',openId:1
    },{
      nickname:'机器人',comment:'我是机器人，机器人就应该这样帅的以他啊糊涂',openId:1
    },{
      nickname:'花仙子',comment:'我是想不到你还会有哪出！',openId:1
    }],
    },{
        avatarUrl:      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        nickname:'1234',
        type:'1',
        authorOpenId:10,
        content:'今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀！',
        timeDesc:'9分钟前',
        dateDesc:'06-18',
          likeIcons:[
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          }
          ,
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          }
          ,
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          }
          ,
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          }
          ,
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          }
    ],
       comments:[{
      nickname:'1234',comment:'你说的太对啦！',openId:1
    },{
      nickname:'左左',comment:'这张图片好酷呀！',openId:1
    },{
      nickname:'机器人',comment:'我是机器人，机器人就应该这样帅的以他啊糊涂，你瘦啦哈哈哈',openId:1
    },{
      nickname:'花仙子',comment:'我是想不到你还会有哪出！',openId:1
    }],
    },{
        avatarUrl:      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        nickname:'1234',
        type:0,
        authorOpenId:19,
        resourceUrl:'http://static.yingyonghui.com/article/1482898206726_a.jpg',
        content:'怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧！',
        timeDesc:'9分钟前',
        dateDesc:'02-23',
          likeIcons:[
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          },
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          },
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          },
          {
            avatarUrl:"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
            openId:1
          }
    ],
       comments:[{
      nickname:'1234',comment:'你说的太对啦！',openId:1
    },{
      nickname:'左左',comment:'这张图片好酷呀！',openId:1
    },{
      nickname:'机器人',comment:'我是机器人，机器人就应该这样帅的以他啊糊涂',openId:1
    },{
      nickname:'花仙子',comment:'我是想不到你还会有哪出！',openId:1
    }],
    }]
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
    this.getSpaceTopData();
    this.getSpaceListData();
  },
  getSpaceTopData:function(){
    let that=this;
    wx.request({
      url: 'https://developer.mokous.com/space/detail.json',
      data: {
        openId:wx.getStorageSync('openId'),
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
        openId:wx.getStorageSync('openId'),
        spaceId:that.data.spaceId,
        start:that.data.start,
        size:that.data.size,
        version:''
      },
      method: 'GET',
      success: function(res){
        console.log(res);
        that.setData({
            spacetimelineList:that.data.spacetimelineList.concat(res.data.data),
            start:that.data.start+res.data.data.length
        })
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
      url: '../friends/friends?openId='+wx.getStorageInfoSync("openId")+"&spaceId="+that.data.spaceId+"&version="+that.data.version
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
        openId:wx.getStorageInfoSync("openId"),
        feedId:e.currentTarget.dataset.feedid,
        version:that.data.version,
        comment:that.data.commentContent
      },
      method: 'GET',
      success: function(res){
        var obj=new Object();
        obj.openId=wx.getStorageInfoSync("openId");
        obj.nickname=wx.getStorageInfoSync("nickname");
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
    if(e.currentTarget.dataset.openid!=wx.getStorageInfoSync("openId")){
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
                openId:wx.getStorageInfoSync("openId"),
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
      this.setData({
        createHidden:(app.globalData.createFinishFlag=='true')?false:true
      })
      if(app.globalData.createFinishFlag=='true'){
          that.getSpaceListData();
      }
    },
    toCollect:function(e){
      let that=this;
      var status=(e.currentTarget.dataset.ilike==-1)?0:-1;
      wx.request({
        url: 'https://developer.mokous.com/feed/like.json',
        data: {
          openId:wx.getStorageInfoSync("openId"),
          feedId:e.currentTarget.dataset.feedid,
          status:status,
          version:that.data.version
        },
        method: 'GET',
        success: function(res){
          var likeIconsList=that.data.spacetimelineList.likeIcons;
          for(var i=0;i<likeIconsList.length;i++){
            if(likeIconsList[i].openId == wx.getStorageInfoSync("openId")){
                if(status==-1){
                  that.data.spacetimelineList.likeIcons.splice(i,1);
                }else{
                  var obj=new Object();
                  obj.openId=wx.getStorageInfoSync("openId");
                  obj.nickname=wx.getStorageInfoSync("nickname");
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
    }
})
