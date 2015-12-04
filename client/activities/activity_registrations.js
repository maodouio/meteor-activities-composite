Template.activityRegistrations.helpers({
  statusIs: function(status){
    return this.status === status;
  },
  userIsAuthor: function(){
    // this == activity
    return this.userId === Meteor.userId();
  },
  qrcode: function() {
    var activity = Activities.findOne();
    if (activity.status === "REGISTERING") {
      $("#qrcode").css("display", "block");
    } else {
      $("#qrcode").css("display", "none");
    }
  },
  enrolledRegistered: function() {
    return Registrations.find({isEnrolled: true});
  },
  enrolledRegisteredCount: function() {
    return Registrations.find({isEnrolled: true}).count();
  },
  enrolledUnregistered: function() {
    return Enrollments.find({isRegistered: false});
  },
  enrolledUnregisteredCount: function() {
    return Enrollments.find({isRegistered: false}).count();
  },
  unenrolledRegistered: function() {
    return Registrations.find({isEnrolled: false});
  },
  unenrolledRegisteredCount: function() {
    return Registrations.find({isEnrolled: false}).count();
  },
});

Template.activityRegistrations.onRendered(function () {
  var qrcodeUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?" +
    "appid=wx433268b6e0835231&" +
    "redirect_uri=http://x-lab.maodou.io/wechatLogin&" +
    "response_type=code&" +
    "scope=snsapi_userinfo&" +
    "state=" + this.data.logintype + "#wechat_redirect";

  $('#qrcode').qrcode({
    "render": "div",
    "size": 400,
    "color": "#000",
    "text": qrcodeUrl
  });
  // auto register
  var result = Registrations.find({userId: Meteor.userId(), activityId: this.data.activity._id}).fetch();
  console.log("result --- ", typeof result);
  if (result.length === 0) {
    $("#registrationsSuccess").trigger("click");
  }
});

AutoForm.hooks({
  'registrationForm': {
    before: {
      insert: function(doc) {
        var aid = Activities.findOne()._id;

        doc.userId = Meteor.userId();
        doc.headimgurl = Meteor.user().profile.headimgurl;
        doc.createdAt = new Date();
        doc.activityId = aid;

        var result = Enrollments.findOne({userId: Meteor.userId()});
        if (result == undefined)
        {
          // set this registration isEnrolled == false
          doc.isEnrolled = false;
        }
        else
        {
          // set this registration isEnrolled == true
          doc.isEnrolled = true;
          // set this enrollment isRegistered == true
          Enrollments.update({_id: result._id}, {$set: {isRegistered: true}});
        }

        return doc;
      }
    },
    onSuccess: function(operation, result,template) {
      console.log('签到成功!');
      // Router.go('/activities/'+doc.activityId+'/registrations/');
      console.log('this ----', this.insertDoc.activityId);
    },
    onError: function(operation, error, template) {
      console.log('签到失败');
    }
  }
});

Template.activityRegisterButton.onRendered(function() {

});

Template.activityRegisterButton.helpers({
  statusIs: function(status){
    return this.status === status;
  },
  userIsAuthor: function(){
    // this == activity
    return this.userId === Meteor.userId();
  },
  isRegistered: function() {
    // 判断该用户是否已经签到，如果已经签则直接显示进入签到页按钮
    if (Meteor.user()) {
      var result = Registrations.findOne({userId: Meteor.user()._id});
      console.log("userId === ", Meteor.user()._id);
      console.log("result :", result);
      return (result !== undefined);
    } else {
      return false;
    }
  },
  isEnrolledIn: function (activityId) {
    var result = Enrollments.findOne({userId: Meteor.userId(), activityId: activityId});
    return (result !== undefined);
  },
});

Template.activityRegisterButton.events({
  'click #begin-register-btn': function() {
    Activities.update({_id: this._id}, {$set: {"status": "REGISTERING"}});
    if (Session.get("hasPackageActivityNotifications"))
    {
      var enrollments = Enrollments.find().fetch();
      var list = [];
      _.each(enrollments, function(e) {
        console.log("e.userId = ", e.userId);
        list.push(e.userId);
      });

      // 文本消息
      // var content = "[" + this.title + "]活动就要开始啦，你可以入场签到了。";
      // Meteor.call("multiSendMessage", list, content);
      var picurl  = $('.pic .postImg > img')[0].src;
      var description = "您报名的活动【" + this.title + "】\n 已经开始签到了，请前往签到处扫描二维码。";
      var content = {
        title: "【签到进行中...】",
        // description: this.desc,
        description: description,
        url: "http://x-lab.maodou.io/activities/"+ this._id,
        picurl: picurl
      };
      Meteor.call("multiSendNews", list, content);
    }
    this.render();
  },
  'click #scan-qrcode': function() {
    wx.scanQRCode({
      needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
      }
    });
  }
});
