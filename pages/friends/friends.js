// pages/friends/friends.js
import {getfriendsReuqest} from "../../utils/apis"

var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    friends:[],
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.getfriends()
  },
  onShow(){
    this.getfriends()
  },
getfriends(){
  getfriendsReuqest({
    token:wx.getStorageSync('token')
  }).then(res=>{
    console.log("朋友列表")
    console.log(res)
    this.setData({
      friends:res.data.data
    })
  })
},
 
})