// pages/publish/publish.js
import {pubblogRequest,newsdetailsRequest,updateBlog} from "../../utils/apis"
var mId
var app=getApp()
Page({
  data: {
    topHeight:(app.globalData.capsule.top - app.globalData.system.statusBarHeight) * 2 + app.globalData.capsule.height + app.globalData.system.statusBarHeight,
    iptValue:'',
    iptLowtag1:'',
    iptLowtag2:'',
    iptPeople:'',
    iptTime:'',
    iptPlace:'',
    picture:'',
    array:['学习','娱乐','恋爱','生活'],
    highTag:0,
    iptTitle:'',
    modify:0
  },
  pickerChange(e){
    console.log(e)
    this.setData({
      highTag:e.detail.value
    })
  },
  delete(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    this.data.picture.splice(index, 1)
    this.setData({
      picture: this.data.picture
    })
  },
   
  upImage(){ 
    var that=this 
    if(!this.data.picture){
      console.log("选择图片")
      wx.chooseImage({ 
        count: 9, 
        sizeType: [ 'compressed'], 
        sourceType: ['album', 'camera'], 
        success :(res)=> {
           that.setData({
             picture:res.tempFilePaths
            }) 
         },
         fail:(res)=>{
          console.log(res)
        }
      })
    }
    else{
      wx.chooseImage({
        count:9-(that.data.picture.length),
        sizeType: [ 'compressed'], 
        sourceType: ['album', 'camera'], 
        success:(res)=>{
          console.log(res)
          var pic=res.tempFilePaths
          that.setData({
            picture:that.data.picture.concat(pic)
          })
        },
      })
    }
  },
  submit(){ 
    if(!this.data.iptTitle||!this.data.iptValue||!this.data.iptLowtag1){
      wx.showToast({
        title: '请输入必填内容',
        icon:'none'
      })
      return
    }
    var tags=Array()
    var pic=Array()
    wx.showLoading({
      title: '发布中',
      mask:true
    })
    tags.push(this.data.iptLowtag1)
    if(this.data.iptLowtag2){
        tags.push(this.data.iptLowtag2)
    }
    console.log(tags)
    var uploadTasks = [] 
    console.log(this.data.picture)
    for(var i=0;i<this.data.picture.length;i++){
       uploadTasks.push(new Promise((resolve) => { 
         console.log(i)
         wx.uploadFile({ 
           filePath:this.data.picture[i], 
           name:'file',
           header:{token:wx.getStorageSync('token')}, 
           url: "https://xdu-partner.be.wizzstudio.com/wz/api/file/upload", 
           success:(res)=>{ 
             var jsondata=JSON.parse(res.data) 
             pic.push(jsondata.data.uri) 
             resolve()}, 
           })
          }
        )
      ) 
    } 
    Promise.all(uploadTasks).then(()=>{
      var postData={
        token:wx.getStorageSync('token'),
        content:this.data.iptValue,
        imageList:pic,
        lowTags:tags,
        title:this.data.iptTitle,
        absent:this.data.iptPeople,
        highTagId:++this.data.highTag,
        location:this.data.iptPlace,
        whenMeet:this.data.iptTime,
        id:mId
      }
      if(!this.data.modify){
        return pubblogRequest(postData)
     }
     else{
         return updateBlog(postData)
       }
      })
        .then(res=>{
          console.log("帖子发布返回值")
          console.log(res)
          wx.hideLoading()
          if(res.data.code==1000){
           this.setData({
            iptValue:'',
            iptLowtag1:'',
            iptLowtag2:'',
            iptPeople:'',
            iptTime:'',
            iptPlace:'',
            picture:'',
            highTag:0,
            iptTitle:'',
            modify:0
           })
           app.globalData.refresh=1
                wx.showToast({
                  title: '发布成功',
                  icon:"none"
                })
            }
          else{
            wx.showToast({
              title: '发布失败',
              icon:"none"
            })
          }
        })
      .catch(err=>{
        wx.hideLoading()
      })
},
  show(e){
    console.log(e)
  },
  cancel(){
    this.setData({
      modify:0,
      iptValue:'',
      picture:'',
      iptLowtag1:'',
      iptLowtag2:'',
      iptTitle:'',
      iptPeople:'',
      highTag:0,
      iptPlace:'',
      iptTime:'',
    })
  },
  onLoad(options) {
    if(!(options.id==undefined)){
      mId=options.id
      wx.showLoading({
        title: '请稍后',
        mask:true
      })
        this.setData({
          modify:1
        })
        newsdetailsRequest({
          id:options.id,
          token:wx.getStorageSync('token')
        }).then(res=>{
          wx.hideLoading()
          console.log(res)
          var res=res.data.data
          var downpic=Array()
          var promises = []
       for(var i=0;i<res.images.length;i++){
        var promise = new Promise(function(resolve, reject){
          wx.downloadFile({
            url: res.images[i],
            success: pic => {
              console.log(res)
              downpic.push(pic.tempFilePath)
              resolve()
            },
            fail: reject
          })
        })
        promises.push(promise)
       }
       Promise.all(promises).then(()=>{
         console.log(res)
         var high=Number
         high=res.highTag
         high=high-1
             this.setData({
                 iptValue:res.content,
                 iptLowtag1:res.lowTags[0],
                 iptLowtag2:res.lowTags[1],
                 iptPeople:res.absent,
                iptTime:res.whenMeet,
                iptPlace:res.location,
                picture:downpic,
                iptTitle:res.title,
                highTag:high,
          })
       })  
    })
        .catch(err=>{
          wx.hideLoading()
          wx.showToast({
            title: '修改失败',
            icon:'none'
          })
          this.setData({
            modify:0
          })
        })
    }
  },
})