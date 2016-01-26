module.exports = {
    /** 
     * Saves Notification to database 
     *
     * @param {string} title - The title of the Notification.
     * @param {string} body - HTML for the body of the Notification.
     * @param {UtilityService~callback} cb - Called after the function finishes executing.
     */
    submitNotification: function(title, body, cb) {
        if(title && body) {
            Notification.create({ title: title, body: body }).exec(function(err, notification) {
                if(err || !notification) {
                    cb(err);
                }
                else {
                    cb(null, notification);
                }
            });
        }
        else {
            cb(ErrorService.missingParameter('sendNotification', 'title, body'));
        }
    }
};
