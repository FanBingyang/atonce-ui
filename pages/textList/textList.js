// pages/textList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        editorStatus: false,    // 是否是编辑状态
        selectList: [],                 // 用户选中进行操作的记事本id
        folderId: '',                   // 文件夹的id
        allNotepadList: [
            {
                id: 1,
                title: '第一个记事本',
                delta: '',
                html: '你好啊，我的第一个记事本！',
                text: '你好啊，我的第一个记事本！',
                classify: 'test',
                openId: '123456',
                creatTime: '2020-03-01 10:05:32'
            },
            {
                id: 2,
                title: '第二个记事本',
                delta: '',
                html: '啦啦啦啦啦，我的第一个记事本！',
                text: '啦啦啦啦啦，我的第一个记事本！',
                classify: 'test',
                openId: '123456',
                creatTime: '2020-03-01 10:05:32'
            }
        ],          // 文件夹内的记事本
    },

    


    // 点击编辑
    editor:function(e){
        var that = this
        that.setData({
            editorStatus: !that.data.editorStatus
        })
    },

    // 新建记事本
    creatText:function(e){
        var that = this
        wx.navigateTo({
          url: '../text/text',
        })
    },

    // 选择框发生改变
    checkboxChange:function(e){
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
                    // wx.request({
                    //     url: baseUrl + '/notepad/delete.do',
                    //     data: { list: that.data.selectList },
                    //     method: 'POST',
                    //     header: {
                    //         'content-type': 'application/x-www-form-urlencoded'
                    //     },
                    //     success: function (res) {
                            that.deleteSuccess();
                    //     },
                    //     fail: function (res) {
                    //         wx.showToast({
                    //             title: '删除失败',
                    //             duration: 1000,
                    //         })
                    //     }
                    // })
                } else if (res.cancel) { }
            }
        })
    },
    
    // 删除请求
    deleteRequest:function(e){

    },

    // 删除请求成功之后调用，显示提示，删除并更新页面数据
    deleteSuccess:function(e){
        var that = this
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

    // 请求文件夹内的记事本
    requestFolderNotepad:function(e){

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("options==",options)
        var that = this
        // 设置页面标题
        wx.setNavigationBarTitle({
          title: options.name,
        })
        if(options.id != ''){
            console.log("id==",options.id)
        }
        else console.log("回收站文件")
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
    onPullDownRefresh: function () {

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