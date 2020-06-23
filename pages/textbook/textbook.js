// pages/textbook/textbook.js
const app = getApp()
var baseUrl = app.globalData.baseUrl
var openId = app.globalData.openId
Page({

    /**
     * 页面的初始数据
     */
    data: {
        status: 1,              // 顶部导航标识
        searchValue: '',        // 搜索框里的值
        editorStatus: false,    // 是否是编辑状态
        selectList: [],                 // 用户选中进行操作的记事本id
        allFolderList: [
        //     {
        //         id: 1,
        //         name: '未分类',
        //         number: 6
        //     },
        //     {
        //         id: 2,
        //         name: '第一个文件夹',
        //         number: 5
        //     },
        //     {
        //         id: 3,
        //         name: '第二个文件夹',
        //         number: 8
        //     },
        //     {
        //         id: 4,
        //         name: '回收站',
        //         number: 4
        //     }
        ],              // 用户所有文件夹
        showmodalput: false,            // 是否显示“新建文件夹”的模态框
        modalid: 1,                     // 模态框的标是，1代表是新建文件夹，2代表是重命名
        modalTitle: '新建文件夹',         // 模态框标题
        modalValue: '',                  // 模态框文本框内的值
        creatFolderName: '',            // 保存新建文件夹的名称
        showActionsSheet:false,         // 是否显示操作指令
        operationFolder: '',            // 被选中进行操作的文件夹
        allNotepadList: [
            // {
            //     id: 2,
            //     title: '第一个记事本',
            //     delta: '',
            //     html: '你好啊，我的第一个记事本！',
            //     text: '你好啊，我的第一个记事本！',
            //     classify: 'test',
            //     openId: '123456',
            //     creatTime: '2020-03-01 10:05:32'
            // },
            // {
            //     id: 3,
            //     title: '第二个记事本',
            //     delta: '',
            //     html: '啦啦啦啦啦，我的第一个记事本！',
            //     text: '啦啦啦啦啦，我的第一个记事本！',
            //     classify: 'test',
            //     openId: '123456',
            //     creatTime: '2020-03-01 10:05:32'
            // }
        ],
    },

    // 改变顶部导航
    changeStatus: function(e){
        // console.log(e);
        // console.log(e.currentTarget.dataset.status)
        var that = this
        that.setData({
            status: e.currentTarget.dataset.status
        })
        if(that.data.status == 1){
            // 请求用户所有记事本
            that.requestAllNotepad();
        }else{
            // 请求用户所有文件夹
            that.requestAllFolder();   
        }
    },

    // 搜索键盘点击完成时，获取并保存输入框中的值
    search: function(e) {
        console.log("bindconfirm=",e)
        this.setData({
            searchValue: e.detail.value
        })
    },

    // 点击记事本时进入查看详情
    gotoText:function(e){
        var that = this
        var index = e.currentTarget.dataset.index
        // 将object对象转换成string进行页面之间是 的数据传递
        // console.log("that.data.allNotepadList[index]==",that.data.allNotepadList[index])
        // console.log("JSON.stringify(that.data.allNotepadList[index])==",JSON.stringify(that.data.allNotepadList[index]))
        // 在富文本编辑器生成的html中有 = 号，这个在页面传递的时候传递不过去，将等号装换成%3D，然后进行传递即可。
        var notepad = JSON.stringify(that.data.allNotepadList[index]).replace(/=/g,'%3D')
        // console.log("notepad=====",notepad.replace(/=/g,'%3D'))
        // console.log("notepad==",notepad)
        wx.navigateTo({
          url: '../text/text?notepad='+ notepad,
        })
    },


    // 新建记事本
    creatText:function(e){
        var that = this
        wx.navigateTo({
          url: '../text/text?folderId=' + that.data.allFolderList[0].id,
        })
    },

    // 点击编辑
    editor:function(e){
        var that = this
        that.setData({
            editorStatus: !that.data.editorStatus
        })
    },
    


    // 选择框发生改变
    checkboxChange:function(e){
        // console.log("checkboxChange",e)
        var that = this
        that.setData({
            selectList: e.detail.value
        })
    },

    // 进行删除记事本
    delete:function(e){
        var that = this
        wx.showModal({
            content: '确定删除吗?',
            confirmText: '删除',
            confirmColor: 'red',
            success: function (res) {
                if (res.confirm) {
                    // 请求删除
                    wx.request({
                        url: baseUrl + '/notepad/delete.do',
                        data: { list: that.data.selectList },
                        method: 'POST',
                        header: {
                            'content-type': 'application/x-www-form-urlencoded'
                        },
                        success: function (res) {
                            // 显示弹窗
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1000,
                            })
                            // 根据角标删除list中的元素
                            var list = that.data.allNotepadList
                            var selList = that.data.selectList
                            for(let index=that.data.allNotepadList.length-1;index >= 0;index--){
                                // console.log("index===",index)
                                // console.log(String(that.data.allNotepadList[index].id))
                                var inx = selList.indexOf(String(that.data.allNotepadList[index].id))
                                if(inx >= 0){
                                    // console.log("index==",index)
                                    var i = list.indexOf(that.data.allNotepadList[index])
                                    list.splice(i, 1)
                                }
                            }
                            // console.log("list=======",list)
                            // 更新页面数据
                            that.setData({
                                allNotepadList: list,
                                editorStatus: false
                            })
                        },
                        fail: function (res) {
                            wx.showToast({
                                title: '删除失败',
                                duration: 1000,
                            })
                        }
                    })
                } else if (res.cancel) { }
            }
        })
    },

    // 请求用户所有记事本
    requestAllNotepad:function(e){
        var that = this
        wx.request({
          url: baseUrl + '/notepad/findExample.do',
          data:{
            openId: app.globalData.openId
          },
          success:function(res){
              console.log("请求记事本完成：",res)
              that.setData({
                  allNotepadList: res.data
              })
          },
          fail:function(res){
              console.log("请求记事本失败：",res)
          }

        })
    },
    

    // 请求用户所有文件夹
    requestAllFolder:function(e){
        var that = this
        wx.request({
          url: baseUrl + '/notefolder/findAll.do',
          data:{
              openId: app.globalData.openId
          },
          success:function(res){
              console.log("请求文件夹成功",res)
              that.setData({
                  allFolderList: res.data
              })
          },
          fail:function(res){
              console.log("请求文件夹失败")
          }
        })
    },




    // 点击新建文件夹
    creatFolder:function(e){
        var that = this
        that.setData({
            modalTitle: '新建文件夹',
            modalValue: '',
            showmodalput: true,
            modalid: 1
        })
    },
    // 模态框文本框的输入(失去焦点/输入/输入完成)
    modalinput:function(e){
        this.setData({
            creatFolderName: e.detail.value
        })
    },
    // 模态框点击取消
    modalCancel:function(e){
        this.setData({
            showmodalput: false
        })
    },
    // 模态框点击确认
    modalConfirm:function(e){
        var that = this
        console.log("modalConfirm--creatFolderName==",that.data.creatFolderName)
        that.setData({
            showmodalput: false
        })
        var list =  that.data.allFolderList
        // modalid==1：新建文件夹
        if(that.data.modalid == 1){
            console.log("新建文件夹")
            var obj = {
                id: list.length + 1,
                name: that.data.creatFolderName,
                number: 0
            }
            // 获取最后一个元素的下标，然后将新的文件夹添加到该位置
            var i = that.data.allFolderList.length-1
            list.splice(i, 0,obj)
            that.setData({
                allFolderList: list
            })
             // 显示弹窗
            wx.showToast({
               title: '新建成功',
               icon: 'success',
               duration: 1000,
            })
        }
        // modalid==2：重命名文件夹
        else if(that.data.modalid == 2){
            console.log("重命名文件夹")
            var folder = that.data.operationFolder
            var list = that.data.allFolderList
            for(let index=0;index<list.length;index++){
                if(list[index].id == folder.id){
                    var tmp = 'allFolderList['+index+'].name'
                    that.setData({
                        [tmp]: that.data.creatFolderName
                    })
                    // console.log("allFolderList["+index+"]==",that.data.allFolderList[index])
                    break
                }
            }
            // 显示弹窗
            wx.showToast({
                title: '重命名成功',
                icon: 'success',
                duration: 1000,
             })
        }
    },
    // 长按文件夹显示操作指令
    showActions:function(e){
        console.log("eeeee=",e)
        var that = this
        var index = e.currentTarget.dataset.index
        // 如果操作的文件夹不是第一个(未分类)和最后一个(回收站)，则表示可操作
        if(index != 0 && index != that.data.allFolderList.length-1){
            this.setData({
                showActionsSheet: true,
                operationFolder: e.currentTarget.dataset.folder,
            })
        }
    },
    // 单点文件夹操作
    gotoFolder:function(e){
        console.log("gotoFolder=",e)
        var folder = e.currentTarget.dataset.folder
        wx.navigateTo({
            url: '../textList/textList?id=' + folder.id + "&name=" + folder.name,
        })
    },
    // 隐藏操作指令
    hideActions:function(e){
        this.setData({
            showActionsSheet:false,
            operationFolder: '',
        })
    },
    // 删除文件夹操作
    deleteFolder:function(e){
        var that = this
        that.setData({
            showActionsSheet: false,
        })
        wx.showModal({
            content: '确定删除吗?',
            confirmText: '删除',
            confirmColor: 'red',
            success: function (res) {
                if (res.confirm) {
                    var folder = that.data.operationFolder
                    // // 请求删除
                    // wx.request({
                    //     url: baseUrl + '/',
                    //     data: { id:  folder.id},
                    //     method: 'POST',
                    //     header: {
                    //         'content-type': 'application/x-www-form-urlencoded'
                    //     },
                    //     success: function (res) {
                            // 显示弹窗
                            wx.showToast({
                                title: '删除成功',
                                icon: 'success',
                                duration: 1000,
                            })
                            // 根据角标删除list中的元素
                            var list = that.data.allFolderList
                            for(let index=list.length-1;index >= 0;index--){
                                if(list[index].id == folder.id){
                                    list.splice(index, 1)
                                    break
                                }
                            }
                            // console.log("list=======",list)
                            // 更新页面数据
                            that.setData({
                                allFolderList: list,
                            })
        //                 },
        //                 fail: function (res) {
        //                     wx.showToast({
        //                         title: '删除失败',
        //                         duration: 1000,
        //                     })
        //                 }
        //             })
                } else if (res.cancel) { }
            }
        })
    },
    // 重命名文件夹
    rename:function(e){
        var that = this
        that.setData({
            showActionsSheet: false,
            modalTitle: '重命名文件夹',
            modalValue: that.data.operationFolder.name,
            showmodalput: true,
            modalid: 2,
        })
    },


    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        // 请求用户所有记事本
        that.requestAllNotepad();
        // 请求用户所有文件夹
        that.requestAllFolder();   
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this
        if(that.data.status == 1){
            // 请求用户所有记事本
            that.requestAllNotepad();
        }else{
            // 请求用户所有文件夹
            that.requestAllFolder();
            // 判断用户文件夹是否只有一个“回收站”，如果只有一个，代表是新用户。默认新建一个“未分类”文件夹   
            if(that.data.allFolderList.length < 2){
                wx.request({
                  url: baseUrl + '/notefolder/creat.do',
                  data:{
                      name: '未分类',
                      openId:app.globalData.openId
                  },
                  success:function(res){
                      console.log("新建“未分类”文件夹完成",res)
                  }
                })
            }
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        var that = this
        // 下拉刷新
        if(that.data.status == 1){
            that.setData({
                allNotepadList:[]
            })
            // 请求用户所有记事本
            that.requestAllNotepad();
        }else{
            that.setData({
                allFolderList: []
            })
            // 请求用户所有文件夹
            that.requestAllFolder();   
        }
        // 手动关闭刷新动画
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})