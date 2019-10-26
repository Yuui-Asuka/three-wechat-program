// pages/gobang/gobang.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },

  init: function() {
    console.log('init');

    this.CHESSNUM = 11;

    this.context = wx.createCanvasContext('chess', this);

    this.chessBoard = new Array();
    for (var i = 0; i < this.CHESSNUM; i++) {
      this.chessBoard[i] = new Array()
      for (var j = 0; j < this.CHESSNUM; j++) {
        this.chessBoard[i][j] = 0;
      }
    }

    this.count = 0;
    this.allWins = new Array();
    for (var i = 0; i < this.CHESSNUM; i++) {
      this.allWins[i] = new Array();
      for (var j = 0; j < this.CHESSNUM; j++) {
        this.allWins[i][j] = new Array();
      }
    }

    for (var i = 0; i < this.CHESSNUM; i++) {
      for (var j = 0; j < this.CHESSNUM - 4; j++) {
        for (var k = 0; k < 5; k++) {
          this.allWins[i][j + k][this.count] = true;
        }
        this.count++;
      }
    }

    for (var i = 0; i < this.CHESSNUM; i++) {
      for (var j = 0; j < this.CHESSNUM - 4; j++) {
        for (var k = 0; k < 5; k++) {
          this.allWins[j + k][i][this.count] = true;
        }
        this.count++;
      }
    }

    for (var i = 0; i < this.CHESSNUM - 4; i++) {
      for (var j = 0; j < this.CHESSNUM - 4; j++) {
        for (var k = 0; k < 5; k++) {
          this.allWins[i + k][j + k][this.count] = true;
        }
        this.count++;
      }
    }

    for (var i = 4; i < this.CHESSNUM; i++) {
      for (var j = 0; j < this.CHESSNUM - 4; j++) {
        for (var k = 0; k < 5; k++) {
          this.allWins[i - k][j + k][this.count] = true;
        }
        this.count++;
      }
    }

    console.log(this.count);
    this.myWin = new Array();
    this.computerWin = new Array();
    for (var i = 0; i < this.count; i++) {
      this.myWin[i] = 0;
      this.computerWin[i] = 0;
    }

    this.me = true;
    this.finished = false;

    // http://fjdx.sc.chinaz.com/Files/DownLoad/sound1/201501/5390.wav
    this.sound = wx.createInnerAudioContext();
    this.sound.autoplay = false;
    this.sound.src = 'http://fjdx.sc.chinaz.com/Files/DownLoad/sound1/201501/5390.wav';
    this.sound.volume = 100;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawChessBoard();
  },

  
  drawChessBoard: function () {
    console.log('drawChessBoard');
    this.context.strokeStyle = "#fff";
    // console.log(this.CHESSNUM);
    for (var i = 0; i < this.CHESSNUM; i++) {
      this.context.moveTo(15 + i * 30, 15);
      this.context.lineTo(15 + i * 30, 315);
      this.context.stroke();
      this.context.moveTo(15, 15 + i * 30);
      this.context.lineTo(315, 15 + i * 30);
      this.context.stroke();
    }
    this.context.draw()
  },

  oneStep: function (i, j, me) {
    // console.log(me);
    if (app.globalData.soundEffect) {
      this.sound.play();
    }

    this.context.beginPath();
    var gradient = this.context.createCircularGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13);
    if (this.me) {
      // console.log('black');
      // gradient.addColorStop(0, "#0a0a0a");
      // gradient.addColorStop(1, "#666666");
      this.context.setFillStyle('white');
    } else {
      // console.log('white');
      // gradient.addColorStop(0, "#d1d1d1");
      // gradient.addColorStop(1, "#f9f9f9");
      this.context.setFillStyle('black');
    }

    this.context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
    this.context.setFillStyle(gradient);

    // this.context.fillRect(30 * i, 30 * j, 26, 26);
    // console.log(gradient);
    
    this.context.fill();
    this.context.draw(true);
    this.context.closePath();
  },

  onChessBoardClick: function(e) {
    // console.log('chess board click');
    // console.log(e);
    if (this.finished) {
      console.log('finished');
      return;
    }
    if (!this.me) {
      // console.log('not me');
      // console.log(this.me);
      return;
    }

    var x = e.detail.x;
    var y = e.detail.y;

    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);

    // console.log('on chess click');
    // console.log(i);
    // console.log(j);
    if (this.chessBoard[i][j] == 0) {
      // console.log(this.chessBoard[i][j]);
      // console.log("Me Step");
      this.oneStep(i, j, this.me);
      this.chessBoard[i][j] = 1;
      for (var k = 0; k < this.count; k++) {
        if (this.allWins[i][j][k]) {
          this.myWin[k]++;
          this.computerWin[k] = 6;
          if (this.myWin[k] == 5) {
            wx.showToast({
              title: 'Computer Win',
              icon: 'success',
              duration: 50000,
            })
            this.finished = true;
          }
        }
      }

      if (!this.finished) {
        this.me = !this.me;
        this.computerAI();
      }
    }
  },

  computerAI: function() {
    console.log("Computer Step");
    var myScore = [];
    var computerScore = [];
    for (var i = 0; i < this.CHESSNUM; i++) {
      myScore[i] = [];
      computerScore[i] = [];
      for (var j = 0; j < this.CHESSNUM; j++) {
        myScore[i][j] = 0;
        computerScore[i][j] = 0;
      }
    }

    var max = 0;
    var maxI = 0;
    var maxJ = 0;
    for (var i = 0; i < this.CHESSNUM; i++) {
      for (var j = 0; j < this.CHESSNUM; j++) {
        if (this.chessBoard[i][j] == 0) {
          for (var k = 0; k < this.count; k++) {
            if (this.allWins[i][j][k]) {
              if (this.myWin[k] == 1) {
                myScore[i][j] += 200;
              } else if (this.myWin[k] == 2) {
                myScore[i][j] += 400;
              } else if (this.myWin[k] == 3) {
                myScore[i][j] += 2000;
              } else if (this.myWin[k] == 4) {
                myScore[i][j] += 10000;
              }
              if (this.computerWin[k] == 1) {
                computerScore[i][j] += 220;
              } else if (this.computerWin[k] == 2) {
                computerScore[i][j] += 420;
              } else if (this.computerWin[k] == 3) {
                computerScore[i][j] += 2200;
              } else if (this.computerWin[k] == 4) {
                computerScore[i][j] += 20000;
              }
            }
          }

          if (myScore[i][j] > max) {
            max = myScore[i][j];
            maxI = i;
            maxJ = j;
          } else if (myScore[i][j] == max) {
            if (computerScore[i][j] > computerScore[maxI][maxJ]) {
              maxI = i;
              maxJ = j;
            }
          }
          if (computerScore[i][j] > max) {
            max = computerScore[i][j];
            maxI = i;
            maxJ = j;
          } else if (computerScore[i][j] == max) {
            if (myScore[i][j] > myScore[maxI][maxJ]) {
              maxI = i;
              maxJ = j;
            }
          }
        }
      }
    }

    this.oneStep(maxI, maxJ, false);
    this.chessBoard[maxI][maxJ] = 2;

    for (var k = 0; k < this.count; k++) {
      if (this.allWins[maxI][maxJ][k]) {
        this.computerWin[k]++;
        this.myWin[k] = 6;
        if (this.computerWin[k] == 5) {
          wx.showToast({
            title: 'Computer Win',
            icon: 'success',
            duration: 50000,
          })
          this.finished = true;
        }
      }
    }
    if (!this.finished) {
      this.me = !this.me;
    }
  },

  restartEvent: function() {
    wx.reLaunch({
      url: '../gobang/gobang',
    })
  },

  exitEvent: function() {
    wx.navigateTo({
      url: '../gameMenu/gameMenu',
    })
  },
})
