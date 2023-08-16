import {request} from "../utils/request"

//登录请求
export function loginRequest(postData){
  return request({
   url:'/wz/user/login',
   method:"POST",
   header:{
      'Content-Type': 'multipart/form-data',
   },
   data: {
    stuId: postData.stuId,
    password: postData.password
  }
  })
}

//获取最热帖子
export function gethotRequest(e) {
  return request({
    url:"/wz/blog/queryHottestBlog?current="+e.hcurrent,
    header:{token:e.token}
  })
}
//获取喜欢帖子
export function getlikedRequest(e) {
  return request({
    url:"/wz/blog/queryLikeBlog?current="+e.lcurrent,
    header:{token:e.token}
  })
}
//获取最新帖子
export function getnewRequest(e) {
  return request({
    url:"/wz/blog/queryNewestBlog?current="+e.ncurrent,
    header:{token:e.token}
  })
}
//获取我的详情
export function getmyDetaileRequest(token) {
  return request({
    url:"/wz/user/me",
    header:{token},
  })
}
//获取我的帖子
export function myblogsRequest(e) {
  return request({
    url:"/wz/user/queryMyselfPub?current="+e.current,
    header:{token:e.token},
  })
}

//修改用户信息
export function changeserinfoRequest(params) {
  return request({
    url:"/wz/user/changeUserInfo",
    header:{token:params.token},
    needLogin:1,
    method:"POST",
    data:{
      picture:params.picture,
      nickName:params.changeName, 
      qq:params.changeQQ,
      constellation:params.changeXingzuo,
      mbti:params.changeMBTI,
      highTag:params.changeNeed,
      myDescription:params.changeHobby,
      majorName:params.changeMajor,
      icon:params.icon
    }
  })
  
}

//修改头像
export function changeserheadRequest(params) {
  return request({
    url:"/wz/user/changeUserInfo",
    needLogin:1,
    header:{token:params.token},
    method:"POST",
    data:{
      icon:params.icon
    }
  })
}

//修改简介图片
  export function changeuserpicRequest(params) {
    return request({
      url:"/wz/user/changeUserInfo",
      header:{token:params.token},
      needLogin:1,
      method:"POST",
      data:{
        picture:params.picture
      }
    })
  }

//获取朋友列表
  export function getfriendsReuqest(params) {
    return request({
      url: '/wz/friend/allFriends',
     header:{token:params.token},
     needLogin:1
    })
  }

//获取标签分类
  export function gettagRequest(params) {
    return request({
      url:'/wz/blog/getTagWordCount?typeId='+params.id,
      header:{token:params.token},
      needLogin:1,
    })
  }

//获取消息列表/用户上线
export function getmessageRequest(params) {
    return request({
      url:'/wz/message/connect',
      header:{token:params.token},
      needLogin:1
    })
}
//获取帖子详情
export function newsdetailsRequest(params) {
  return request({
    url:"/wz/blog/query/"+params.id,
    header:{token:params.token}
  })
}

//发布帖子
export function pubblogRequest(params) {
  return request({
    url:"/wz/blog/pubBlog",
    header:{token:params.token},
    needLogin:1,
    method:"POST",
    data:{
      absent:params.absent,
      content:params.content,
      highTagId:params.highTagId,
      imageList:params.imageList,
      location:params.location,
      lowTags:params.lowTags,
      title:params.title,
      whenMeet:params.whenMeet,
    }
  })
}

//获取消息记录
export function gethistorymessageRequest(params) {
    return request({
      url:"/wz/message/historyMessage?fromId="+params.fromId+"&messageId="+params.id,
      header:{token:params.token},
      method:"POST",
    })
}

//发送消息
export function sendmessageRequest(params) {
    return request({
      url:"/wz/message/sendMessage",
      header:{token:params.token},
      method:"POST",
      data:{
        type:params.type,
        content:params.content,
        toId:params.toId
      }
    })
}

//根据id查询他人信息
export function getotheruserRequest(params) {
  return request({
    url:"/wz/user/otherUser/"+params.userId,
    header:{token:params.token},
    needLogin:1,
  })
}

//发送好友请求
export function makefriendRequest(params) { 
  return request({
    url:"/wz/friend/makeFriend?friendId="+params.friendId+"&message="+params.message,
    header:{token:params.token},
    method:"POST",
  })
}

//修改备注
export function changeFriendAlterName(params) {
  return request({
    url:"/wz/friend/changeFriendAlterName?friendId="+params.friendId+"&alterName="+params.alterName,
    header:{token:params.token},
    method:"POST"
  })
}

//接受好友请求
export function acceptfriendRequest(params) {
  return request({
    url:'/wz/friend/acceptFriend?friendId='+params.friendId+"&alterName="+params.alterName,
    header:{token:params.token},
    method:"POST",
    
  })
}

//消息已读
export function readmessageRequest(params) {
  return request({
    url:"/wz/message/readMessage?fromId="+params.fromId+"&messageId="+params.messageId,
    header:{token:params.token},
    method:"POST"
  }) 
}

//按一级标签和词频的分词搜索接口
export function searchTagWordByTypeId(params) {
  return request({
    url:'/wz/blog/searchTagWordByTypeId?typeId='+params.typeId+"&keyword="+params.keyword+"&current="+params.current,
    header:{token:params.token},
    needLogin:1,
  })
}

//搜索帖子
export function searchBlog(params) {
  return request({
    url:"/wz/blog/searchBlog?keyword="+params.keyword+"&current="+params.scurrent,
    header:{token:params.token},
    needLogin:1,
    method:"POST"
  })
}

//mbti
export function getmbti(params) {
  return request({
    url:"/wz/mbti/all",
    header:{token:params.token},
  })
}
//星座
export function getconstellation(params) {
  return request({
    url:"/wz/constellation/all",
    header:{token:params.token},
    
  })
}
//删除帖子
export function deleteBlog(params) {
  return request({
    url:"/wz/blog/delete?id="+params.id,
    header:{token:params.token},
    
  })
}

//完成帖子
export function completeBlog(params) {
  return request({
    url:"/wz/blog/complete?id="+params.id,
    header:{token:params.token},
    
  })
}

//帖子点赞
export function likeBlog(params) {
  return request({
    url:"/wz/blog/like/"+params.id,
    header:{token:params.token},
    
  })
}

//获得他人帖子
export function othersBlog(params) {
  return request({
    url:"/wz/blog/queryOnesBlog?userId="+params.userId+"&current="+params.current,
    header:{token:params.token},
    
  })
}

//增加浏览量
export function readBlog(params) {
  return request({
    url:"/wz/blog/readBlog?id="+params.id
  })
}

//修改帖子
export function updateBlog(params) {
  return request({
    url:'/wz/blog/update/'+params.id,
    header:{token:params.token},
    method:"POST",
    data:{
      absent:params.absent,
      content:params.content,
      highTagId:params.highTagId,
      imageList:params.imageList,
      location:params.location,
      lowTags:params.lowTags,
      title:params.title,
      whenMeet:params.whenMeet,
    }
  })
}