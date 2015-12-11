Template.userActivities.helpers({
  upCount: function () {
    console.log("this.likes().fetch()", this.likes().fetch());
    return this.likes().fetch().length;
  }
});

Template.registerHelper('getActivityTitle', function(activityId){
  console.log("activityId :", activityId);
  var result = Activities.findOne({_id: activityId});
  if (result) {
    return result.title;
  } else {
    return false;
  }
});
