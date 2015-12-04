Template.activityEnrollments.helpers({
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
        var content = "你已取消于" + time + "分" +  "举办的活动【" + this.title + "】的报名!";
        Meteor.call("multiSendMessage", list, content);
      }
      Enrollments.remove({_id: eid});
      console.log("取消成功!");
    }
  }
});

AutoForm.hooks({
  'enrollmentForm': {
    before: {
      insert: function(doc) {
        if (Meteor.user()) {
          doc.userId = Meteor.userId();
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
      if (Session.get("hasPackageActivityNotifications"))
      {
        var activity = Activities.findOne({_id: this.insertDoc.activityId});
        console.log('this.insertDoc.userId-----------', this.insertDoc.userId);
        moment.lang('zh-cn');
        var time = moment(activity.createdAt).format('LLL');
        console.log('this time ', time);
        var list = [];
        list.push(this.insertDoc.userId);
        console.log('list is ----------', list);
        Meteor.call("multiSendMessage", list, "您已经成功报名于" + time + "分" + "举办的活动【" + activity.title + "】" );
      }
      console.log('您已成功报名了!');
    },
    onError: function(operation, error, template) {
      console.log('失败');
    }
  },

});
