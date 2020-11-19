// pages/playDetails/playDetails.js
import request from '../../utils/request'
import tools from '../../utils/tools'
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test: true,
    musicId: '',
    musicName: '',
    musicUrlData: '',
    lyricsData: '',
    musicDetailsData: '',
    src: '',
    isPlayOrPause: 0, // 播放，点击暂停
    musicLength: 0, // 音乐时间长度
    listIdIndex: '', // 歌单列表当前歌曲的下标
    playListData: [], // 当前歌单所有音乐
    sliderValue: 0, // 进度条的value值
    playType: 0, // 0 列表循环，1 单曲循环，2 随机播放
    lyricsActiceIndex: 0, // 歌词单行选中
    currentTime: '00:00', // 当前歌曲时间
    totalTime: '00:00', // 总的音乐时长
  },
  clickTest() {
    console.log(this.data.test);
    console.log(!this.data.test);
    const _self = this
    this.setData({
      test: !_self.data.test
    })
  },
  // 进度条
  sliderchange(e) {
    console.log(e.detail.value);
    backgroundAudioManager.seek(e.detail.value)
    backgroundAudioManager.play()
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
    console.log();

    console.log(musicDetails.songs[0].dt);
    // 音乐的url
    const musicUrl = await request('/song/url', {
      id: id
    })

    // 歌词
    const lyrics = await request('/lyric', {
      id: id
    })
    if (lyrics.lrc) {
      // 处理歌词
      let lyricsResult = lyrics.lrc.lyric.split("\n").map(r => {
        let lyricsArr = r.trim().substr(1).split(']')
        return {
          time: lyricsArr[0],
          text: lyricsArr[1]
        }
      })
      console.log(lyricsResult);
      lyricsResult = lyricsResult.sort((a, b) => {
        return a.time > b.time ? 1 : -1
      })
      this.setData({
        lyricsData: lyricsResult,
      })
    }
    // console.log(lyrics.lrc.lyric);


    // console.log(lyrics.lrc.lyric.split("\n"));

    this.setData({
      musicUrlData: musicUrl.data[0],
      // lyricsData: lyrics,
      musicDetailsData: musicDetails.songs[0],
      totalTime: tools.formatMillisecond(musicDetails.songs[0].dt)
    })

    // 顶部标题
    wx.setNavigationBarTitle({
      title: musicDetails.songs[0].name
    })

    backgroundAudioManager.title = musicDetails.songs[0].name
    backgroundAudioManager.epname = musicDetails.songs[0].name
    backgroundAudioManager.singer = musicDetails.songs[0].ar[0].name
    backgroundAudioManager.coverImgUrl = musicDetails.songs[0].al.picUrl
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = musicUrl.data[0].url
  },
  // 播放类型的设置---列表循环|单曲循环|随机播放
  loopClick() {
    this.setData({
      playType: this.data.playType + 1
    })
    if (this.data.playType > 2) {
      this.setData({
        playType: 0
      })
    }
    console.log(this.data.playType);
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
    this.setData({
      listIdIndex: this.data.listIdIndex + 1
    })
    if (this.data.listIdIndex > this.data.playListData.length - 1) {
      this.setData({
        listIdIndex: 0
      })
    }
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
    // 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
    backgroundAudioManager.onCanplay(() => {
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
    // 
    backgroundAudioManager.onPause(() => {
      this.setData({
        isPlayOrPause: 0
      })
    })
    // 
    backgroundAudioManager.onTimeUpdate(() => {
      // console.log(backgroundAudioManager.currentTime);
      // console.log(tools.formatMillisecond(backgroundAudioManager.currentTime * 1000));
      let timeStr = tools.formatMillisecond(backgroundAudioManager.currentTime * 1000)
      for (let i = this.data.lyricsActiceIndex, len = this.data.lyricsData.length; i < len; i++) {
        // console.log(this.data.lyricsData[i].time.substring(0, this.data.lyricsData[i].time.indexOf('.')));
        if (this.data.lyricsData[i].time.substring(0, this.data.lyricsData[i].time.indexOf('.')) === timeStr) {
          if (this.data.lyricsActiceIndex !== i) {
            this.setData({
              lyricsActiceIndex: i
            })
            break
          }
        }
      }
      this.setData({
        sliderValue: backgroundAudioManager.currentTime,
        currentTime: tools.formatMillisecond(backgroundAudioManager.currentTime * 1000)
      })
    })
    // 监听背景音频自然播放结束事件
    backgroundAudioManager.onEnded(() => {
      if (this.data.playType === 0) {
        this.xiayiqu()
      } else if (this.data.playType === 1) {
        this.getMusicIdPerform(this.data.playListData[this.data.listIdIndex].id)
      } else {
        let rand = Math.floor(Math.random() * this.data.playListData.length);
        this.getMusicIdPerform(this.data.playListData[rand].id)
        console.log(rand);
      }
    })
    // 监听用户在系统音乐播放面板点击下一曲事件（仅iOS）
    backgroundAudioManager.onNext(() => {
      this.xiayiqu()
    })
    // 监听用户在系统音乐播放面板点击上一曲事件（仅iOS）
    backgroundAudioManager.onPrev(() => {
      this.shangyiqu()
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