Template.activityNew.rendered = function() {
  $('.note-editable').css("min-height", "200px");
};

Template.activityNew.helpers({
  imageUrl: function() {
    return Session.get("logoImage");
  },
  hasImage: function() {
    return !!Session.get("logoImage");
  },
});

Template.activityNew.events ({
  'click [name="imageUploadBtn"]': function(e, t) {
    $( "#myFileInput" ).trigger( "click" );
  },
  'click .delete-btn-draw': function(e, t) {
    Session.set("logoImage","");
    $('#imageReveal').css('display', 'none');
  }
});

AutoForm.hooks({
  'activityForm': {
    before: {
      insert: function(doc) {
        console.log(doc);
        doc.createdAt = new Date();
        doc.status = 'ENROLLING';
        var image = Session.get("logoImage");
        if (image) {
          doc.picture = image;
        }
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
