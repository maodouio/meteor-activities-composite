Images.allow({
  insert: function(userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    return true;
  },
  download: function(userId) {
    return true;
  }
});