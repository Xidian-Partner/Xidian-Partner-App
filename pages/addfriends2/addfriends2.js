// pages/addfriends2/addfriends2.js
import {makefriendRequest,changeFriendAlterName,getotheruserRequest} from "../../utils/apis"

var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight, 
    info:null,
    yanzhengmes:'',
    beizhu:'',
    icon:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    getotheruserRequest({
      userId:options.friendId,
      token:wx.getStorageSync('token')
    }).then(res=>{
      this.setData({
        icon:res.data.data.icon,
        info:options
      })
    })
  },
  send(){
   wx.showLoading({
     title: '发送中',
     mask:true
   })
    makefriendRequest({
      token:wx.getStorageSync('token'),
      friendId:this.data.info.friendId,
      message:this.data.yanzhengmes 
    }).then(res=>{
      wx.hideLoading()
      if(res.data.code==1000){
        wx.showToast({
          title: '发送成功',
          icon:'none'
        })
        return changeFriendAlterName({
          friendId:this.data.info.friendId,
          token:wx.getStorageSync('token'),
          alterName:this.data.beizhu
        })
      }
      else{
        wx.showToast({
          title: res.data.data,
          icon:'none'
        })
      }
    })
  },
 
})