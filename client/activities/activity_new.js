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
        var firstPicture = Images.findOne({}, {sort: {uploadedAt: 1}});
        var firstPicUrl = window.location.origin + "/cfs/files/images/" + firstPicture._id;
        var picurl = $('.form-group div > img')[0] ? $('.form-group div > img')[0].src : firstPicUrl;
        var atitle = "";
        var time = "";
        var where = "";
        Meteor.call('getActivityInfo', result, function(error, r) {
          atitle = r.title;
          time = r.time;
          where = r.where;
          var content = {
            title: "【新活动】" + atitle,
            description: "",
            time: moment(time).format("YYYY-MM-DD HH:MM"),
            where: where,
            // where: where.replace("T", " "),
            url: window.location.origin + "/activities/"+ result,
            picurl: picurl
          };

          Meteor.call("multiSendNews", content);
        });
      }
      Router.go('activitiesIndex', {_id: result});
    },

    onError: function(operation, error, template) {
      console.log(error);
    }
  }
});
