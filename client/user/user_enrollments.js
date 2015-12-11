Template.userEnrollments.helpers({

});

Template.userEnrollments.helpers({
  upCount: function () {
    return this.likes().fetch().length;
  },
});
