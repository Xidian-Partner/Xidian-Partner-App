// pages/chat/chat.js
import {gethistorymessageRequest,sendmessageRequest,acceptfriendRequest,readmessageRequest,getotheruserRequest} from "../../../utils/apis"

var mesId=Number,close=0
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capsuleTop: app.globalData.capsule.top, 
    capsuleHeight: app.globalData.capsule.height, 
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight, 
    name:'',
    icon:'',
    content:'',
    meslist:[],
    fromId:'',
    height:'',
    theLast:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(res) {
    close=0
    console.log(decodeURIComponent(res.userIcon))
    mesId=res.mesId||(Math.pow(2, 53) - 1)
    getotheruserRequest({
      userId:res.fromId,
      token:wx.getStorageSync('token')
    }).then(res=>{
      this.setData({
        icon:res.data.data.icon
      })
    })
    this.setData({
      name:res.nickName,
      fromId:res.fromId,
      height:app.globalData.system.screenHeight-65
    })
    if(!(mesId==undefined)){
      this.gethistorymessage({
        fromId:res.fromId,
        id:mesId,
        token:wx.getStorageSync('token')
      })
      this.read({
        token:wx.getStorageSync('token'),
        fromId:res.fromId,
        messageId:mesId
      })
    }
    this.connectsocket()
    this.close()
  },
//获取更多历史
getMore(){
  gethistorymessageRequest({  
        fromId:this.data.fromId,
        id:this.data.meslist[0].id-1,
        token:wx.getStorageSync('token')
      }).then(res=>{
        console.log(res.data.data)
          var list=res.data.data.reverse()
            list=list.concat(this.data.meslist)
          this.setData({
            meslist:list
          })
        })
},

  //websocket部分
connectsocket(){
  var that=this
  //建立连接
  wx.connectSocket({
    url: 'wss://xdu-partner-ws.be.wizzstudio.com', 
    success: function(res) {
      console.log('WebSocket连接成功')
    },
    fail: function(err) {
      console.log(err)
    }
  })
  //连接打开
  wx.onSocketOpen(function(res) {
    console.log('WebSocket连接已打开！')
    that.sendReqMessage() //连接成功后发送reqMessage请求
    setInterval(function() {
      that.sendHeartbeat() //每隔5s发送心跳请求
    }, 5000)
  })
  //监听消息
  wx.onSocketMessage(function(res) {
    var rspMsg = JSON.parse(res.data)
    console.log(rspMsg)
    if (rspMsg.fromId == 0) {
      if (rspMsg.content == '连接im系统成功') {
        console.log('连接成功')
      } else if (rspMsg.content == 'pong') {
        console.log('心跳回应')
      }
    } 
    else{ 
      var mlist=that.data.meslist
        mlist.push(rspMsg)
        that.setData({
          meslist:mlist,
          theLast:`item${that.data.meslist.length-1}`
        })
    }
  })
  //连接关闭
},

//监听是否正常关闭
close(){
  var that=this
  wx.onSocketClose(function() {
    console.log('WebSocket连接已关闭！')  
    if(close==0){
      that.connectsocket()
    }
  })
},
//向websocket发送确认信息
sendReqMessage() {
  var reqMsg = {
    command:1,
    token:wx.getStorageSync('token'),
    fromId:wx.getStorageSync('userId')
  }
  console.log(JSON.stringify(reqMsg))
  wx.sendSocketMessage({ 
    data: JSON.stringify(reqMsg)
  })
},
//心跳机制
sendHeartbeat: function() {
  var reqMsg = {
    command: 3,
    content: 'ping'
  }
  wx.sendSocketMessage({
    data: JSON.stringify(reqMsg)
  })
},

// //向websocket发送内容
// sendMessage() {
//   var reqMsg = {
//     command:3,
//     token:wx.getStorageSync('token'),
//     fromId:wx.getStorageSync('userId'),
//     type:1,
//     toId:this.data.fromId,
//     content:this.data.content
//   }
//   console.log(JSON.stringify(reqMsg))
//   wx.sendSocketMessage({ 
//     data: JSON.stringify(reqMsg)
//   })
// },
  //发送消息
  send(){
    var mes={
      type:1,
      content:this.data.content,
      toId:this.data.fromId,
      token:wx.getStorageSync('token'),
      fromId:wx.getStorageSync('userId')
    }
    var meg={
      content:this.data.content,
      fromId:wx.getStorageSync('userId'),
      type:1
    }
    sendmessageRequest(mes).then(res=>{
      if(res.data.code==1000){
        wx.showToast({
          title: '发送成功',
          icon:"none"
        })
        var mlist=this.data.meslist
        mlist.push(meg)
        this.setData({
          meslist:mlist,
          content:'',
          theLast:`item${this.data.meslist.length-1}`
        })
      }
    })
  },
 
//消息已读
  read(params){
    readmessageRequest(params).then(res=>{
      console.log(res)
    })
  },

  //接受好友请求
  accept(){
    acceptfriendRequest({
      token:wx.getStorageSync('token'),
      friendId:this.data.fromId,
      alterName:this.data.name
    }).then(res=>{
      wx.showToast({
        title: res.data.data,
        icon:'none'
      })
    })
  },

  //获取消息历史
  gethistorymessage(params){
    gethistorymessageRequest(
      params
    ).then(res=>{
      console.log("消息记录")
      this.setData({
        meslist:res.data.data.reverse()
      })
      console.log(this.data.meslist)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onUnload(){
    close=1
    wx.closeSocket() 
  
  },
  onShow() {
    // if(!(mesId==undefined)){
    //   this.gethistorymessage({
    //     fromId:this.data.fromId,
    //     id:mesId,
    //     token:wx.getStorageSync('token')
    //   })
    // }
  },
})