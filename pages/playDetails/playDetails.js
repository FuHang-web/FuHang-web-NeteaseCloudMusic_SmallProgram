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
    musicDetailsData: '',
    src: '',
    isPlayOrPause: 0, // 播放，点击暂停
    musicLength: 0, // 音乐时间长度
    listIdIndex: '', // 歌单列表当前歌曲的下标
    playListData: [],
  },
  // 进度条
  sliderchange(e) {
    console.log(e.detail.value);
    backgroundAudioManager.seek(e.detail.value)
  },
  // 
  clickPlayOrPause(e) {
    console.log(e);
    if (this.data.isPlayOrPause === 0) {
      backgroundAudioManager.play()
      this.setData({
        isPlayOrPause: 1
      })
    } else {
      backgroundAudioManager.pause()
      this.setData({
        isPlayOrPause: 0
      })
    }
  },
  // 获取到音乐ID之后执行
  async getMusicIdPerform(id) {
    // const _self = this
    // 音乐的详情
    const musicDetails = await request('/song/detail', {
      ids: id
    })
    console.log(musicDetails.songs[0]);
    // 音乐的url
    const musicUrl = await request('/song/url', {
      id: id
    })
    // 歌词
    const lyrics = await request('/lyric', {
      id: id
    })

    this.setData({
      musicUrlData: musicUrl.data[0],
      lyricsData: lyrics,
      musicDetailsData: musicDetails.songs[0]
    })

    // 顶部标题
    wx.setNavigationBarTitle({
      title: this.data.musicDetailsData.name
    })
    backgroundAudioManager.title = this.data.musicDetailsData.name
    backgroundAudioManager.epname = this.data.musicDetailsData.name
    backgroundAudioManager.singer = this.data.musicDetailsData.ar[0].name
    backgroundAudioManager.coverImgUrl = this.data.musicDetailsData.al.picUrl
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = this.data.musicUrlData.url
    backgroundAudioManager.onCanplay((res) => {
      console.log('开始');
      this.setData({
        isPlayOrPause: 1
      })
      setTimeout(() => {
        this.setData({
          musicLength: backgroundAudioManager.duration
        })
        console.log(backgroundAudioManager.duration);
      }, 100);
    })
    backgroundAudioManager.onEnded(() => {
      this.xiayiqu()
    })

  },
  shangyiqu() {
    if (this.data.listIdIndex === 0) {
      this.setData({
        listIdIndex: this.data.playListData.length
      })
    }
    this.setData({
      listIdIndex: this.data.listIdIndex - 1
    })
    this.getMusicIdPerform(this.data.playListData[this.data.listIdIndex].id)
  },
  xiayiqu() {
    if (this.data.listIdIndex === this.data.playListData.length - 1) {
      this.setData({
        listIdIndex: -1
      })
    }
    this.setData({
      listIdIndex: this.data.listIdIndex + 1
    })
    this.getMusicIdPerform(this.data.playListData[this.data.listIdIndex].id)
    console.log(this.data.playListData);
    console.log(this.data.listIdIndex);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    const systemData = tools.deviceInformation()
    let height = systemData.windowHeight * (750 / systemData.windowWidth);
    this.setData({
      // musicId: options.id,
      height: `${height}rpx`,
      musicId: 1481688897,
    })



    // 获取歌单详情
    const playList = await request('/playlist/detail', {
      id: "2250011882"
    })
    console.log(playList.playlist.tracks);

    let currentProfileIndex = (playList.playlist.tracks || []).findIndex((profile) => profile.id === this.data.musicId);
    this.setData({
      playListData: playList.playlist.tracks,
      listIdIndex: currentProfileIndex
    })
    console.log(currentProfileIndex);
    this.getMusicIdPerform(playList.playlist.tracks[currentProfileIndex].id)
    console.log(playList.playlist.tracks[currentProfileIndex].id);
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