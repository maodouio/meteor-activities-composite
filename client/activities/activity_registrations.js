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
  var loginType = this.data.logintype;
  var qrcodeUrl = window.location.href;

  $('#qrcode').qrcode({
    "size": 400,
    "color": "#000",
    "text": qrcodeUrl
  });

  // auto register
  var userId = Meteor.userId();
  var activityId = this.data.activity._id;
  var result = Registrations.find({userId: userId, activityId: activityId}).fetch();
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
      var content = "【活动开始签到】“" + this.title + "”活动已开始，请大家扫码" + "http://mbaas.maodou.io/activities/" + this._id;
      Meteor.call("multiSendMessage", list, content);
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
