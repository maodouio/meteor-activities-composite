// ***************************************************************
// DOCUMENTS COLLECTION
// ***************************************************************
// Create my collectionFS
Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {})]
});

Activities = new Meteor.Collection('activities');

ActivitySchema = new SimpleSchema({
  title: {
    type: String,
    label: "活动标题",
    max: 13,
    optional: false
  },
  userId: {
    type: String,
    autoValue: function(data) {
      if (data.userId !== null && data.userId !== undefined) {
        return data.userId;
      }
      if (this.isInsert) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: Meteor.userId()
        };
      } else {
        this.unset();
      }
    },
    denyUpdate: true,
  },
  headimgurl: {
    type: String,
    label: "headimgurl",
    optional: true,
    autoValue: function(data) {
      if (data.headimgurl !== null && data.headimgurl !== undefined) {
        console.log("headimgurl :", data.headimgurl);
        return data.headimgurl;
      }
      if (this.isInsert) {
        console.log(Meteor.user().profile.headimgurl);
        return Meteor.user().profile.headimgurl;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: Meteor.userId()
        };
      } else {
        this.unset();
      }
    },
  },
  desc: {
    type: String,
    label: "活动描述",
    max: 1000,
    optional: false,
    autoform: {
       rows: 5
    }
  },
  picture: {
    type: String,
    optional: true,
    label: '上传背景图片（可选，将使用默认图片）',
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        previewTemplate: 'myFilePreview',
        label: '选择照片',
      }
    },
    autoValue: function(data) {
      if (data.picture === null || data.picture === undefined) {
        var picture = Images.findOne({}, {sort: {uploadedAt: 1}, limit: 1});
        return picture._id;
      }
    },
  },
  time: {
    type: Date,
    label: "时间",
    optional: false,
    autoform: {
      afFieldInput: {
        type: "datetime-local"
      }
    }
  },
  where: {
    type: String,
    label: "地点",
    max: 1000,
    optional: false,
  },
  limit: {
    type: String,
    label: "名额",
    max: 120,
    optional: true
  },
  fee: {
    type: String,
    label: "费用",
    max: 1000,
    optional: true
  },
  status: {
    type: String,
    label: "活动状态",
    allowedValues: ['CREATED', 'ENROLLING', 'CANCEL', 'REGISTERING', 'CLOSED'],
    optional: true
  },

  createdAt: {
    type: Date,
    denyUpdate: false,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    }
  },
  updatedAt: {
    type: Date,
    optional: true,
    denyInsert: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    }
  }
});

// Must remember to attach the schema to the collection
Activities.attachSchema(ActivitySchema);

// Custom validation messages with SimpleSchema. Remove if not needed
Activities.simpleSchema().messages({
  required: "[label] is required",
  minString: "[label] must be at least [min] characters",
  maxString: "[label] cannot exceed [max] characters",
  minNumber: "[label] must be at least [min]",
  maxNumber: "[label] cannot exceed [max]",
  minDate: "[label] must be on or before [min]",
  maxDate: "[label] cannot be after [max]",
  minCount: "You must specify at least [minCount] values",
  maxCount: "You cannot specify more than [maxCount] values",
  noDecimal: "[label] must be an integer",
  notAllowed: "[value] is not an allowed value",
  expectedString: "[label] must be a string",
  expectedNumber: "[label] must be a number",
  expectedBoolean: "[label] must be a boolean",
  expectedArray: "[label] must be an array",
  expectedObject: "[label] must be an object",
  expectedConstructor: "[label] must be a [type]",
  regEx: [
  {msg: "[label] failed regular expression validation"},
  {exp: SimpleSchema.RegEx.Email, msg: "[label] must be a valid e-mail address"},
  {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] must be a valid e-mail address"},
  {exp: SimpleSchema.RegEx.Domain, msg: "[label] must be a valid domain"},
  {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] must be a valid domain"},
  {exp: SimpleSchema.RegEx.IP, msg: "[label] must be a valid IPv4 or IPv6 address"},
  {exp: SimpleSchema.RegEx.IPv4, msg: "[label] must be a valid IPv4 address"},
  {exp: SimpleSchema.RegEx.IPv6, msg: "[label] must be a valid IPv6 address"},
  {exp: SimpleSchema.RegEx.Url, msg: "[label] must be a valid URL"},
  {exp: SimpleSchema.RegEx.Id, msg: "[label] must be a valid alphanumeric ID"}
  ],
  keyNotInSchema: "[label] is not allowed by the schema"
});
