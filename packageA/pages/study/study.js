// pages/study/study.js
import {gettagRequest,searchTagWordByTypeId,searchBlog} from "../../../utils/apis"
var doWhat=0
var scurrent=1,current=1
var id,choose
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      titile:'',
      topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight, 
      main:0,
      keyword:'',
      newsList:[],
      loading:0,
      isdata:1
  },

  onLoad(options) {
    console.log(options)
    id=options.id
    this.gettag(options.id)
    if(options.id==1){
      this.setData({
        titile:"学习搭子"
      })
    }
    if(options.id==2){
      this.setData({
        titile:"娱乐搭子"
      })
    }
    if(options.id==4){
      this.setData({
        titile:"生活搭子"
      })
    }
  },
  //搜索帖子
  search(){
    doWhat=1
    scurrent=1
    searchBlog({
      token:wx.getStorageSync('token'),
      keyword:this.data.keyword,
      scurrent
    }).then(res=>{
      if(res.data.data.length==0){
        wx.showToast({
          title: '没有相关帖子',
          icon:'none'
        })
      }
      else{
        scurrent++
        this.setData({
          isdata:1,
          newsList:res.data.data,
          main:1,
        })
      }
    })
  },

  //获取帖子
  getnews(e){
    console.log(e.target.dataset.value)
    choose=e.target.dataset.value
    current=1
    searchTagWordByTypeId({
      current,
      token:wx.getStorageSync('token'),
      keyword:e.target.dataset.value,
      typeId:id
    }).then(res=>{
      console.log(res)
      if(res.data.data.length==0){
        wx.showToast({
          title: '没有相关帖子',
          icon:'none'
        })
      }
      else{
        current++
        this.setData({
          newsList:res.data.data,
          main:1
        })
      }
    })
  },
  //返回
  back(){
    this.setData({
      main:0,
      isdata:1
    })
    doWhat=0
  },
  
  gettag(id){
    gettagRequest({
      id,
      token:wx.getStorageSync('token')
    }).then(res=>{
      console.log("标签")
      console.log(res)
      this.setData({
        list:res.data.data
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(doWhat==0&&this.data.isdata){
      this.setData({
        loading:1
      })
      searchTagWordByTypeId({
        current,
        token:wx.getStorageSync('token'),
        keyword:choose,
        typeId:id
      }).then(res=>{
        this.setData({
          loading:0
        })
        current++
        if(res.data.data.length==0){
         this.setData({
           isdata:0
         })
        }
        this.setData({
          newsList:this.data.newsList.concat(res.data.data)
        })
      })
    }
    if(doWhat==1){
      searchBlog({
        token:wx.getStorageSync('token'),
        keyword:this.data.keyword,
        scurrent
      }).then(res=>{
        this.setData({
          loading:0
        })
        scurrent++
        if(res.data.data.length==0){
          this.setData({
            isdata:0
          })
        }
        this.setData({
          newsList:this.data.newsList.concat(res.data.data)
        })
      })
    }
  },

})