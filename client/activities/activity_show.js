Template.activityShow.helpers({
  statusIs: function(status){
    return this.status === status;
  },
});

Template.activityShow.onCreated(function() {
  var activity = Activities.findOne();
  //window.location.href = "/activities/"+activity._id;
  Meteor.call("printLog", 'onCreated = ', activity._id);
});

Template.activityShow.events ({
  'click #login-btn': function() {
    console.log('login-btn', this);
    var activity = Activities.findOne();
    window.location.href = "/userLogin?logintype=/activities/"+activity._id;
  }
});

Template.activityShow.onRendered(function() {
  var imgUrl = $(".postImg > img")[0].src;
  var userId = this.data.activity.userId;
  var authorProfile = UserProfiles.findOne({userId: userId});
  console.log(authorProfile);

  var logoId = authorProfile.logo;
  var logo = Logos.findOne({_id: logoId});
  console.log(logo);
  if (logo)
  {
    imgUrl = logo.url();  // imgUrl is like /cfs/files/logos/Es8ijwmyGcEt8bp8B/searchicon.jpg
    imgUrl = window.location.origin + imgUrl;
  }
  console.log(imgUrl);

  var desc = "时间: " + moment(this.data.activity.time).format("YYYY-MM-DD");
  desc = desc + "\n地点: " + this.data.activity.where;
  desc = desc + "\n费用: " + this.data.activity.fee;
  if (this.data.activity.limit) {
    desc = desc + "\n人数: " + this.data.activity.limit;
  }
  console.log(desc);

	var share_config = {
       "share": {
          //"imgUrl": $(".postImg > img")[0].src,
          "imgUrl": imgUrl,
          //"desc" : this.data.activity.desc,
          "desc" : desc,
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
  Meteor.call("printLog", 'current.host = ', current.host);
  Meteor.call("printLog", 'this.data.activity._id = ', this.data.activity._id);

  if (current.host === "") {
    // route 过来的地址，微信只能获取到 /activities 截止，后面的取不到了
    url = window.location.origin + "/activities/";  // + this.data.activity._id
    //window.location.origin = window.location.origin + "/activities/";
    //url = window.location.origin;

    var purl = '<' + url + '>';
    Meteor.call("printLog", '1 url = ', purl);
  } else {
    // 刷新页面或者新建文章后跳转的页面，微信获取的是完整地址
    url = window.location.href;
    var purl = '<' + url + '>';
    Meteor.call("printLog", '2 url = ', purl);
  }

  // 根据不同情况传递不同的地址获取 signature
  Meteor.call("signature", url, function(error, result) {
    console.log(result.signature);
    Meteor.call("printLog", "result.signature", result.signature);

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
