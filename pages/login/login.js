// index.js
var app=getApp()
import {loginRequest, getmyDetaileRequest} from "../../utils/apis"

Page({
  data:{
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight,
    number:'',
    password:''
  },
  login(){
    wx.showLoading({
      title: '登陆中',
      mask:true
    })
    var postData={
      password:this.data.password,
      stuId:this.data.number,
      vcode:"",
    }
    //登录并获取用户数据
    loginRequest(postData)
    .catch(err=>{
      wx.hideLoading()
      console.log("发送失败")
      wx.showToast({
        title: '登陆失败，请检查账号密码与网络',
        icon:'none'
      })
      return
    })
    .then(res => {
      wx.hideLoading()
      console.log("登录返回信息")
      console.log(res)
      if(res.data.data.msg=="登录失败"){
        console.log("登陆失败")
        wx.showToast({
          title: "登录失败,请检查账号密码与网络",
          icon: 'none'
        })
        return
      }
      app.globalData.token=res.data.data.token
      app.globalData.userId=res.data.data.userId
      wx.setStorageSync('userId',res.data.data.userId)
      wx.setStorageSync('token', res.data.data.token)
      return getmyDetaileRequest(res.data.data.token);
    }).then(res1 => {
      console.log("用户信息")
      console.log(res1)
      wx.setStorageSync('userInfo', res1.data.data)
      app.globalData.userInfo = res1.data.data
      app.globalData.userInfo.highTag--
      app.globalData.userInfo.mbti--
      app.globalData.userInfo.constellation--
    }).then(() => {
      wx.reLaunch({
          url: '/pages/find/find',
      })
    })
   }
})


