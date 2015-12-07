Package.describe({
  name: 'maodouio:activities-composite',
  version: '0.0.7',
  // Brief, one-line summary of the package.
  summary: 'Maodou.io activities-composite package',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/maodouio/meteor-activities-composite',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom("1.0.2.1");
  // packages
  api.use('iron:router@1.0.12', ["server", "client"]);
  api.use('reywood:publish-composite@1.4.2', "server");
  api.use('aldeed:autoform@5.1.2', ["server", "client"]);
  api.use('aldeed:collection2@2.3.3', ["server", "client"]);
  api.use('aldeed:simple-schema@1.3.2', ["server", "client"]);
  api.use('matb33:collection-hooks@0.8.0', ["server", "client"]);
  api.use('cfs:standard-packages@0.5.9', ["server", "client"]);
  api.use('cfs:gridfs@0.0.33', ["server", "client"]);
  api.use('cfs:filesystem@0.1.2', ["server", "client"]);
  api.use('froatsnook:request@2.64.0', 'server');

  api.use('maodouio:autoform-file@1.0.5', ["server", "client"]);
  // api.use('maodouio:activity-comments@0.0.1', ["server", "client"]);
  // api.use('maodouio:activity-likes@0.0.1', ["server", "client"]);

  // template
  api.use(['minimongo', 'mongo-livedata', 'templating'], 'client');

  // client
  api.addFiles('client/activities/activities_index.html', 'client');

  api.addFiles('client/activities/activity_card.html', 'client');
  api.addFiles('client/activities/activity_card.js', 'client');
  api.addFiles('client/activities/activity_card.css', 'client');
  api.addFiles("client/activities/activity_new.html", "client");
  api.addFiles("client/activities/activity_new.js", "client");
  api.addFiles("client/activities/activity_show.html", "client");
  api.addFiles("client/activities/activity_show.js", "client");
  api.addFiles("client/activities/activity_detail.html", "client");
  api.addFiles("client/activities/activity_detail.js", "client");
  api.addFiles("client/activities/activity_edit.html", "client");
  api.addFiles("client/activities/activity_edit.js", "client");

  api.addFiles("client/activities/activity_registrations.css", "client");
  api.addFiles("client/activities/activity_registrations.html", "client");
  api.addFiles("client/activities/activity_registrations.js", "client");
  // api.addFiles("client/activities/activity_summary.html", "client");
  // api.addFiles("client/activities/activity_summary.js", "client");

  api.addFiles("client/user/user_activities.html", "client");
  api.addFiles("client/user/user_activities.js", "client");
  api.addFiles("client/user/user_comments.html", "client");
  api.addFiles("client/user/user_comments.js", "client");
  api.addFiles("client/user/user_enrollments.html", "client");
  api.addFiles("client/user/user_enrollments.js", "client");
  api.addFiles("client/user/user_likes.html", "client");
  api.addFiles("client/user/user_likes.js", "client");

  api.addFiles("client/activities/activity_comments.css", "client");
  api.addFiles("client/activities/activity_comments.html", "client");
  api.addFiles("client/activities/activity_comments.js", "client");

  api.addFiles("client/activities/activity_enrollments.css", "client");
  api.addFiles("client/activities/activity_enrollments.html", "client");
  api.addFiles("client/activities/activity_enrollments.js", "client");


  api.addFiles('lib/collections.js', ['server', 'client']);
  // api.addFiles('lib/commentable.js', ['server', 'client']);
  // api.addFiles('lib/likeable.js', ['server', 'client']);
  api.addFiles('lib/routes.js', ['server', 'client']);
  api.addFiles('lib/helpers.js', ['client']);

  api.addFiles('server/permissions/activities.js', 'server');
  api.addFiles('server/permissions/images.js', 'server');
  api.addFiles('server/publications/activities.js', 'server');
  // methods must before fixtures
  api.addFiles('server/seeds/methods.js', 'server');
  api.addFiles('server/seeds/fixtures.js', 'server');

  // export
  api.export('Activities');
  api.export('Images');
});
