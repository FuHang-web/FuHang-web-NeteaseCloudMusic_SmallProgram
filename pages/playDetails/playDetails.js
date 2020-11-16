// pages/playDetails/playDetails.js
import request from '../../utils/request'
import tools from '../../utils/tools'
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicId: '',
    musicName: '',
    musicUrlData: '',
    lyricsData: '',
    src: ''
  },
  slider1change(e) {
    console.log(e);
  },
  topTest() {
    innerAudioContext.stop()
    innerAudioContext.onStop((a) => {
      console.log(a);
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    console.log(tools.deviceInformation());
    const systemData = tools.deviceInformation()
    let clientHeight = systemData.windowHeight;
    let clientWidth = systemData.windowWidth;
    let ratio = 750 / clientWidth;
    let height = clientHeight * ratio;
    this.setData({
      // musicId: options.id
      height: `${height}rpx`,
      musicId: "514761281",
      musicName: '测试一下'
    })
    wx.setNavigationBarTitle({
      title: this.data.musicName
    })

    const _self = this
    const musicUrl = await request('/song/url', {
      id: _self.data.musicId
    })
    const lyrics = await request('/lyric', {
      id: _self.data.musicId
    })
    this.setData({
      musicUrlData: musicUrl.data[0],
      lyricsData: lyrics
    })
    console.log(this.data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    innerAudioContext.autoplay = true
    innerAudioContext.src = "http://m8.music.126.net/20201117010420/8ffff6a65ea0daffeecb32ada257912d/ymusic/25a2/4ff4/52fc/d664724d25de35a8d4e23c1b986c60b5.mp3"
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    //音频进入可以播放状态，但不保证后面可以流畅播放
    innerAudioContext.onCanplay(() => {
      innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到
      setTimeout(function () {
        //在这里就可以获取到大家梦寐以求的时长了
        console.log(innerAudioContext.duration); //延时获取长度 单位：秒
      }, 100) //这里设置延时1秒获取
    })
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