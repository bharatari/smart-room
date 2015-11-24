/**
 * Bharat Arimilli, Jack Clark, James Linton, Miguel De La Rocha, Danny Diep
 *
 * @author - Bharat Arimilli
 */
module.exports = {
    /**
     *
     * Subscribes WebSocket client to messages published of new notifications.
     *
     */
    watch: function(req, res) {
        if(req.isSocket == true) {
            Notification.watch(req);
            res.send('Connected');
        }
        else {
            res.badRequest('You must be using WebSockets for this request.');
        }
    }
};
