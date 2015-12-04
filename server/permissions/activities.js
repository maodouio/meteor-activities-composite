Activities.allow({
  insert: function (userId, doc) {
    // Free-for-all!
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    console.log("server update...");
    // Free-for-all!
    return true;
  },
  remove: function (userId, doc) {
    // Free-for-all!
    return true;
  }
});