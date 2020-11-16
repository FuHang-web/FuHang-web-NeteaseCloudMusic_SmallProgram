// pages/playDetails/playDetails.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicId: '',
    musicUrlData: '',
    lyricsData: '',
    src: ''
  },
  audioPlay() {
    this.audioCtx.play()
  },
  audioPause() {
    this.audioCtx.pause()
  },
  audio14() {
    this.audioCtx.seek(14)
  },
  audioStart() {
    this.audioCtx.seek(0)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      // musicId: options.id
      musicId: "514761281"
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
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    this.audioCtx.setSrc("http://m7.music.126.net/20201116183926/37e91ae92c2927c2b81f7392cb9cf367/ymusic/25a2/4ff4/52fc/d664724d25de35a8d4e23c1b986c60b5.mp3")
    this.audioCtx.play()
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