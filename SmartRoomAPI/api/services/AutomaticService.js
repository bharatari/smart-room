/**
 * Bharat Arimilli, Jack Clark, James Linton, Miguel De La Rocha, Danny Diep
 *
 * @author - Bharat Arimilli
 */
module.exports = {
    /**
     * Called from bootstrap.js to check data and send appropriate notifications
     * to the client.
     *
     * @param {UtilityService~callback} cb - Called after the function finishes executing.
     */
    sendNotifications: function(cb) {
        // TODO Collect values and send them together
        // We're not sending individual notifications but a persistent state
        ValueService.lightsOnNotification(function(err, result) {
            ValueService.temperature(function(err, result) {
                ValueService.humidity(function(err, result) {
                    cb(null, true);
                });
            });
        });
    },
    
    // TODO Delete values older than 2 days
    deleteOldValues: function() {
        
    }
}