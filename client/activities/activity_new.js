Template.activityNew.rendered = function() {
};

Template.activityNew.helpers({
});

Template.activityNew.events ({
});

AutoForm.hooks({
  'activityForm': {
    before: {
      insert: function(doc) {
        console.log(doc);
        doc.createdAt = new Date();
        doc.status = 'ENROLLING';
        return doc;
      }
    },
    onSuccess: function (operation, result, template) {

      console.log('New activitie inserted successfully!');
      if (Session.get("hasPackageActivityNotifications"))
      {
        var picurl = $('.form-group div > img')[0].src;
      //  活动创建发送图文消息
        var content = {
          title: "【新提醒】有人发布了一个活动 ",
          description: ">>点击查看<<",
          url: "http://x-lab.maodou.io/activities/"+ result,
          picurl: picurl
        };
        var list = [];
        Meteor.call('getAllUserId', function(error, result) {
          list = result;
          Meteor.call("multiSendNews", list, content);
        });
      }
      Router.go('activitiesIndex', {_id: result});
    },

    onError: function(operation, error, template) {
      console.log(error);
    }
  }
});
