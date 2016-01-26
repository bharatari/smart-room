module.exports = {
    /**
     * Called from bootstrap.js to check data and send appropriate notifications
     * to the client.
     *
     * @param {UtilityService~callback} cb - Called after the function finishes executing.
     */
    sendNotifications: function(cb) {
        var notifications = [];
        ValueService.lightsOnNotification(function(err, result) {
            if (result) {
                notifications.push(result);
            }
            ValueService.temperature(function(err, result) {
                if (result) {
                    notifications.push(result);
                }
                ValueService.humidity(function(err, result) {
                    if (result) {
                        notifications.push(result);
                    }
                    sails.sockets.broadcast('notifications', 'new notifications', notifications);
                    cb(null, notifications);
                });
            });
        });
    },
    
    // TODO Delete values older than 2 days
    deleteOldValues: function() {
        
    }
}