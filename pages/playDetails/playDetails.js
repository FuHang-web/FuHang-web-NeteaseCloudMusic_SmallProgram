// pages/playDetails/playDetails.js
import request from '../../utils/request'
import tools from '../../utils/tools'
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicId: '',
    musicName: '',
    musicUrlData: '',
    lyricsData: '',
    src: '',
    isPlayOrPause: 0, // 播放，点击暂停
    musicLength: '', // 音乐时间长度
  },
  // 进度条
  slider1change(e) {
    console.log(e.detail.value);
    innerAudioContext.seek(e.detail.value)
  },
  // 
  clickPlayOrPause(e) {
    console.log(e);
    if (this.data.isPlayOrPause === 0) {
      // innerAudioContext.play()
      this.setData({
        isPlayOrPause: 1
      })
    } else {
      // innerAudioContext.pause()
      this.setData({
        isPlayOrPause: 0
      })
    }
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
      musicName: '白羊'
    })
    wx.setNavigationBarTitle({
      title: this.data.musicName
    })

    const _self = this
    const musicDetails = await request('/song/detail',{
      ids:_self.data.musicId
    })
    console.log(musicDetails.songs[0]);
    
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
    backgroundAudioManager.title = this.data.musicName
    backgroundAudioManager.epname = this.data.musicName
    backgroundAudioManager.singer = '许巍'
    backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = 'http://m801.music.126.net/20201118164611/9ff441947853e0ea93293d626a377db3/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/4205540412/91c7/e645/9384/f196126197d34654ac0ed1d6de14829c.mp3'
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const _self = this
    // console.log(this.data);
    // backgroundAudioManager.title = '此时此刻'
    // backgroundAudioManager.epname = '此时此刻'
    // backgroundAudioManager.singer = '许巍'
    // backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
    // // 设置了 src 之后会自动播放
    // backgroundAudioManager.src = 'http://m801.music.126.net/20201118164611/9ff441947853e0ea93293d626a377db3/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/4205540412/91c7/e645/9384/f196126197d34654ac0ed1d6de14829c.mp3'
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