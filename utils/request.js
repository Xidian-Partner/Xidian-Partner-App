const baseUrl="https://xdu-partner.be.wizzstudio.com";

export function request(params) {
  let dataObj = params.data || {}; 
  let headerObj=params.header||{};
  let needLogin=params.needLogin||0;

  return new Promise((resolve,reject)=>{
    var token=wx.getStorageSync('token')
    if(needLogin==1&&!token){
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '/pages/my/my',
        })
      },500);
      return
    }
    wx.request({
      timeout:20000,
      url: baseUrl+params.url,
      method:params.method || 'GET',
      data:dataObj,
      header:headerObj,
      success:res=>{
        console.log(res)
       if(res.statusCode==401){
          wx.showToast({
            title:'未登录或登录过期，请登录',
            icon:'none'
          })
          return;
        }
        resolve(res)
      },
      fail:err=>{
        wx.showToast({
          title: '网络好像出了点故障...',
          icon:"none"
        })
        reject(err)
      }
    })
  })
}