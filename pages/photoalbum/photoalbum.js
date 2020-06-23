//index.js
//获取应用实例
const app = getApp()
var baseUrl = app.globalData.baseUrl
var userInfo = app.globalData.userInfo
Page({
  
   data: {
      //图片状态
      image_status : true, 
      //上传图片路径数组
      src_array : [],
      status: true,
      src: {}
    },
  
        /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
     
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
  
    },

    chakan:function(e){
       console.log("进入函数，开始请求")
       wx.request({
         url: baseUrl+'/photo/findByAlbumId.do',
         data:{
            albumId: 9
         },
         success:function(res){
            console.log("res==",res)
            console.log("后台数据===",res.data)
         }
       })
    },
    
    success:function(ts){
      console.log(ts.data)
    },
    goTakePic: function () { //启动拍照功能
      // console.log("拍照")
      var that = this;
      wx.chooseImage({
         // 最多可以选择的图片张数，默认9
        count: 20,
         // original 原图，compressed 压缩图，默认二者都有
        sizeType: ['original', 'compressed'],
         // album 从相册选图，camera 使用相机，默认二者都有
        sourceType: ['album', 'camera'],
         // success
        success: function (res) {
          console.log(res)
          console.log(res.tempFilePaths)
          src_array = data.src_array.concat(res.tempFilePaths)
          that.setData({
            src: data.src_array
          })
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      })
  
    }, changeImg: function () { //是否展示图片
      if (image_status == false) {
        this.setData({
          status: true
        })
        data.image_status = true;
  
      } else {
        this.setData({
          status: false
        })
         data.image_status = false;
      }
  
    },
    previewImage:(e)=>{ //点击小图预览大图
      var that = this,  //获取当前图片的下表    
      index = e.currentTarget.dataset.index;   
      //数据源    
      //  pictures = this.data.src_array; 
       wx.previewImage({  
         //当前显示下表   
         current: data.src_array[index],   
         //数据源   
         urls: data.src_array  
         }) 
    }
})
