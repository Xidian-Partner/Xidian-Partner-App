
// components/friend/friend.js
Component({
  properties:{
    nickName:{
      type:String,
      value:''
    },
    icon:{
      type:String,
      value:''
    },
    uid:{
      type:Number,
      value:''
    }
  },
  methods:{
    setting(){
      wx.navigateTo({
        url:"/packageA/pages/friendSetting/friendSetting?id="+this.data.uid
      })
    },
    showdetails(){
      wx.navigateTo({
        url:"/packageA/pages/peopledetails/peopledetails?id="+this.data.uid
        })
    }
  }
  
})