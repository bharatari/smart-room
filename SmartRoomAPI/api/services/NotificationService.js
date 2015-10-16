module.exports = {
    /** 
     * Saves Notification to database and sends it to client through WebSockets
     *
     * @param {string} title - The title of the Notification.
     * @param {string} body - HTML for the body of the Notification.
     * @param {NotificationService~callback} cb - Called after the function finishes executing.
     */
    sendNotification: function(title, body, cb) {
        if(title && body) {
            Notification.create({ title: title, body: body }).exec(function(err, notification) {
                if(err || !notification) {
                    cb(false, err);
                }
                else {
                    sails.sockets.broadcast('notifications', 'new notification', notification);
                    cb(true);
                }
            });
        }
        else {
            cb(false, "MISSING_PARAMS");
        }
    }
    /**
     * @callback NotificationService~callback
     * @param {boolean} result - Success boolean value.
     * @param {string} [message] - Error message.
     */
}