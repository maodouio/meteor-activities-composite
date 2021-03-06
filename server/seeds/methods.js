Meteor.methods({
	insertData: function(title, desc, imageId, datetime, where) {
		var defaultUser = Meteor.users.findOne({});
		var userId = null;
		var headimgurl = null;

		if (defaultUser === undefined) {
			defaultUser = Meteor.users.insert({
				username: "defaultUser",
				emails: ['defaultUser@maodou.io'],
				profile  : {
					nickname	: "defaultUser",
					country		: "中国",
					headimgurl: "http://7xojrr.com1.z0.glb.clouddn.com/genericUser.png"
				}
			});
			console.log("defaultUser :", defaultUser);
			userId = defaultUser;
			headimgurl = "http://7xojrr.com1.z0.glb.clouddn.com/genericUser.png";
		} else {
			userId = defaultUser._id;
			headimgurl = defaultUser.profile.headimgurl;
		}

		console.log(userId);
		console.log(headimgurl);

		Activities.insert({
			"title" : title,
			"desc" : desc,
			"picture" : imageId,
			"time" : datetime,
			"where" : where,
			"limit" : 200,
			"fee" : 120,
			"status": "ENROLLING",
			"createdAt": new Date(),
			"userId": userId,
			"headimgurl": headimgurl
		});
	},
	deleateActivity: function(id) {
	  Activities.remove({_id:id});
	}
});
