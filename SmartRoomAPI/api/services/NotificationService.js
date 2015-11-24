module.exports = {
    /** 
     * Saves Notification to database and sends it to client through WebSockets
     *
     * @param {string} title - The title of the Notification.
     * @param {string} body - HTML for the body of the Notification.
     * @param {UtilityService~callback} cb - Called after the function finishes executing.
     */
    sendNotification: function(title, body, cb) {
        if(title && body) {
            Notification.create({ title: title, body: body }).exec(function(err, notification) {
                if(err || !notification) {
                    cb(err);
                }
                else {
                    // Send WebSockets message to connected clients
                    Notification.publishCreate(notification.toJSON());
                    cb(null, true);
                }
            });
        }
        else {
            cb(ErrorService.missingParameter('sendNotification', 'title, body'));
        }
    }
};
