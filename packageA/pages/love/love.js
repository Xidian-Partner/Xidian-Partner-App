// pages/love/love.js
import {searchTagWordByTypeId,searchBlog} from "../../../utils/apis"
var current=1,scurrent=1,dowhat=0
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight, 
      num:0,
      keyword:'',
      loading:0,
      isdata:1
  },
 
 
  getYou(){
    current=1
    this.getnews('捞捞你')
    dowhat=0
    this.setData({
      num:0,
    })
  },
  getMe(){
    current=1
    this.getnews('看看我')
    dowhat=1
    this.setData({
      num:1
    })
  },
  search(){
    dowhat=2
    scurrent=1
    searchBlog({
      token:wx.getStorageSync('token'),
      keyword:this.data.keyword,
      scurrent
    }).then(res=>{
      console.log(res)
      if(res.data.data.length==0){
        wx.showToast({
          title: '没有相关帖子',
          icon:'none'
        })
      }
      else{
        this.setData({
          newsList:res.data.data,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      loading:1
    })
    this.getYou()
  },

  getnews(text){
    searchTagWordByTypeId({
      token:wx.getStorageSync('token'),
      keyword:text,
      typeId:3,
      current,
    }).then(res=>{
      this.setData({
        loading:0,
        
      })
      current++
      console.log(res)
      if(res.data.data.length==0){
        wx.showToast({
          title: '没有相关帖子',
          icon:'none'
        })
      }
      else{
        this.setData({
          isdata:1,
          newsList:res.data.data,
          keyword:''
        })
      }
    })
  },
 
  onReachBottom() {
    if(this.data.isdata==0){
      return
    }
   this.setData({
     loading:1
   })
   if(dowhat==0){
    searchTagWordByTypeId({
      token:wx.getStorageSync('token'),
      keyword:'捞捞你',
      typeId:3,
      current,
    }).then(res=>{
      console.log(res)
      this.setData({
        loading:0
      })
      current++
      if(res.data.data.length==0){
       this.setData({
         isdata:0
       })
      }
      else{
        this.setData({
          newsList:this.data.newsList.concat(res.data.data),
          keyword:''
        })
      }
    })
   }
   if(dowhat==1){
    searchTagWordByTypeId({
      token:wx.getStorageSync('token'),
      keyword:'看看我',
      typeId:3,
      current,
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
      else{
        this.setData({
          newsList:this.data.newsList.concat(res.data.data),
          keyword:''
        })
      }
    })
   }
   if(dowhat==2){
    searchBlog({
      token:wx.getStorageSync('token'),
      keyword:this.data.keyword,
      scurrent
    }).then(res=>{
      this.setData({
        loading:0
      })
      surrent++
      if(res.data.data.length==0){
        this.setData({
          isdata:0
        })
      }
      else{
        this.setData({
          newsList:this.data.newsList.concat(res.data.data),
        })
      }
    })
   }
  
  },
})