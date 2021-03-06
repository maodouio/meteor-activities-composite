Template.activityEnrollments.onRendered(function(){
  Meteor.subscribe('userprofile', Meteor.userId());
});

Template.activityEnrollments.helpers({
  followersCount: function(){ //rint followers count
    var scene = Scenes.findOne({invitorOpenId: this.openid ,linkedId: this.activityId});
    var count;
    if(scene){
      count = Followers.find({sceneId:scene.sceneId}).count();
    }
    else{
      count = 0;
    }
    return count;
  },
  paidUser: function() {
    // var list = Enrollments.find({"isPay":true}).fetch();, {"isWaived":true}
    var list = Enrollments.find({"$or": [ {"isPay":true}] }).fetch();
    _.each(list,function(user){user.userprofile = UserProfiles.findOne({userId:user.userId})});
    // console.log(list);
    return list;
  },
  needPay: function() {
    var fee = Activities.findOne().fee;
    var isPay = Enrollments.findOne({userId: Meteor.userId() }).isPay;
    // var isWaived = Enrollments.findOne({userId: Meteor.userId() }).isWaived;
    // if(isWaived){
    //   return false;
    // }
    if(fee > 0 && !isPay) {
      return true;
    }
    return false;
  },
  state: function() {
    // var sum = Session.get("counterOne")*0.01 + Session.get("counterTwo")*0.02;
    // return sum.toFixed(2) * 100;
    return 1;
  },
  isEnrolledIn: function (activityId) {
    var result = Enrollments.findOne({userId: Meteor.userId(), activityId: activityId});
    return (result !== undefined);
  },
  enrollmentsCount: function () {
    return Enrollments.find().count();
  },
  statusIs: function(status){
    return this.status === status;
  },
  statusIsnotCancel: function() {
    // console.log('isNotCancel this.status', this.status);
    // var isNotCancel = Activities.findOne({status: this.status});
    // console.log("isNotCancel", isNotCancel);
    if(this.status == "CANCEL") {
      return false;
    }
    else {
      return true;
    }
  },
});

Template.activityEnrollments.events ({
  'click #wx_pay_button': function() {
    var amount = Activities.findOne().fee * 100;
    var openid = Meteor.user().profile.openid;
    // var orderNum =
    Meteor.call("createChargeWx", openid, amount, function(error, result) {
      if (error) {
        console.log("error", error);
      }
      if (result) {
        //调用微信支付控件
        pingpp.createPayment(result, function(result, err){
          // 处理错误信息
          if(result == "success") {
            var enrid = Enrollments.findOne({userId: Meteor.userId()})._id;
            Enrollments.update({_id: enrid}, {$set: {"isPay": true}});
            var userId = Meteor.userId();
            var title = Activities.findOne().title;
            var fee = Activities.findOne().fee;
            var supporter = Meteor.user().profile.nickname;
            var paytime = moment(Date()).format("YYYY-MM-DD HH:mm");
            var content = '您创建的活动:'+ title + ',新增一个报名者:'+ supporter
            +',支付'+ fee + '元,时间:'+ paytime;
            Meteor.call('sendMessageToUser',userId,content);
          }
        });
      }
    });
  },
  'click .delete-enrollment': function() {
    var eid = Enrollments.findOne({userId: Meteor.userId()})._id;
    console.log('eid is ', eid);
    if (confirm("你确定要取消报名吗？")) {
      if (Session.get("hasPackageActivityNotifications")) {
        var list = [Meteor.userId()];
        console.log('list', list);
        moment.lang('zh-cn');
        var time = moment(this.time).format('LLL');
        console.log('thme', time);
        // 慢下来、和心灵对话
        var content = "【报名取消通知】“" + this.title + "” 活动您的报名已取消，特此通知";
        Meteor.call("multiSendMessage", list, content);
      }
      Enrollments.remove({_id: eid});
      console.log("取消成功!");
    }
  },
  'click #fake_submit': function() {
    var userProfile = UserProfiles.findOne({"userId": Meteor.userId()});
    console.log(userProfile);

    if (userProfile) {
      Modal.show("needInfo",{type: "update",profile: userProfile});
      //return;
    } else {
      Modal.show("needInfo",{type: "insert",profile: userProfile});
      //return;
    }
    return;
  }
});

AutoForm.hooks({
  'enrollmentForm': {
    before: {
      insert: function(doc) {
        if (Meteor.user()) {
          doc.userId = Meteor.userId();
          doc.openid = Meteor.user().username;
          doc.headimgurl = Meteor.user().profile.headimgurl;
          doc.isRegistered = false;
          doc.createdAt = new Date();

          var activity = Activities.findOne();
          doc.activityId = activity._id;
          console.log('doc is _____', doc.activityId);
          return doc;
        } else {
          // window.location.href = "/userLogin?logintype=index";
          var activity = Activities.findOne();
          window.location.href = "/userLogin?logintype=/activities/"+activity._id;
        }
      }
    },
    onSuccess: function(operation, result, template) {
      var activity = Activities.findOne({_id: this.insertDoc.activityId});
      console.log('您已成功报名了!');
      if (Session.get("hasPackageActivityNotifications"))
      {
        console.log('this.insertDoc.userId-----------', this.insertDoc.userId);
        moment.lang('zh-cn');
        var time = moment(activity.createdAt).format('YYYY-MM-DD hh:mm');
        console.log('this time ', time);
        var list = [];
        list.push(this.insertDoc.userId);
        console.log('list is ----------', list);
        // Meteor.call("multiSendMessage", list, "您已经成功报名于" + time + "分" + "举办的活动【" + activity.title + "】" );
        Meteor.call("multiSendMessage", list, "【活动报名成功】“" + activity.title + "” 活动您已成功报名.\n\n时间：" + time + "\n地点：" + activity.where );
      }

      var invitorOpenId;

      if(Meteor.user().profile.openid){
        invitorOpenId = Meteor.user().profile.openid;
      }else {
        invitorOpenId = "obBdRwulmyqZD3lRxMWzuchDSFV0";  //default zhaoic's openid just for debug in local
      }

      var type = "ACTIVITY";
      var linkedId = activity._id;
      console.log("activity",activity);

      console.log("linkedId",linkedId);
      var sceneId;
      var mediaId;

      console.log("show modal invitor card");

      if(confirm("请确定生成您的二维码邀请卡，邀请5位好友减免报名费用。\n点击取消，则使用微信支付。")){
        console.log('\n\n[activity_enrollment.js] create new sceneid');
        Meteor.call("createInvitorCardImg",invitorOpenId,type,linkedId,Meteor.user().profile,function(e,r){
          console.log("show invitecard here");
          Modal.show("invitorCard", {activityId: linkedId});
        });
      }
    },
    onError: function(operation, error, template) {
      console.log('失败');
    }
  },

});
