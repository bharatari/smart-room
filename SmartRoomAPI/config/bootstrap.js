var schedule = require('node-schedule');

/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
    // TODO Loop through all devices and send notifications to appropriate clients
    var notificationsProcessor = schedule.scheduleJob("*/1 * * * *", function() {
        // Scheduled task allows for notifications not to clog up POST requests
        // and create latency
        AutomaticService.sendNotifications(function(err, result) {
            // We don't need to do anything with the result
        });
    });
    
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
