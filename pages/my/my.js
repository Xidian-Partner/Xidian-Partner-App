// pages/my/my.js
import {myblogsRequest,getmyDetaileRequest,getconstellation,getmbti} from "../../utils/apis"

var app=getApp()
var current=1
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    picture:[],
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight,
    num:0,
    list:[],
    picture:'',
    token:'',
    userName:'',
    userMessages:'',
    userIcon:'',
    userQQ:'',
    userMajor:'',
    userMBTI:'',
    userXingzuo:'',
    need:'',
    constellationArray:[],
    mbtiArray:[],
    needArray:['竞赛','脱单','出游'],
    loading:0,
    isdata:1
  },
  previewImage(e){
    console.log(e)
    var current = e.currentTarget.dataset.src;
    console.log(current);
     wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.picture, // 需要预览的图片http链接列表
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

  onLoad(options) {
    current=1
    var token=wx.getStorageSync('token')
    myblogsRequest({
      token,
      current
    })
    .then(res=>{   
      ++current
      console.log("用户帖子")
      console.log(res)
      this.setData({
         list:res.data.data
      })
    }) 
    .catch(err=>{
      console.log(err)
    })
    this.mbti()
    this.constellation()
    this.setData({
      picture:app.globalData.userInfo.picture||'',
      token:app.globalData.userInfo||'',
      userName:app.globalData.userInfo.nickName||'',
      userMessages:app.globalData.userInfo.myDescription||'',
      userIcon:app.globalData.userInfo.icon||'',
      userQQ:app.globalData.userInfo.qq||'',
      userMajor:app.globalData.userInfo.majorName||'',
      userMBTI:app.globalData.userInfo.mbti||'',
      userXingzuo:app.globalData.userInfo.constellation||'',
      need:app.globalData.userInfo.highTag
    })
  },
 
  onShow() {
  
  },
  logout(){
    wx.removeStorageSync('userInfo')
      app.globalData.userInfo='';
      wx.removeStorageSync('token')
      app.globalData.token=''
      wx.removeStorageSync('userId')
      app.globalData.userId=''
      // this.setData({
      //   token:app.globalData.token,
      //   userName:app.globalData.userInfo,
      //   userMessages:app.globalData.userInfo,
      //   userIcon:app.globalData.userInfo
      // })
      wx.reLaunch({
        url:'/pages/my/my'
      })
  },
  onReachBottom(){
    if(this.data.isdata==0){
      return
    }
    this.setData({
      loading:1
    })
    var token=wx.getStorageSync('token')
    myblogsRequest({
      token,
      current
    })
    .then(res=>{   
      this.setData({
        loading:0
      })
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
      console.log(err)
    })
  },
  onPullDownRefresh() {
    var promise = new Promise((resolve) => { this.onLoad(); resolve(); });
    promise.then(() => { wx.stopPullDownRefresh(); });
  },
})