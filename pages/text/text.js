var util = require('../../utils/util.js')
const app = getApp();
var baseUrl = app.globalData.baseUrl
var userInfo = app.globalData.userInfo;
Page({
  data: {
    formats: {},
    // readOnly: false,
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    notepad: null,        // 当前文章数据
    title: '',            // 标题文本框中的内容
    time: '',             // 页面显示的文章时间
    
  },

  // 标题文本框输入/失去焦点
  titleInput:function(e){
    this.setData({
      title: e.detail.value
    })
  },

  
  
  // 点击提交时
  tijiao:function(e){
      const that = this
      // 标题不能为空
      if(that.data.title == '')
      {
        wx.showToast({
          title: '标题不能为空！',
          duration: 1000,
          icon: 'none',
        })
      }
      else{
        that.editorCtx.getContents({
          success: function (res) {
            // 将delta对象转换成字符穿
            var deltaJSON = JSON.stringify(res.delta.ops)
            // 默认请求路径是新建
            var Reurl = "/notepad/creat.do"
            // 默认请求参数不带文章id，表示新建文章
            var objData = {
              title: that.data.title,
              classify: "测试",
              openId: app.globalData.openId,
              text: res.text,
              html: res.html,
              delta: deltaJSON
            }
            // 判断文章id是否存在，存在则标表示是修改文章，此时修改请求路径为修改，将文章id添加到请求参数
            if(that.data.notepad){
              objData.id = that.data.notepad.id
              var Reurl = "/notepad/update.do"
            }
            console.log("url===",Reurl,"\nobjData===",objData)
            // 发起请求
            wx.request({
              url: baseUrl + Reurl,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: objData,
              success :function(ress){
                  console.log("添加成功==",ress)
                  wx.showToast({
                    title: '保存成功',
                    duration: 1000,
                    icon: 'success',
                  })
              },
              fail:function(ress){
                console.log("不知道为啥就是提交失败了")
                wx.showToast({
                  title: '保存失败',
                  duration: 1000,
                  icon: 'none',
                })
              }
            })
          }
        })
      }
      
     
  },

  // 更改是否仅可读
  // readOnlyChange() {
  //   this.setData({
  //     readOnly: !this.data.readOnly
  //   })
  // },

  // 页面加载函数
  onLoad(options) {
    const that = this

    // console.log("options==",options.notepad)
    var notepad = options.notepad
    if(notepad){
      // 设置页面标题
      wx.setNavigationBarTitle({
        title: '记事本',
      })
      // 设置当前文章数据
      that.setData({
        notepad:JSON.parse(notepad),
      })
      
    }else {
      console.log("新建文章")
      wx.setNavigationBarTitle({
        title: '新建记事本',
      })
      // 获取并设置时间
      var time = util.formatTime(new Date())
      that.setData({
        time: time
      })
    }
    
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})
    
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)
      
    })
        
    
    
  },

  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  // calNavigationBarAndStatusBar() {
  //   const systemInfo = wx.getSystemInfoSync()
  //   const { statusBarHeight, platform } = systemInfo
  //   const isIOS = platform === 'ios'
  //   const navigationBarHeight = isIOS ? 44 : 48
  //   return statusBarHeight + navigationBarHeight
  // },

  // 编辑器初始化完成时触发
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      var notepad = that.data.notepad
      if(notepad){
            // console.log("notepad=========",notepad)
            // 设置页面文本框
            that.setData({
              title: notepad.title,
              time:notepad.creatTime,
            })
            // console.log("delta==",notepad.delta)
            that.editorCtx.setContents({
              // 返回的resData.delta是列表格式的字符串，需要把格式转换成object才能进行赋值
              delta:JSON.parse(notepad.delta),
              html:notepad.html,
              success:function(res){
                console.log("插入成功")
              },
              fail:function(res){
                console.log("插入失败")
              }
            })
      }
    }).exec()
  },

  // 编辑器失去焦点，同时收起键盘
  blur() {
    this.editorCtx.blur()
  },


  // 修改样式
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },

  // 通过 Context 方法改变编辑器内样式时触发，返回选区已设置的样式
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },

  // 插入分割线
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  // 清空编辑器
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  // 清楚所选内容的样式
  removeFormat() {
    this.editorCtx.removeFormat()
  },

  // 插入数据
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },

  // 插入图片
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          data: {
            id: 'abcd',
            role: 'god'
          },
          width: '80%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },

  // 撤销
  undo:function(e){
    var that = this
    that.editorCtx.undo({
      success:function(res){
        console.log("撤销")
      },
      fail:function(res){
        console.log("撤销失败")
      }
    })
  },
  // 恢复
  redo:function(e){
    var that = this
    that.editorCtx.redo({
      success:function(res){
        console.log("恢复")
      },
      fail:function(res){
        console.log("恢复失败")
      }
    })
  },
})
