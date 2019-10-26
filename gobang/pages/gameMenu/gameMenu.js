// pages/gameMenu/gameMenu.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  startEvent: function() {
    wx.navigateTo({
      url: '../gobang/gobang',
    })
  },

  setEvent: function() {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },

  returnEvent: function() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // http://fjdx.sc.chinaz.com/Files/DownLoad/sound1/201809/10635.wav
    app.globalData.bgm = wx.getBackgroundAudioManager();
    app.globalData.bgm.src = "http://fjdx.sc.chinaz.com/Files/DownLoad/sound1/201809/10635.wav";
    app.globalData.bgm.title = "backgro";
    app.globalData.bgm.play();
  },
})
