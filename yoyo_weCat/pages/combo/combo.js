var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    resData: {},
    userInfo: {},
    showModel: false,
    animationData: {},
    hostUrl: "",
    topicType: ["", "判断题", "单选题", "阅读理解"],
    showType: ["", true, false],
    showRight: ["", "A", "B", "C", "D"],
    nowCurrent: 0,
    payType: "",
    wrongNumb: 0,
    rightNumb: 0,
    timeHour: "00",
    timeMin: "00",
    timeSec: "00",
    article: "",
    topicResult: "",
    userScore: 0,
    showWrong: false,
    wrongTip: "wrongTip"
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    that.setData({
      hostUrl: app.globalData.hostUrl,
      userInfo: app.globalData.userInfo,
      payType: options.payType,
      postType: options.postType,
      certType: options.certType,
      key: options.examId + "-" + options.postType + "-" + options.certType + "key"
    })
    wx.showLoading({
      title: '正在加载试题...'
    }),
      /*获取缓存*/
      wx.getStorage({
        key: that.data.key,
        success: function (res) {
          wx.hideLoading();
          that.setData({
            resData: res.data
          });
          that.setData({
            nowCurrent: that.data.resData.nowCurrent
          })
          //that.countDown(that.data.resTime);
        },
        fail: function () {
          wx.request({
            url: app.globalData.hostUrl + '/admin.do?method=getPayTopicByRang',
            data: {
              "pay_type": options.payType,
              "post_type": options.postType,
              "cert_type": options.certType,
              "share_type": options.shareType,
              "examId": options.examId
            },
            success: function (res) {
              wx.hideLoading();
              if (res.data.LIST.length == 0) {
                wx.showToast({
                  title: '暂无此类试题',
                })
              } else {
                wx.setStorage({
                  key: that.data.key,
                  data: res.data,
                  success: function () {
                    console.log("添加缓存成功");
                  }
                })
              }

              that.setData({
                resData: res.data
              });
              // var time = parseInt(that.data.resData.exam_time * 60);
              // that.countDown(time);
            }
          })
        }
      })
  },
  getOurUserInfo: function () {
    var that = this;
    var openid = app.globalData.openid;
    wx.request({
      url: app.globalData.hostUrl + '/admin.do?method=getUserCoin', //获取平台用户解析币
      method: 'get',
      data: {
        'WID': openid
      },
      success: function (d) {
        that.setData({
          userInfo: {
            coin: d.data.user_coin
          }
        })
      }
    })
  },
  countDown: function (seconds) {
    var that = this;
    var time = setInterval(function () {
      var day = 0, hour = 0, minute = 0, second = 0;
      if (seconds > 0) {
        day = Math.floor(seconds / (60 * 60 * 24));
        hour = Math.floor(seconds / (60 * 60)) - (day * 24);
        minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        if (minute <= 9) minute = '0' + minute;
        if (second <= 9) second = '0' + second;
        that.setData({
          timeHour: hour,
          timeMin: minute,
          timeSec: second
        })
        seconds--;
        that.setData({
          resTime: seconds
        })
        if (seconds == 0) {
          clearTimeout(time)
        }
      } else {
        var pass = that.data.resData.poss_score;
        var userScore = that.data.userScore;
        wx.navigateTo({
          url: '/pages/result/result?passScore=' + pass + '&userScore=' + userScore
        })
      }
    }, 1000)
  },
  selectOption: function (e) {
    var that = this;
    var index = that.data.nowCurrent;
    that.setData({
      topicResult: e.detail.value
    })
    var param = {};
    var chooseItem = "resData.LIST[" + index + "].chooseItem";
    var choose1 = "resData.LIST[" + index + "].choose1";
    var choose2 = "resData.LIST[" + index + "].choose2";
    var choose3 = "resData.LIST[" + index + "].choose3";
    var choose4 = "resData.LIST[" + index + "].choose4";
    switch (that.data.topicResult) {
      case "1":
        param[choose1] = "wrongTipCol";
        break;
      case "2":
        param[choose2] = "wrongTipCol";
        break;
      case "3":
        param[choose3] = "wrongTipCol";
        break;
      case "4":
        param[choose4] = "wrongTipCol";
        break;
      default:
        break
    }
    param[chooseItem] = that.data.topicResult;
    that.setData(param);
  },
  swiperChange: function (e) {
    var that = this;
    var param = {};
    var nowCurrent = "resData.nowCurrent";
    param[nowCurrent] = e.detail.current;
    that.setData(param);
    that.setData({
      nowCurrent: e.detail.current
    })
  },
  showRight: function () {
    var that = this;
    var index = that.data.nowCurrent;
    if (that.data.resData.LIST[index].chooseItem == "" || !that.data.resData.LIST[index].chooseItem) {
      wx.showToast({
        title: '请选择一个选项!'
      })
      return;
    }
    var param = {};
    var showRight = "resData.LIST[" + that.data.nowCurrent + "].showRight";
    var topicDisable = "resData.LIST[" + that.data.nowCurrent + "].topicDisable";
    var btnDisabled = "resData.LIST[" + that.data.nowCurrent + "].btnDisabled";
    param[showRight] = '1';
    param[topicDisable] = '1';
    param[btnDisabled] = true;
    that.setData(param);
    if (that.data.resData.LIST[index].topicRightOption == that.data.topicResult) {
      var param = {};
      var wrongTip = "resData.LIST[" + index + "].wrongTip";
      var rightNumb = "resData.rightNumb";
      param[rightNumb] = that.data.resData.rightNumb + 1;
      param[wrongTip] = "rightTip";
      that.setData(param);
      switch (that.data.resData.LIST[index].topicType) {
        case "1":
          that.setData({
            userScore: that.data.userScore + parseFloat(that.data.resData.topic_a_score)
          });
          break;
        case "2":
          that.setData({
            userScore: that.data.userScore + parseFloat(that.data.resData.topic_b_score)
          })
          break;
        case "3":
          that.setData({
            userScore: that.data.userScore + parseFloat(that.data.resData.topic_c_score)
          })
          break;
        default:
          break;
      }
    } else {
      var param = {};
      var wrongNumb = "resData.wrongNumb";
      var isWrong = "resData.LIST[" + index + "].isWrong";
      var wrongTip = "resData.LIST[" + index + "].wrongTip";
      param[wrongNumb] = that.data.resData.wrongNumb + 1;
      param[isWrong] = true;
      param[wrongTip] = "wrongTip";
      that.setData(param);
    }
    wx.setStorageSync(that.data.key, that.data.resData)
  },
  showWrong: function () {
    var that = this;
    that.setData({
      showWrong: true
    })
  },
  subCoin: function () {
    var that = this;
    var openid = app.globalData.openid;
    var coin = app.globalData.payCoin;
    wx.request({
      url: app.globalData.hostUrl + '/admin.do?method=subCoin',
      data: {
        "WID": openid,
        "COIN": coin
      },
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function () {
        that.setData({
          userInfo: {
            coin: that.data.userInfo.coin - coin
          }
        })
      }
    })
  },
  prev: function () {
    var that = this;
    var index = that.data.nowCurrent;
    if (index > 0) {
      that.setData({
        nowCurrent: that.data.nowCurrent - 1
      })
    }

  },
  next: function () {
    var that = this;
    var index = that.data.nowCurrent;
    if (index < that.data.resData.LIST.length - 1) {
      that.setData({
        nowCurrent: that.data.nowCurrent + 1
      })
    }
  },
  submit: function () {
    var that = this;
    var pass = that.data.resData.poss_score;
    var userScore = that.data.userScore;
    var totalScore = that.data.resData.total_score;

    var totleNumb = that.data.resData.LIST.length;
    var wrongNumb = that.data.resData.wrongNumb + that.data.resData.rightNumb;
    var residueNumb = totleNumb - wrongNumb;
    if (residueNumb > 0) {
      wx.showModal({
        title: '提示',
        content: '您还有' + residueNumb + '未做，确定提交？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/result/result?passScore=' + pass + '&userScore=' + userScore
            })
          } else {

          }
        }
      })
    }else{
      wx.navigateTo({
        url: '/pages/result/result?passScore=' + pass + '&userScore=' + userScore
      })
    }
  },
  //显示模态框
  showModel: function () {
    var that = this;
    var index = that.data.nowCurrent;
    that.setData({
      article: that.data.resData.LIST[index].topicArticle,
      showModel: true
    })
  },
  hideModel: function () {
    this.setData({
      showModel: false
    })
  },
  closeWrong: function () {
    var that = this;
    that.setData({
      showWrong: false
    })
  },
  returnCheck: function () {
    return "wrongTip";
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.getOurUserInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this;
    clearTimeout(that.countDown.time)
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