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
      var content = "温馨提示: 你报名的于" + time + "分" +  "举办的活动[" + this.title + "]已取消!";
      Meteor.call("multiSendMessage", list, content);
    }
  },
  'click .recoverActicity': function( ) {
    console.log('活动已恢复!');
    Activities.update({_id: this._id}, {$set: {"status": "ENROLLING"}});
  },
  'click .closeActicity': function( ) {
    console.log('活动已结束!');
    Activities.update({_id: this._id}, {$set: {"status": "CLOSED"}});
  }
});
