// components/navbar/navbar.js
const App = getApp();
Component({
  properties: {
    title:{
      type: String,
      value: ''
    },
    background:{
      type: String,
      value: '#ECF1FE'
    },
    isSowArrow:{
      type: Boolean,
      value: true
    },
    url:{
      type:String,
      value:''
    },
    main:{
      type:Number,
      value:0
    }
  },
   
  data:{
    capsuleTop: '', //胶囊距离屏幕顶部的距离
    capsuleHeight: '', //胶囊高度
    navbarHeight: '' //导航栏高度
  },
  lifetimes: {
    attached: function () {
      this.setData({
        capsuleTop: App.globalData.capsule.top, 
        capsuleHeight: App.globalData.capsule.height, 
        navbarHeight: (App.globalData.capsule.top - App.globalData.system.statusBarHeight) * 2 + App.globalData.capsule.height + App.globalData.system.statusBarHeight, 
      })
     }
  },
 
  methods: {
    handleGoToBack(){
      if(!this.data.main){
        wx.navigateBack({
          delta:1
        })
      }
    }
  }
})