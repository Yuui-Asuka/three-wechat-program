// pages/setting/setting.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    volume: 50,
  },

  switch1ChangeEvent: function(e) {
    app.globalData.backgroundMusic = e.detail.value;
    if (app.globalData.backgroundMusic) {
      app.globalData.bgm.play();
    } else {
      app.globalData.bgm.pause();
    }
  },

  switch2ChangeEvent: function(e) {
    app.globalData.soundEffect = e.detail.value;
  },

  changeEvent: function() {
    app.globalData.volume = this.data.volume;
    app.globalData.bgm.volume = this.data.volume;
  },

  returnEvent: function() {
    wx.navigateTo({
      url: '../gameMenu/gameMenu',
    })
  },
})
