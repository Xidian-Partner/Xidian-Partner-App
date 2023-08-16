// pages/myDetails/myDetails.js
import {changeserinfoRequest,getmyDetaileRequest,changeserheadRequest,changeuserpicRequest,getmbti,getconstellation} from "../../utils/apis"
var app=getApp()

Page({
  data: {
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight, 
    userNickname:'',
    userQQ:'',
    userXingzuo:'',
    userMBTI:'',
    userMajor:'',
    userNeed:'',
    userHobby:'',
    userIcon:'',
    picture:'',
    array:['竞赛','脱单','出游'],
    mbtiArray:[],
    constellationArray:[],
    changepic:'',
    changeIcon:''
  },
  constellationpickerChange(e){
    this.setData({
     userXingzuo:e.detail.value
    })
  },
  needpickerChange(e){
    this.setData({
     userNeed:e.detail.value
    })
  },
  //mbti
  mbtipickerChange(e){
   this.setData({
    userMBTI:e.detail.value
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
 //选择头像
  upImage(){
    var that=this
    wx.chooseImage({
      count: 1,
      sizeType: [ 'compressed'],
      sourceType: ['album', 'camera'],
      success :(res)=> {
        console.log(res)
        that.setData({
          changeIcon:res.tempFilePaths[0]   
        })
      }
    })
  },

  //删除照片墙
  delete(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    this.data.changepic.splice(index, 1)
    this.setData({
      changepic: this.data.changepic
    })
  },
 //选择照片墙
  upPicture(){ 
    var that=this 
    wx.chooseImage({ 
      count: 3, 
      sizeType: [ 'compressed'], 
      sourceType: ['album', 'camera'], 
      success :(res)=> {
        if(!that.data.changepic){
          that.setData({
            changepic:res.tempFilePaths
           }) 
        }
       else{
         var pic=res.tempFilePaths
         that.setData({
          changepic:that.data.changepic.concat(pic)
         })
       }
      } 
    }) 
  },
  
  saveChange(){
    var icon
    var pic=[]
    var uploadTasks = [] 
    console.log(pic)
    // if(this.data.changepic!=''){
      for(var i=0;i<this.data.changepic.length;i++){
        uploadTasks.push(new Promise((resolve) => { 
          wx.uploadFile({ 
            filePath:this.data.changepic[i], 
            name:'file',
            header:{token:wx.getStorageSync('token')}, 
            url: "https://xdu-partner.be.wizzstudio.com/wz/api/file/upload", 
            success:(res)=>{ 
              console.log(res)
              var jsondata=JSON.parse(res.data) 
              pic.push(jsondata.data.code) 
              resolve()}
            })
           }
         )
       ) 
     } 
     //上传头像
     if(this.data.changeIcon){
      uploadTasks.push(new Promise((resolve) => { 
        wx.uploadFile({ 
          filePath:this.data.changeIcon, 
          name:'file',
          header:{token:wx.getStorageSync('token')}, 
          url: "https://xdu-partner.be.wizzstudio.com/wz/api/file/upload", 
          success:(res)=>{ 
            console.log(res)
            var jsondata=JSON.parse(res.data) 
            icon=jsondata.data.code
            resolve()}
          })
         }
       )
     ) 
     }
     console.log(uploadTasks)
     Promise.all(uploadTasks).then(() => {
      console.log(pic)
      let params={
        picture:pic,
        changeName:this.data.userNickname, 
        changeQQ:this.data.userQQ,
        changeXingzuo:++this.data.userXingzuo,
        changeMBTI:++this.data.userMBTI,
        changeMajor:this.data.userMajor,
        changeNeed:++this.data.userNeed,
        changeHobby:this.data.userHobby,
        token:wx.getStorageSync('token'),
        icon:icon
      }
      return changeserinfoRequest(params)
      }).then(res=>{
        var token=wx.getStorageSync('token')
        return getmyDetaileRequest(token)
    }).then(res=>{
      wx.showToast({
        title: '保存成功',
        icon:'none'
      })
      console.log("修改后的用户信息")
      console.log(res)
      wx.removeStorageSync('userInfo')
      wx.setStorageSync('userInfo', res.data.data)
      app.globalData.userInfo=res.data.data
      app.globalData.userInfo.highTag--
      app.globalData.userInfo.mbti--
      app.globalData.userInfo.constellation--
      setTimeout(()=>{
        wx.reLaunch({
          url: '/pages/my/my',
        })
      },500);
    })
  // }
  // else{
  //   let params={
  //     changeName:this.data.userNickname, 
  //     changeQQ:this.data.userQQ,
  //     changeXingzuo:++this.data.userXingzuo,
  //     changeMBTI:++this.data.userMBTI,
  //     changeMajor:this.data.userMajor,
  //     changeNeed:++this.data.userNeed,
  //     changeHobby:this.data.userHobby,
  //     token:wx.getStorageSync('token')
  //   }
  //   changeserinfoRequest(params).then(res=>{
  //     var token=wx.getStorageSync('token')
  //     return getmyDetaileRequest(token)
  // }).then(res=>{
  //   wx.showToast({
  //     title: '保存成功',
  //     icon:'none'
  //   })
  //   console.log("修改后的用户信息")
  //   console.log(res)
  //   wx.removeStorageSync('userInfo')
  //   wx.setStorageSync('userInfo', res.data.data)
  //   app.globalData.userInfo=res.data.data
  //   app.globalData.userInfo.highTag--
  //   app.globalData.userInfo.mbti--
  //   app.globalData.userInfo.constellation--
  // })
  // }
    },
  onLoad(options) {
    this.constellation()
    this.mbti()
      this.setData({ 
      userNickname:app.globalData.userInfo.nickName,
      userQQ:app.globalData.userInfo.qq,
      userXingzuo:app.globalData.userInfo.constellation,
      userMBTI:app.globalData.userInfo.mbti,
      userMajor:app.globalData.userInfo.majorName,
      userNeed:app.globalData.userInfo.highTag,
      userHobby:app.globalData.userInfo.myDescription,
      userIcon:app.globalData.userInfo.icon,
      picture:app.globalData.userInfo.picture,
    })
  },
})