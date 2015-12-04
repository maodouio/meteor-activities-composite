Template.activityComments.helpers({
});

Template.activityComments.helpers({
  user: function() {
    return Meteor.users.findOne({_id: this.userId});
  }
});

Template.userCommentCard.helpers({
  momentFormNow: function(date) {
    moment.lang('zh-cn');
    return moment(date).fromNow();
  }
});

AutoForm.hooks({
  'commentForm': {
    before: {
      insert: function(doc) {
        if (Meteor.user()) {
        // console.log("activity :", activity);
        var aid = Router.current().params._id;
        doc.linkedObjectId = aid;
        console.log("aid :", aid);
        console.log("this :", this);
        console.log("doc :", doc);
        console.log('id shibushi a ', doc.linkedObjectId);
        return doc;
        } else {
          if (confirm("请您登录后再提交评论!")) {
            var activity = Activities.findOne();
            window.location.href = "/userLogin?logintype=/activities/"+activity._id;
            console.log("跳转成功!");
          }
        }
      }
    },
    onSuccess: function(operation, result,template) {
      console.log('您已评论成功了!');
    },
    onError: function(operation, error, template) {
      console.log("operation :", operation);
      console.log("error :", error);
      console.log("template :", template);
      console.log('您已评论失败了');
    }
  }
});
