Template.activityEdit.rendered = function() {
};

Template.activityEdit.helpers({
});

Template.activityEdit.events ({
});

AutoForm.hooks({
  'activityFormUpdate': {
    before: {
      update: function(doc) {
        console.log("AutoForm Hook update...");
        doc.updatedAt = new Date();
        return doc;
      }
    },
    onSuccess: function(operation, result, template) {
      console.log("onSuccess update...");
      Router.go('activityShow', {_id: this.docId});
    },

    onError: function(operation, error, template) {
      console.log('修改失败');
    }
  }
});