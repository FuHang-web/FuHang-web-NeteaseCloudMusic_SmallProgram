// pages/playDetails/playDetails.js
import request from '../../utils/request'
import tools from '../../utils/tools'
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch: false, // 歌词与播放器页面的切换
    // musicId: '',
    // musicName: '',
    musicUrlData: '', // 音乐mp3数据
    lyricsData: '', // 歌词数据
    musicDetailsData: '', // 歌曲详细数据
    // src: '',
    isPlayOrPause: false, // 播放，点击暂停
    musicLength: 0, // 音乐时间长度
    listIdIndex: 0, // 歌单列表当前歌曲的下标
    playListData: [], // 当前歌单所有音乐
    sliderValue: 0, // 进度条的value值
    playType: 0, // 0 列表循环，1 单曲循环，2 随机播放
    lyricsActiceIndex: 0, // 歌词单行选中
    currentTime: '00:00', // 当前歌曲时间
    totalTime: '00:00', // 总的音乐时长
    playerDisc: false, // 歌曲播放，顶部图片状态
    commentsNum: 0, // 评论条数
  },
  // 测试
  testChange(e) {
    console.log(e.detail.current);
    this.getMusicIdPerform(this.data.playListData[e.detail.current].id)
  },
  // 处理评论条数
  formatCommentsNum(value) {
    let number = value.toString()
    let len = '1' + '0'.repeat(number.length - 1)
    if (number.length < 4) {
      return number
    } else if (number.length >= 4 && number.length < 5) {
      return '999+'
    } else if (number.length >= 5 && number.length < 9) {
      return parseInt(len / 10000) + 'w+';
    } else if (number.length >= 9) {
      return parseInt(len / 10000000) + 'kw+'
    }
  },
  // 歌词与播放器页面的切换
  clickSwitch() {
    console.log(this.data.switch);
    console.log(!this.data.switch);
    const _self = this
    this.setData({
      switch: !_self.data.switch
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
    if (this.data.isPlayOrPause) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlayOrPause: !this.data.isPlayOrPause,
      playerDisc: !this.data.playerDisc,
    })
  },
  // 获取到音乐ID之后执行
  async getMusicIdPerform(musicId) {
    // const _self = this
    // 音乐的详情
    const {
      songs: [musicDetails]
    } = await request('/song/detail', {
      ids: musicId
    })
    // 音乐的url
    const {
      data: [musicUrl]
    } = await request('/song/url', {
      id: musicId
    })
    // 获取歌曲的评论数据
    const {
      total: commentsNum
    } = await request('/comment/music', {
      id: musicId
    })
    this.setData({
      musicUrlData: musicUrl,
      musicDetailsData: musicDetails,
      totalTime: tools.formatMillisecond(musicDetails.dt),
      commentsNum: this.formatCommentsNum(commentsNum)
    })
    // 歌词
    const {
      lrc: lyrics
    } = await request('/lyric', {
      id: musicId
    })
    console.log(lyrics);
    if (lyrics) {
      // 处理歌词
      let lyricsResult = lyrics.lyric.split("\n").map(r => {
        let lyricsArr = r.trim().substr(1).split(']')
        return {
          time: lyricsArr[0],
          text: lyricsArr[1]
        }
      })
      lyricsResult = lyricsResult.sort((a, b) => {
        return a.time > b.time ? 1 : -1
      })
      this.setData({
        lyricsData: lyricsResult,
        lyricsActiceIndex: 0
      })
    }

    // 顶部标题
    wx.setNavigationBarTitle({
      title: musicDetails.name
    })
    backgroundAudioManager.title = musicDetails.name
    backgroundAudioManager.epname = musicDetails.name
    backgroundAudioManager.singer = musicDetails.ar[0].name
    backgroundAudioManager.coverImgUrl = musicDetails.al.picUrl
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = musicUrl.url
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
  },
  onPrev() {
    console.log(this.data.listIdIndex);
    backgroundAudioManager.stop()
    this.setData({
      playerDisc: false,
      isPlayOrPause: false,
      listIdIndex: this.data.listIdIndex - 1
    })
    console.log(this.data.listIdIndex);
    if (this.data.listIdIndex === -1) {
      this.setData({
        listIdIndex: this.data.playListData.length - 1
      })
    }
    this.getMusicIdPerform(this.data.playListData[this.data.listIdIndex].id)
  },
  onNext() {
    console.log(typeof this.data.listIdIndex);
    backgroundAudioManager.stop()
    console.log(this.data.listIdIndex);
    console.log(this.data.playListData);

    this.setData({
      playerDisc: false,
      isPlayOrPause: false,
      listIdIndex: this.data.listIdIndex + 1
    })
    console.log(typeof this.data.listIdIndex);
    console.log(this.data.listIdIndex);
    if (this.data.listIdIndex > this.data.playListData.length - 1) {
      this.setData({
        listIdIndex: 0
      })
    }
    console.log(this.data.listIdIndex);
    this.getMusicIdPerform(this.data.playListData[this.data.listIdIndex].id)
    console.log(this.data.playListData);
    console.log(this.data.listIdIndex);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options);
    // options = {
    //   index: "0",
    //   musicId: "1426649237"
    // }
    const systemData = tools.deviceInformation()
    let height = systemData.windowHeight * (750 / systemData.windowWidth);
    this.setData({
      musicId: options.musicId,
      height: `${height}rpx`,
    })
    try {
      // 获取存储在storage中的榜单详情
      let rankingList = wx.getStorageSync('rankingList')
      if (rankingList) {
        console.log(typeof options.index);

        this.setData({
          playListData: rankingList,
          listIdIndex: parseInt(options.index)
        })
        this.getMusicIdPerform(options.musicId)
      }
    } catch (e) {
      console.log(e);
    }
    // let currentProfileIndex = (playList.playlist.tracks || []).findIndex((profile) => profile.id === this.data.musicId);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 监听背景音频进入可播放状态事件。 但不保证后面可以流畅播放
    backgroundAudioManager.onCanplay(() => {
      console.log('开始');
      this.setData({
        isPlayOrPause: true,
        playerDisc: true
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
        isPlayOrPause: false,
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
        this.onNext()
      } else if (this.data.playType === 1) {
        this.getMusicIdPerform(this.data.playListData[this.data.listIdIndex].id)
      } else {
        let rand = Math.floor(Math.random() * this.data.playListData.length);
        this.setData({
          listIdIndex: rand
        })
        this.getMusicIdPerform(this.data.playListData[this.data.listIdIndex].id)
        console.log(rand);
      }
    })
    // 监听用户在系统音乐播放面板点击下一曲事件（仅iOS）
    backgroundAudioManager.onNext(() => {
      this.onNext()
    })
    // 监听用户在系统音乐播放面板点击上一曲事件（仅iOS）
    backgroundAudioManager.onPrev(() => {
      this.onPrev()
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