// pages/square/square.js
import {getmessageRequest} from '../../utils/apis'

var app=getApp()

Page({
  data: {
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight,
    num:0,
    list:[],
    shenglist:[],
    shulist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getmessages()
  },

  getshu(){
    this.setData({
      num:0,
      list:this.data.shulist
    })
  },
  getsheng(){
    this.setData({
      num:1,
      list:this.data.shenglist
    })
    
  },
  //获取消息并分类
  getmessages(){
    getmessageRequest({
      token:wx.getStorageSync('token')
    }).then(res=>{
      console.log("消息列表")
      console.log(res.data.data)
      var shulist1=[]
      var shenglist1=[]
      var list1=[]
      list1=res.data.data
      var count=0
      var promise = new Promise((resolve, reject) => {
        for (let i = 0; i < list1.length; i++) {
          if(list1[i].isFriend==0){
            shenglist1.push(list1[i])
          }
          else{
           shulist1.push(list1[i])
          }
          count++;
          if(count === list1.length) {
            resolve();
          }
        }
      });
      promise.then(()=>{
        if(this.data.num==0){
          this.setData({
            shenglist:shenglist1,
            shulist:shulist1,
            list:shulist1
          });
        }
        else{
          this.setData({
            shenglist:shenglist1,
            shulist:shulist1,
            list:shenglist1
          });
        }
      })
    })
  },
  onShow() {
    this.getmessages()
  },
  onPullDownRefresh() {
    var promise = new Promise((resolve) => { this.getmessages(); resolve(); });
    promise.then(() => { wx.stopPullDownRefresh(); });
  },
})