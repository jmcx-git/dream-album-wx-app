let pageData = {
    data:{
        activitylist: []
    },
    onLoad:function(option){
        let activitylist = [
            {id:0,title:"标题1标题1标题1标题1标题1标题1标题1",description:"在分析前，我们要确认下这个游戏能不能汉化，安装游戏，在pak文件中搜索相关的游戏文本，然后修改掉，然后进到游戏中查看，如果不能正常显示，那么我们还要考虑下字体问题"},
            {id:0,title:"标题2",description:"活动2描述"},
            {id:0,title:"标题3",description:"活动3描述"},
            {id:0,title:"标题4",description:"活动4描述"}]
        this.setData({
            activitylist:activitylist
        })
    },
    showdetail: function(e){
        wx.navigateTo({
          url: '../activitydetail/activitydetail'
        })
    },
    icontap :function(e){
      console.log(e)
    }
}
Page(pageData)
