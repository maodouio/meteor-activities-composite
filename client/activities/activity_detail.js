Template.activityDetail.helpers({
  str2html: function(str) {
   //console.log(str);
   var str2 = str.replace(new RegExp('\r?\n','g'), '<br />');
   //console.log(str2);
   return str2;
  },
  isAuthor: function() {
    var currentId = Meteor.userId();
    var author = Activities.findOne(this);
    if (author) {
      return (currentId == author.userId);
    } else {
      return false;
    }
  },
  userIsAuthor: function(){
    // this == activity
    return this.userId === Meteor.userId();
  },
  statusIs: function(status){
    // console.log("statusIs this :", this);
    return this.status === status;
  },
});

Template.activityDetail.events ({
  'click .cancelActicity': function( ) {
    if(confirm("你确定要取消这个活动吗?")) {
      console.log('活动已取消!');
      Activities.update({_id: this._id}, {$set: {"status": "CANCEL"}});

      if (Session.get("hasPackageActivityNotifications"))
      {
        var enrollments = Enrollments.find().fetch();
        var list = [];
        _.each(enrollments, function(e) {
          console.log("e.userId = ", e.userId);
          list.push(e.userId);
        });
        moment.lang('zh-cn');
        var time = moment(this.time).format('LLL');
        console.log('thme', time);
        var content = "【活动取消通知】“" + this.title + "” 活动已取消，特此通知";
        Meteor.call("multiSendMessage", list, content);
      }
    }
  },
  'click .recoverActicity': function( ) {
    console.log('活动已恢复!');
    Activities.update({_id: this._id}, {$set: {"status": "ENROLLING"}});
  },
  'click .closeActicity': function( ) {
    if(confirm("你确定要结束这个活动吗?")) {
      console.log('活动已结束!');
      Activities.update({_id: this._id}, {$set: {"status": "CLOSED"}});
    }
  },
  'click #send_msg_btn': function() {
    var fromUser = Meteor.userId();
    var toUser = [];
    _.each(Enrollments.find().fetch(), function(enrollment) {
      toUser.push(enrollment.userId);
    });
    var data = {
      fromUser		: fromUser,
      toUser			: toUser,
      type        : "multi"
    }
    Modal.show("chatWindow", data);
  },
  'click #delete_activity': function() {
    var activityId = this._id;
    if (confirm("你确定要删除这个活动吗?")) {
      console.log(activityId);
      Meteor.call("deleateActivity", activityId, function(error, result){
        window.location.href = "/activities";
      });
    }
  },
});
