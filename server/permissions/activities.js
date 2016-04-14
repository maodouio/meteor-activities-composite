Activities.allow({
  insert: function (userId, doc) {
    // Free-for-all!
    if (userId) {
      return true;
    }
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    if (userId == doc.userId || Roles.userIsInRole(userId, ['admin'])) {
      return true;
    }
    return false;
  },
  remove: function (userId, doc) {
    if (userId == doc.userId || Roles.userIsInRole(userId, ['admin'])) {
      return true;
    }
    return false;
  }
});
