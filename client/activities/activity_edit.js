Template.activityEdit.onRendered(function(){
  console.log(this.data);
  if (this.data.picture) {
    Session.set("logoImage", this.data.picture);
  }
});

Template.activityEdit.helpers({
  imageUrl: function() {
    return Session.get("logoImage");
  },
  hasImage:function() {
    return !!Session.get("logoImage");
  }
});

Template.activityEdit.events ({
  'click [name="imageUploadBtn"]': function(e, t) {
    $( "#myFileInput" ).trigger( "click" );
  },
  'click .delete-btn-draw': function(e, t) {
    Session.set("logoImage","");
  }
});

AutoForm.hooks({
  'activityFormUpdate': {
    before: {
      update: function(doc) {
        console.log("AutoForm Hook update...");
        doc.updatedAt = new Date();
        doc.$set.picture = Session.get('logoImage') || "";
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
        var content = "【活动已更新】“" + this.currentDoc.title + "”活动已更新，查看详情" + "http://" + Meteor.settings.public.subdomainName + ".maodou.io/activities/" + this.docId;
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
