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
