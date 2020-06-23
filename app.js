//app.js
App({
  // 微信小程序的生命周期函数本质就是事件。微信小程序某个阶段自己触发的一个事件而已。
  // 微信小程序请求的基地址
  globalData:{
    checkLogin: false,   // 受否登录授权标识
    userInfo: null,      // 用户完整信息
    openId: '',          // 用户openid
    // baseUrl:"https://cynosure.online/atonce",    //服务器基路径
    baseUrl: "http://localhost:8080"
  },

//   {
//     "pagePath": "pages/photoalbum/photoalbum",
//     "text": "相册",
//     "iconPath": "img/tarbar/相册.png",
//     "selectedIconPath": "img/tarbar/相册选.png"
// },
  
})
