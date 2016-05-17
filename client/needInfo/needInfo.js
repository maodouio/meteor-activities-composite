Template.needInfo.onRendered(function(){
  // Meteor.subscribe('userprofile', Meteor.userId());
});


Template.needInfo.helpers({
});

Template.needInfo.events({
  "click #update_info": function(event, template){
    $("#true_submit").trigger("click");
    Modal.hide();
  }
});

AutoForm.addHooks(['userMoreInfoForm'], {
  before: {
    update: function(doc) {
      return doc;
    },
    insert: function(doc) {
      return doc;
    }
  }
});

Template.invitorCard.onRendered(function(){
  // Meteor.subscribe('userprofile', Meteor.userId());
  // console.log("xxxxxxxx",this);
  Meteor.subscribe('scene', Meteor.userId(), this.data.activityId);
});

Template.invitorCard.helpers({
  qrcUrl: function(){
    var scene = Scenes.findOne();
    console.log("helper scene",scene);
    if(scene){
      console.log("helper qrcurl",scene.qrCodeUrl);
      return scene.qrCodeUrl;
    }

  }
});
