Template.activityEdit.rendered = function() {
};

Template.activityEdit.helpers({
});

Template.activityEdit.events ({
});

AutoForm.hooks({
  'activityFormUpdate': {
    before: {
      update: function(doc) {
        console.log("AutoForm Hook update...");
        doc.updatedAt = new Date();
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      console.log("onSuccess update...");
      if (Session.get("hasPackageActivityNotifications"))
      {
        var enrollments = Enrollments.find().fetch();
        var list = [];
        _.each(enrollments, function(e) {
          console.log("e.userId = ", e.userId);
          list.push(e.userId);
        });
        var content = "【活动已更新】“" + this.currentDoc.title + "”活动已更新，查看详情" + "http://msaas.maodou.io/activities/" + this.docId;
        console.log("debug====>",content);
        console.log('list is --------->', list);
        Meteor.call("multiSendMessage", list, content);
      }

      Router.go('activityShow', {_id: this.docId});
    },

    onError: function(operation, error, template) {
      console.log('修改失败');
    }
  }
});
