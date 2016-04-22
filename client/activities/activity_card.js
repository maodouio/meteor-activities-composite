Template.activityCard.helpers({
  username: function(userId) {
    var result = Meteor.users.findOne({_id: userId});
    if (result) {
      return result.profile.nickname;
    } else {
      return false;
    }
  },
  file: function () {
    var id = this.picture;
    console.log('id:', id);
    return Images.findOne({_id: id});
  },
  hasLiked: function () {
    var up = !!Like.collection.findOne({linkedObjectId: this._id,userId: Meteor.userId()});
    if (up) {
      return true;
    } else {
      return false;
    }
  },
  likesCount: function () {
    return Like.collection.find({linkedObjectId: this._id}).count();
  },
  enrollmentsCount: function () {
    return Enrollments.find({"activityId": this._id}).count();
  },
  statusIs: function(status){
    // console.log("statusIs this :", this);
    return this.status === status;
  },
  getClassByStatus: function() {
    console.log(this);
    if (this.status === "CANCEL" || this.status === "CLOSED")
      return "darenPostListGray";

    return "darenPostList";
  },
});

Template.activityCard.events({
  // 取消点赞
  "click .dislike": function(event, template){
    console.log('disliked');

    var a = Like.collection.findOne({linkedObjectId: this._id,userId: Meteor.userId()});
    Like.collection.remove({_id:a._id});
  },
  // 点赞
  'click .like': function(e) {
    if (Meteor.user()) {
      //this.like();
      console.log('liked');
      Like.collection.insert({linkedObjectId: this._id, userId: Meteor.userId(), date: new Date()});
    } else {
      console.log("router go");
      window.location.href = "/userLogin?logintype=/activities/" + this._id;
    }
  },
  "click .postImgBox": function(event, template){
    // console.log('img clicked');
    // console.log(this);
    // console.log(template);
    // console.log('123')
    if ((Router.current().url.length - Router.current().url.indexOf("activities")>11)) {
      return;
    }
    window.location.href = "/activities/"+this._id;
  },

});

Template.activityCard.rendered = function() {
  // Counter++ everytime page rendered.
  console.log(this.data.activity._id);
  Activities.update(this.data.activity._id, {$inc: {activityViewCounter: 1}});
};
