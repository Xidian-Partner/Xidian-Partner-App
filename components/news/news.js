
// components/news/news.js
import {deleteBlog,completeBlog,likeBlog,readBlog} from "../../utils/apis"
var app=getApp()
Component({
  properties:{
    viewTimes:{
      type:Number,
      value:''
    },
    canJump:{
      type:Boolean,
      value:true
    },
    showMore:{
      type:Boolean,
      value:false
    },
    mId:{
      type:Number,
      value:''
    },
      otherId:{
        type:String,
        value:''
      },
      content:{
      type:String,
      value:''
      },
      createTime:{
      type:String,
      value:''
      },
      liked:{
      type:String,
      value:''
      },
      nickName:{
      type:String,
      value:''
      },
      icon:{
        type:String,
        value:''
      },
      imagesrc:{
        type:Array,
        value:''
      },
      absent:{
        type:String,
        value:''
      },
      whenMeet:{
        type:String,
        value:''
      },
      where:{
        type:String,
        value:''
      },
      lowTags:{
        type:Array,
        value:''
      },
      title:{
        type:String,
        value:''
      },
      isComplete:{
        type:Number,
        value:''
      },
      isLiked:{
        type:Boolean,
        value:true
      }
  },
  data:{
    isShow: false,
    linenum:2,
    more:0,
    
  },
  lifetimes: {
    attached: function (){
      const query = this.createSelectorQuery();
      query.select('.textarea').boundingClientRect();
      query.exec(res => {      
          const LineHeight = 25; // 行高
          const LineNum = res[0].height / LineHeight; // 行数
          if (LineNum < 2) {
              this.setData({
                  linenum:LineNum
              });          
          }
      });
    }
  },
  methods:{
    previewImage(e){
      console.log(e)
      var current = e.currentTarget.dataset.src;
    console.log(current);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.imagesrc, // 需要预览的图片http链接列表
    })
    },
    jump(){
      if(this.data.canJump)
          wx.navigateTo({
            url:"/packageA/pages/peopledetails/peopledetails?id="+this.data.otherId
            })
    },
    show(){
      this.setData({
        isShow: !this.data.isShow
      })
      // readBlog({
      //   id:this.data.mId,
      // }).then(res=>{
      //   if(this.data.isShow==true){
      //     this.setData({
      //       viewTimes:this.data.viewTimes+1
      //     })
      //   }
      // })
    },
    more(){
      this.setData({
        more:!this.data.more
      })
    },
    modify(){
      this.setData({
        more:!this.data.more
      })
      console.log("修改")
      wx.reLaunch({
        url:'/pages/publish/publish?id='+this.data.mId
      })
    },
    finish(){
      this.setData({
        more:!this.data.more
      })
      completeBlog({
        id:this.data.mId,
        token:wx.getStorageSync('token')
      }).then(res=>{
        this.setData({
          isComplete:1
        })
        wx.showToast({
          title:res.data.data,
          icon:"none"
        })
      })
    },
    delete(){
      this.setData({
        more:!this.data.more
      })
      deleteBlog({
        id:this.data.mId,
        token:wx.getStorageSync('token')
      }).then(res=>{
        app.globalData.refresh=1
        console.log(res)
        wx.showToast({
          title:res.data.data,
          icon:"none"
        })
      })
    },
    like(){
      likeBlog({
        id:this.data.mId,
        token:wx.getStorageSync('token')
      }).then(res=>{
        console.log(res)
        wx.showToast({
          title:res.data.data,
          icon:"none"
        })
        if(res.data.data=="取消点赞成功"){
          this.setData({
            liked:--this.data.liked,
            isLiked:!this.data.isLiked
          })
        }
        else{
          this.setData({
            liked:++this.data.liked,
            isLiked:!this.data.isLiked
          })
        }
      })
     
    }
  }
})