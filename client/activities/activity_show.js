Template.activityShow.helpers({
  statusIs: function(status){
    return this.status === status;
  },
});

Template.activityShow.events ({
  'click #login-btn': function() {
    console.log('login-btn', this);
    var activity = Activities.findOne();
    window.location.href = "/userLogin?logintype=/activities/"+activity._id;
  }
});

Template.activityShow.onRendered(function() {
	var share_config = {
       "share": {
          "imgUrl": $(".postImg > img")[0].src,
          "desc" : this.data.activity.desc,
          "title" : this.data.activity.title,
          "link": window.location.href,
          "success":function(){
            //分享成功后的回调函数
          },
          'cancel': function () {
            // 用户取消分享后执行的回调函数
          }
      }
  };

  var url = "";
  var current = Iron.Location.get();

  if (current.host === "") {
    // route 过来的地址，微信只能获取到 /activities 截止，后面的取不到了
    // url = window.location.origin + "/activities/";
    url ="http://mbaas.maodou.io/activities";
  } else {
    // 刷新页面或者新建文章后跳转的页面，微信获取的是完整地址
    url = window.location.href;
  }

  // 根据不同情况传递不同的地址获取 signature
  Meteor.call("signature", url, function(error, result) {
    console.log(result.signature);
    Meteor.call("printLog", result.signature);

    wx.config({
      debug: false,
      appId: result.appId,
      timestamp: result.timestamp,
      nonceStr: result.nonceStr,
      signature: result.signature,
      jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'chooseImage',
        'uploadImage',
				'scanQRCode',
      ]
    });

    wx.ready(function () {
      wx.onMenuShareAppMessage(share_config.share);
      wx.onMenuShareTimeline(share_config.share);
      wx.onMenuShareQQ(share_config.share);
    });

    wx.error(function(res){
      Meteor.call("printLog", "wx.error :", res.errMsg);
    });
  });
});
