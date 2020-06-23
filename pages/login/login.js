// pages/login/login.js
const app = getApp();
var baseUrl = app.globalData.baseUrl
app.globalData.userInfo = '';
app.globalData.openId = '';
app.globalData.checkLogin = '';
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },

    onLoad: function (options) {
        var that=this;
        that.login();

        // wx.getSetting({
        //     success: function (re) {
        //         // 判断用户是否授权
        //         if (re.authSetting['scope.userInfo']) {
        //             wx.switchTab({
        //                 url: '/pages/photoalbum/photoalbum'
        //             })
        //         }
        //         else{
        //             that.login();
        //         }
        //         }
        //     })


        // if(app.globalData.checkLogin){
        //     wx.switchTab({
        //         url: '/pages/photoalbum/photoalbum'
        //     })
        // }
        // 判断是否授权成功
        // if (app.globalData.checkLogin) {
        //     wx.switchTab({
        //         url: '/pages/photoalbum/photoalbum'
        //     })
        // }
        // 回调函数 
        // else {
        //     app.checkLoginReadyCallback = res => {
        //         wx.switchTab({
        //             url: '/pages/photoalbum/photoalbum'
        //         })
        //     }
        // }
      },

      onShow: function () {
         
    },
  


     // 自定义的登录方法，判断用户登录，是否授权
  login: function (e) {
    var that = this
    wx.login({
        success: function (r) {
            //获取登录凭证
            var code = r.code; 
            // console.log('获取到登录凭证=',code);
            if (code) {
                // 获取用户设置信息
                wx.getSetting({
                    success: function (re) {
                        // 判断用户是否授权
                        if (re.authSetting['scope.userInfo']) {
                            // console.log('getSetting用户授权成功');
                            // 已经授权了，就进行后台用户数据写入
                            that.register(code);
                            wx.switchTab({
                                url: '/pages/photoalbum/photoalbum'
                            })
                        } 
                        // else {
                        //     //未授权，跳转到登录页面
                        //     wx.redirectTo({
                        //         url:'/pages/login/login',
                        //     })
                        // }
                    }
                })
            } else {
                console.log("获取用户登录状态失败！" + r.errMsg)
            }
        },
        fail: function () {
            console.log("登录失败")
        }
    })
},

// 获取到用户的登录授权，请求后台，进行用户信息的操作
register: function (code) {
    // if (code.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        // console.log('开始获取用户信息');
        //2.调用获取用户信息接口
        wx.getUserInfo({
            success: function (res) {
                // console.log('请求服务器');
                //3.请求自己的服务器，解密用户信息，获取unionld等加密信息
                wx.request({
                    url: baseUrl + '/userwx/loginwx.do',   //自己后台服务器接口地址
                    method: 'POST',         //请求方式
                    // 请求头消息
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    // 请求接口时传的参数
                    data: {
                        encryptedData: res.encryptedData,   //加密数据
                        iv: res.iv,             //加密算法的初使向量
                        code: code      //登录凭证
                    },
                    success: function (data) {
                        // console.log('请求完成=',data);
                        //4.解密成功后，获取自己服务器返回的结果
                        if (data.data.status == 1) {
                            // 设置登录状态为true
                            app.globalData.checkLogin = true;
                            // 接收请求数据
                            var userInfo_ = data.data.userInfo;
                            // 设置用户信息
                            app.globalData.userInfo = userInfo_;
                            app.globalData.openId = userInfo_.openId
                            console.log("用户信息：", userInfo_);
                            
                            //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (app.checkLoginReadyCallback) {
                                app.checkLoginReadyCallback(data);
                            }
                         
                        } else {
                            console.log("解密失败")
                        }
                    },    
                    fail: function () {
                        console.log("系统错误")
                    }
                })             
                //授权成功后，跳转进入小程序首页
                wx.switchTab({
                    // url: '/pages/photoalbum/photoalbum' 
                    url: '/pages/textbook/textbook'  
                })       
            },
            fail: function () {
                console.log("获取用户信息失败")
            }
        })

// }else {
//     //用户按了拒绝按钮
//     wx.showModal({
//         title:'提示',
//         content:'您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
//         showCancel:false,
//         confirmText:'返回授权',
//         success:function(res){
//             if (res.confirm) {
//                 console.log('用户点击了“返回授权”')
//             } 
//         }
//     })
// }

},

//获取用户信息接口
// queryUsreInfo: function () {
//     wx.request({
//         url: app.globalData.urlPath+"/loginwx.do",
//         data: {
//             openid: app.globalData.openid
//         },
//         header: {
//             'content-type': 'application/json'
//         },
//         success: function (res) {
//             console.log(res.data);
//             getApp().globalData.userInfo = res.data;*
//         }
//     })
// }

})