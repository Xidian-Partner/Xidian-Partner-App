// pages/friendSetting/friendSetting.js
import {changeFriendAlterName} from "../../../utils/apis"
var uid
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight, 
    altername:''
  },

  save(){
    changeFriendAlterName({
      friendId:uid,
      token:wx.getStorageSync('token'),
      alterName:this.data.altername
    }).then(res=>{
      console.log(res)
      if(res.data.code==1000){
        wx.showToast({
          title: '修改成功',
          icon:"none"
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:2
          })
        },500);
      }
      else{
        wx.showToast({
          title: '修改失败',
          icon:"none"
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    uid=options.id
  },

 
})