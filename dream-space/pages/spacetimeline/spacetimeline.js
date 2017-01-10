//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    winWidth:0,
    userInfo: {},
    createHidden:true,
    commentHidden:true,
    commentFocus:false,
     avatarUrlsTop:[
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"

    ],
    spacetimelineList:[{
        avatarUrl:      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        nickName:'1234',
        squareTag:'图片',
        squareImageUrl:'http://static.yingyonghui.com/article/1483498347160_a.jpg',
        squareImageDesc:'这个机器人还不错吧！怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧',
          avatarUrls:[
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"

    ],
       replayList:[{
      nickName:'1234',content:'你说的太对啦！'
    },{
      nickName:'左左',content:'这张图片好酷呀！'
    },{
      nickName:'机器人',content:'我是机器人，机器人就应该这样帅的以他啊糊涂'
    },{
      nickName:'花仙子',content:'我是想不到你还会有哪出！'
    }],
    },{
        avatarUrl:      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        nickName:'1234',
        squareTag:'文字',
        squareContentText:'今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀今天真的是个好日子呀呀！',
          avatarUrls:[
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
    ],
       replayList:[{
      nickName:'1234',content:'你说的太对啦！'
    },{
      nickName:'左左',content:'这张图片好酷呀！'
    },{
      nickName:'机器人',content:'我是机器人，机器人就应该这样帅的以他啊糊涂，你瘦啦哈哈哈'
    },{
      nickName:'花仙子',content:'我是想不到你还会有哪出！'
    }],
    },{
        avatarUrl:      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
        nickName:'1234',
        squareTag:'图片',
        squareImageUrl:'http://static.yingyonghui.com/article/1482898206726_a.jpg',
        squareImageDesc:'怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧怎么样样，这个美女不错吧！',
          avatarUrls:[
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0",
      "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
      ,"http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLen1EUeUia9lj733vTQRfWqZnq7zEMvGuP8MDesGgMfpruSC00apA66XQdic1TRCmuw9NnAloS6hpw/0"
    ],
       replayList:[{
      nickName:'1234',content:'你说的太对啦！'
    },{
      nickName:'左左',content:'这张图片好酷呀！'
    },{
      nickName:'机器人',content:'我是机器人，机器人就应该这样帅的以他啊糊涂'
    },{
      nickName:'花仙子',content:'我是想不到你还会有哪出！'
    }],
    }]
  },
  onLoad: function () {
    console.log('onLoad');
    let that=this;
    wx.getUserInfo({
      success: function(res){
        that.setData({
          userInfo:res.userInfo
        })
        console.log(res);
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth:res.windowWidth
        })
      }
    })
    console.log(that.data.winWidth);
  },
  showAllFriends:function(){
    wx.navigateTo({
      url: '../friends/friends'
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
    wx.navigateTo({
      url: '../wordCreate/wordCreate'
    })
  },
  tocratePhoto:function(){
    wx.navigateTo({
      url: '../photoCreate/photoCreate'
    })
  },
  toreplay:function(){
    this.setData({
      commentHidden:false,
      commentFocus:true    
    })
  },
  hideComment:function(){
    let that=this;
    setTimeout(function(){
        that.setData({
          commentHidden:true,
          commentFocus:false   
        })
    },3000)
  },
  onShow:function(){
    console.log("show:"+app.globalData.createFinishFlag);
      this.setData({
        createHidden:(app.globalData.createFinishFlag=='true')?false:true
      })
    }
})
