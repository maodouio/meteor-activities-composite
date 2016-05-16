// ***************************************************************
// ROUTES (activities)
// ***************************************************************

Router.map(function() {

  // DOCUMENTS INDEX
  // -------------------------------------------------------
  this.route('activitiesIndex', {
    template: 'activitiesIndex',
    path: '/activities',
    waitOn: function () {
      return Meteor.subscribe('activitiesComposite');
    },
    data: function () {
      return {
        activities: Activities.find({}, {sort: {createdAt: -1}}),
        enrollments: function() {
          if (typeof Enrollments !== "undefined") {
            return Enrollments.find();
          }
        }
      };
    }
  });

  // DOCUMENT NEW
  // -------------------------------------------------------
  this.route('activityNew', {
    template: 'activityNew',
    path: '/activities/new',
    waitOn: function () {
      // 订阅一个 collection 中最新上传和最初上传的图片，没想到更好的办法了。可改进！
      Meteor.subscribe('firstUploaded');
      return Meteor.subscribe('imageUploaded');
    },
  });

  // DOCUMENT EDIT
  // -------------------------------------------------------
  this.route('activityEdit', {
    template: 'activityEdit',
    path: '/activities/:_id/edit',
    waitOn: function () {
      Meteor.subscribe('imageUploaded');
      Meteor.subscribe('activityComposite', this.params._id);
      return Meteor.subscribe('activity', this.params._id);
    },
    data: function () {
      return Activities.findOne(this.params._id);
    }
  });

  // DOCUMENT SHOW
  // -------------------------------------------------------
  this.route('activityShow', {
    template: 'activityShow',
    path: '/activities/:_id',
    waitOn: function () {
      Meteor.subscribe('scene', Meteor.userId(), this.params._id);
      return Meteor.subscribe('activityComposite', this.params._id);
    },
    data: function () {
    console.log("Router activityShow message");
      return {
        enrollments: function() {
          if (typeof Enrollments !== "undefined") {
            return Enrollments.find();
          }
        },
        activity: Activities.findOne(this.params._id),
        comments: function() {
          if (typeof Comment !== "undefined" && typeof Comment.collection !== "undefined") {
            return Comment.collection.find({}, {sort: {date: -1}});
          }
        },
        likes: function() {
          if (typeof Like !== "undefined" && typeof Like.collection !== "undefined") {
            return Like.collection.find();
          }
        },
        logintype: '/activities/' + this.params._id
      };
    },
  });

  // USERS ARTIVITIES
  // -------------------------------------------------------
  this.route('userActivities', {
    template: 'userActivities',
    path: '/users/:_id/activities/',
    waitOn: function () {
      Meteor.subscribe('user', this.params._id);
      return Meteor.subscribe('userActivitiesComposite', this.params._id);
    },
    data: function() {
      return {
        activities: Activities.find({}, {sort: {createdAt: -1}}),
        user: Meteor.users.findOne({_id: this.params._id}),
      };
    },
  });
});
