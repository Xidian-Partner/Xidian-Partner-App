// app.js
App({
  globalData:{
    userInfo:'',
    system: '',//导航栏信息
    capsule: '',
    token:'',
    userId:'',
    refresh:0
  },
  onLaunch: function () {
    this.globalData.userInfo=wx.getStorageSync('userInfo')//获取本地用户信息
    if(this.globalData.userInfo!=''){
      this.globalData.userInfo.highTag--
      this.globalData.userInfo.mbti--
      this.globalData.userInfo.constellation--
    }
    this.globalData.token=wx.getStorageSync('token')
    this.globalData.userId=wx.getStorageSync('userId')
    // 在 app.js 中全局获取一次系统和胶囊信息
    // 获取系统信息
    wx.getSystemInfo({
     success: res => {
       this.globalData.system = res
       console.log(res)
     }
   })
   // 获取胶囊信息
   this.globalData.capsule = wx.getMenuButtonBoundingClientRect()
   }
}
)