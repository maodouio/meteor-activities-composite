Activities.allow({
  insert: function (userId, doc) {
    // Free-for-all!
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    if (userId == doc.userId) {
      return true;
    }
    return false;
  },
  remove: function (userId, doc) {
    if (userId == doc.userId) {
      return true;
    }
    return false;
  }
});
