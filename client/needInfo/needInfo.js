Template.needInfo.onRendered(function(){
  // Meteor.subscribe('userprofile', Meteor.userId());
});


Template.needInfo.helpers({
});

Template.needInfo.events({
  "click #update_info": function(event, template){
    Modal.hide();
  }
});

AutoForm.addHooks(['userMoreInfoForm'], {
  before: {
    update: function(doc) {


      var info = UserProfiles.findOne();
      var userId = Meteor.userId();
      if (this.type == "update") {
        UserProfiles.update({_id: info._id}, {$set:{
          name: doc.$set.name,
          company: doc.$set.company,
          positions: doc.$set.positions
        }});
      } else {
        UserProfiles.insert({
          userId: Meteor.userId(),
          name: doc.$set.name,
          company: doc.$set.company,
          positions: doc.$set.positions
        });
      }
    }
  }
});
