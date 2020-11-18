// pages/index/index.js
import request from '../../utils/request'
import tools from '../../utils/tools'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [], // 轮播图的数据
    recommendHeader: '',
    recommendList: [], // 推荐歌单的数据
    playListNameList: '', // 热门歌单名字
    navIconList: [], // 图标列表
    monthDay: '', // 今天是每个月中的第几天
    musicCalendarList: [], // 音乐日历数据
    progress_txt1: '00'
  },

  test(e) {
    console.log(e);
  },
  getMusicData(data) {
    console.log(data.currentTarget.dataset);
    console.log(data.currentTarget.dataset.musicdata);
    console.log(data.currentTarget.dataset.musicdata.id);
    wx.navigateTo({
      url: '/pages/playDetails/playDetails?id=' + data.currentTarget.dataset.musicdata.id + '&listId=' + data.currentTarget.dataset.songlistdata.id,
    })
  },
  drawProgressbg() {
    // 使用 wx.createContext 获取绘图上下文 context
    var ctx = wx.createCanvasContext('canvasProgressbg', this)
    ctx.setLineWidth(2); // 设置圆环的宽度
    ctx.setStrokeStyle('#f50'); // 设置圆环的颜色
    ctx.setLineCap('round') // 设置圆环端点的形状
    ctx.beginPath(); //开始一个新的路径
    ctx.arc(14, 14, 13, 0, 2 * Math.PI, false);
    //设置一个原点(110,110)，半径为100的圆的路径到当前路径
    ctx.stroke(); //对当前路径进行描边
    ctx.draw();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前设备信息
    wx.getSystemInfo({
      success: async (result) => {
        // 截取当前设备类型
        const systemType = result.system.slice(0, result.system.indexOf(' '))
        // 判断当前设备 is IOS or Android
        let isSystem = systemType === 'iOS' ? 2 : (systemType === 'Android' ? 1 : (systemType === 'Windows' ? 0 : 3))
        // 判断设备是否是平板
        if (result.windowWidth > 750) {
          isSystem = 3
        }
        console.log(result);
        

        // 首页-图标列表
        const {
          data: navIconListData
        } = await request('/homepage/dragon/ball')
        // navIconListData.splice(1, 0, {
        //   id: -10,
        //   name: '私人FM',
        //   className: 'iconfont icon-FM'
        // })
        // navIconListData.push({
        //   id: -11,
        //   name: '唱聊',
        //   className: 'iconfont icon-changliao'
        // }, {
        //   id: -12,
        //   name: '游戏专区',
        //   className: 'iconfont icon-youxi'
        // })

        this.setData({
          navIconList: navIconListData,
          monthDay: tools.mGetDate()
        })
        // console.log(navIconListData);

        // 获取轮播图页面数据
        let bannerListData = await request('/banner', {
          type: isSystem
        })
        this.setData({
          bannerList: bannerListData.banners
        })

        // 获取推荐歌单的数据
        let recommendHeaderList = ['你的歌单精选站', '发现好歌单', '懂你的精选歌单', '人气歌单推荐']
        let {
          result: recommendListData
        } = await request('/personalized', {
          limit: 6
        })
        console.log(recommendListData);

        this.setData({
          recommendHeader: '精选歌单',
          // recommendHeader: recommendHeaderList[Math.floor(Math.random() * recommendHeaderList.length)],
          recommendList: recommendListData,
        })
        // const login = await request('/login/cellphone', {
        //   phone: 15223184837,
        //   password: 'fu19990327.'
        // })
        // console.log(login);
        // wx.setStorageSync('cookie', login.cookie)
        // wx.setStorageSync('token', login.token)
        // const state = await request('/login/refresh')
        // console.log(state);

        // 音乐日历，获取当前时间戳
        const {
          data: musicCalendarListData
        } = await request('/calendar', {
          startTime: tools.getTimeStamp(),
          endTime: tools.getTimeStamp() + 86400 * 6 * 1000
        })
        console.log(musicCalendarListData.calendarEvents);
        this.setData({
          musicCalendarList: musicCalendarListData.calendarEvents.slice(0, 1)
        })
        console.log(tools.getTimeStamp());
        console.log(tools.getTimeStamp());


        // 获取排行榜的歌单数据
        let topListData = await request('/toplist')
        const a = tools.getRandomArrayElements(topListData.list, 10)
        let newTopList = []
        for (let i = 0, len = a.length; i < len; i++) {
          // console.log(a[i].id);
          const {
            playlist: newTop
          } = await request('/playlist/detail', {
            id: a[i].id
          })
          newTop.tracks.splice(3, newTop.tracks.length - 3)
          // console.log(newTop.tracks.length);
          newTopList.push(newTop)
          this.setData({
            playListNameList: newTopList
          })
        }
        // console.log(newTopList);
        // topListData.list.sort(function (a, b) {
        //   return b.playCount - a.playCount
        // })
        // console.log(topListData);
      },
      fail: (err) => {
        console.log(err);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawProgressbg();
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