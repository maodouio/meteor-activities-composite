Meteor.publish('activityEdit', function(activityId) {
  return Enrollments.find({activityId: activityId});
});



Meteor.publish('images', function() {
  return Images.find();
});

Meteor.publish('imageUploaded', function() {
  // Find the just uploaded image
  return Images.find({}, {sort: {uploadedAt: -1}, limit: 1});
});

Meteor.publish('firstUploaded', function () {
  return Images.find({}, {sort: {uploadedAt: 1}, limit: 1});
});

// Meteor.publish('activity', function(id) {
//   return Activities.find({_id: id});
// });

Meteor.publishComposite("activity", function(id) {
  return {
    find: function() {
      return Activities.find({_id: id});
    },
    children: [
      {
        find: function(activity) {
          // Find activity picture
          return Images.find({_id: activity.picture});
        }
      },
      {
        find: function(activity) {
          return Meteor.users.find({_id: activity.userId}, { fields: { username: 1, profile: 1 } });
        }
      },
    ]
  }
});

Meteor.publishComposite("activitiesComposite", function() {
  return {
    find: function() {
      return Activities.find(
        { status: { $in: ['CREATED', 'ENROLLING', 'REGISTERING'] } },
        { fields: { title: 1, time: 1, createdAt: 1, picture: 1, userId: 1,
                headimgurl: 1, status: 1, activityViewCounter:1} } );
    },
    children: [
      {
        find: function(activity) {
          // Find activity picture
          return Images.find({_id: activity.picture});
        }
      },
      {
        find: function(activity) {
          return Meteor.users.find({_id: activity.userId}, { fields: { username: 1, profile: 1 } });
        }
      },
      {
        find: function(activity) {
          if (typeof Enrollments !== "undefined") {
            return Enrollments.find({activityId: activity._id});
          }
        },
      },
      {
        find: function(activity) {
          if (typeof Registrations !== "undefined") {
            return Registrations.find({activityId: activity._id});
          }
        },
      },
      {
        find: function(activity) {
          if (typeof Like !== "undefined" && typeof Like.collection !== "undefined") {
            return Like.collection.find({linkedObjectId: activity._id});
          }
        }
      }
    ]
  }
});

Meteor.publishComposite("activityComposite", function(activityId) {
  return {
    find: function() {
      return Activities.find({_id: activityId});
    },
    children: [
      {
        find: function(activity) {
          // Find activity picture
          return Images.find({_id: activity.picture});
        }
      },
      {
        find: function(activity) {
            // Find user that authored comment.
          return Meteor.users.find(
              { _id: activity.userId },
              { limit: 1, fields: { profile: 1, username: 1 } });
        },
        children: [
          {
            find: function(user) {
              return UserProfiles.find({userId: user._id});
            }
          }
        ]
      },
      {
        find: function(activity) {
            // Find user that authored comment.
          return UserProfiles.find(
              { userId: activity.userId },
              { limit: 1, fields: { logo: 1, userId: 1} });
        },
        children: [
          {
            find: function (userprofile) {
              return Logos.find({_id: userprofile.logo});
            }
          }
        ]
      },
      {
        find: function(activity) {
          if (typeof Enrollments !== "undefined") {
            return Enrollments.find({activityId: activity._id});
          }
        },
      },
      {
        find: function(activity) {
          if (typeof Comment !== "undefined" && typeof Comment.collection !== "undefined") {
            return Comment.collection.find({linkedObjectId: activity._id});
          }
        },
        children: [
          {
            find: function(comment) {
                // Find user that authored comment.
              return Meteor.users.find(
                  { _id: comment.userId },
                  { fields: { 'profile.headimgurl': 1, 'profile.nickname': 1 } });
            }
          }
        ]
      },
      {
        find: function(activity) {
          if (typeof Like !== "undefined" && typeof Like.collection !== "undefined") {
            return Like.collection.find({linkedObjectId: activity._id});
          }
        }
      },
      {
        find: function(activity) {
          if (typeof Registrations !== "undefined") {
            return Registrations.find({activityId: activity._id});
          }
        }
      }
    ]
  }
});

Meteor.publishComposite("userActivitiesComposite", function(userId) {
 return {
   find: function() {
     return Activities.find({userId: userId});
   },
   children: [
     {
       find: function(activity) {
         if (typeof Like !== "undefined" && typeof Like.collection !== "undefined") {
           return Like.collection.find({linkedObjectId: activity._id});
         }
       }
     },
     {
        find: function(activity) {
          // Find activity picture
          return Images.find({_id: activity.picture});
        }
      },
     {
       find: function(activity) {
         if (typeof Enrollments !== "undefined") {
           return Enrollments.find({activityId: activity._id});
         }
       }
     },
     {
       find: function() {
         return Meteor.users.find({_id: userId});
       }
     }
   ]
 }
});
