Template.userComments.helpers({
  activityComments: function() {
    return Comment.collection.find({linkedObjectId: this._id}, {sort: {date: -1}});
  }
});
