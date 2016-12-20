let debug = true;

var app = getApp();
let pageData = {
  data:{
    next:"下一步",
    back:"返回",
    backhidden: true,
    submodules:[],
    hiddenfooter: true,
    index:0,
    preview: false,    
    elm_fnt: false  // 元素前面的控制view是否显示（首页不需要添加照片元素的页不显示）
  },
  save: function(index){
    let submodule = this.data.submodules[index];
    submodule.translatex = this.translatex
    submodule.translatey = this.translatey
    submodule.scale = this.scalex
  },
  init:function(index){
    // console.log(this.data.submodules)
    console.log("Init");
    this.index = index;
    // init data
    let submodule = this.data.submodules[index]
    this.translatex = submodule.translatex;
    this.translatey = submodule.translatey;
    this.scalex = submodule.scale;
    this.scaley = submodule.scaley;
    let elm_fnt = submodule.elecount>0?false:true

    this.width = 300;
    this.height = 200;
    this.translateXlimit = 375 - this.width;
    this.translateYlimit = 650 - this.height;
    this.scalelimit = 150;

    // touchstap, 用于间隔tap和touch时间
    this.lasttouchstap = Date.parse(new Date())
    // 用于在点击下一步时判断是否已经选择了照片
    
    this.choosed = elm_fnt || this.mostforward >=index

    this.animation = wx.createAnimation({
      duration: 10,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0'
    })
    this.animation.translate(this.translatex, this.translatey)
    .scale(this.scalex, this.scaley).step();

    let backhidden = true;
    if(index >0){
      backhidden = false;
    }

    let length = this.data.submodules.length;
    let next = this.data.next;
    if(index == length-1){
      next= "制作"
    }else{
      next="下一步"
    }

    // 设置数据：
    this.setData({
      index: this.index,
      backhidden: backhidden,
      animation:this.animation.export(),
      elm_fnt: elm_fnt,
      next: next
    })
  },
  onLoad: function(option){
    // console.log(option)
    console.log("onLoad");
    let optionId = "moduleid";
    let that = this;    
    this.mostforward = -1;
    console.log("Before Init submodlues." + this.data.submodules.length);
    this.data.submodules = [
      {
        bgsrc:"http://img.mokous.com/album/template/mc/0.png",
        elesrc:"https://raw.githubusercontent.com/yanchunlei/res/master/ele/start0.png",
        elecount: 1,
        translatex:42,
        translatey:100,
        scale:1
      },
      {
        bgsrc:"http://img.mokous.com/album/template/mc/1.png",
        elesrc:"https://raw.githubusercontent.com/yanchunlei/res/master/ele/start0.png",
        elecount: 1,
        translatex:42,
        translatey:100,
        scale:1
      }
    ];
    console.log("Init submodlues." + this.data.submodules.length);
    this.init(0);
  },
  onReady: function(){

  },
  chooseImage: function(e){
    let timestap = Date.parse(new Date());

    if(timestap - this.lasttouchstap < 100){
      return
    }
    let that = this;
    let index = this.data.index;

    wx.chooseImage({
      sizeType:["original","compressed"],
      scourceType:["album","camera"],
      success: function(res){

        that.choosed = true;
        that.mostforward = index > that.mostforward? index: that.mostforward
        that.data.submodules[index].elesrc = res.tempFilePaths[0]
        that.setData({
          submodules: that.data.submodules
        })
      }
    })
  },
  next: function(e){
    if(!this.choosed){
      wx.showModal({
        title:"提示",
        content: "请先选择照片",
        success:function(res){}
      })
      return
    }
    let index = this.data.index;
    let length = this.data.submodules.length;
    if(index <length-1){
      this.save(index)
      this.init(++index)
    }else{      
      console.log("制作完毕");
      //gen it
      this.data.preview.imgurl = "http://img.mokous.com/album/template/mc/1.png";
    }
  },
  back: function(e){
    let index = this.data.index;
    this.init(--index)
  },
  touchstart: function(e){
    this.translate = false;
    this.scale = false;
    if(e.touches.length == 1){
      this.translate = true;
      this.p0 = e.touches[0];
      this.lastx = 0;
      this.lasty = 0;

    }else if(e.touches.length >1){
      this.scale = true;
      this.p0 = e.touches[0];
      this.p1 = e.touches[1];
    }
  },
  touchend: function(e){
    this.translate = false;
    this.scale = false;

  },
  touchmove: function(e){
    // touch step 用于间隔tap和 touch
    this.lasttouchstap = Date.parse(new Date())

    let p0 = e.touches[0]
    let tmp0x = p0.pageX - this.p0.pageX - this.lastx;
    let tmp0y = p0.pageY -  this.p0.pageY - this.lasty;
    this.lastx = p0.pageX - this.p0.pageX
    this.lasty = p0.pageY - this.p0.pageY

    if(this.translate){
      this.translatex += tmp0x;
      this.translatey += tmp0y;
      if(this.translatex > this.translateXlimit){
        this.translatex = this.translateXlimit;
      }
      if(this.translatex < 0){
        this.translatex = 0;
      }
      if(this.translatey > this.translateYlimit){
        this.translatey = this.translateYlimit;
      }
      if(this.translatey < 0){
        this.translatey = 0;
      }


      this.animation.translate(this.translatex, this.translatey).step();

    }else if(this.scale){
      let p1 = e.touches[1]
      let scalex = (p1.pageX - p0.pageX)/(this.p1.pageX - this.p0.pageX)
      let scaley = (p1.pageY - p0.pageY)/(this.p1.pageY - this.p0.pageY)
      let scalerate = (scalex + scaley)/2
      if(scalerate * this.width > this.scalelimit){
        this.animation.scale((scalex+scaley)/2).step();
      }
    }
    this.setData({
      animation:this.animation.export()
    })
  }}
Page(pageData)
