// pages/peopledetails/peopledetails.js
import {getotheruserRequest,getmbti,getconstellation,othersBlog} from "../../../utils/apis"

var app=getApp()
var numberId
var id
var current
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight,
    num:0,
   friendInfo:null,
   friendId:null,
   mbtiArray:'',
   constellationArray:'',
    needArray:['竞赛','脱单','出游'],
    list:[],
    loading:0,
    isdata:1,
  },
  previewImage(e){
    console.log(e)
    var current = e.currentTarget.dataset.src;
    console.log(current);
     wx.previewImage({
       current: current, // 当前显示图片的http链接
      urls: this.data.friendInfo.picture, // 需要预览的图片http链接列表
      })
  },
  getDong(){
    this.setData({
      num:0
    })
  },
  getZi(){
    this.setData({
      num:1
    })
    
  },
  mbti(){
    getmbti({
      token:wx.getStorageSync('token')
    }).then(res=>{
      console.log(res)
     this.setData({
       mbtiArray:res.data.data
     })  
    })
  },
  constellation(){
    getconstellation({
      token:wx.getStorageSync('token')
    }).then(res=>{
      console.log(res)
     this.setData({
      constellationArray:res.data.data
     })  
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad(options) {
    id=options.id
    numberId=Number(id)
    this.setData({
      friendId:numberId,
      loading:1
    })
    this.getOther()
    this.mbti()
    this.constellation()
    this.getOthersBlog()
  },

  getOthersBlog(){
    current=1
    othersBlog({
      current,
      userId:numberId,
      token:wx.getStorageSync('token')
    }).then(res=>{
      current++
      console.log("用户帖子")
      console.log(res)
      this.setData({
        loading:0,
        list:res.data.data
      })
    })
  },

  getOther(){
    getotheruserRequest({
      userId:numberId,
      token:wx.getStorageSync('token')
    }).then(res=>{
      console.log(res.data)
      this.setData({
       friendInfo:res.data.data
      })
    })
  },

  onReachBottom(){
    if(this.data.isdata==0){
      return
    }
    this.setData({
      loading:1
    })
    othersBlog({
      current,
      userId:numberId,
      token:wx.getStorageSync('token')
    }).then(res=>{
     this.setData({
       loading:0
     })
      current++
      console.log("用户帖子")
      console.log(res)
      if(res.data.data.length==0){
        this.setData({
          isdata:0
        })
      }
      else{
        this.setData({
          list:this.data.list.concat(res.data.data)
        })
      }
    })
    .catch(err=>{
      this.setData({
        loading:0
      })
    })
  }

})