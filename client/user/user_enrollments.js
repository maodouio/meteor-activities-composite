Template.userEnrollments.helpers({
  file: function () {
    console.log("this.activityId...." ,Activities.find({"_id":this.activityId}).fetch()[0].picture);
    var a = Activities.find({"_id":this.activityId}).fetch()[0].picture;
    return Images.findOne({_id: a});
  }
});

Template.userEnrollments.helpers({
  upCount: function () {
    return this.likes().fetch().length;
  },
});
