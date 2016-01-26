module.exports = {
    /**
     *
     * Subscribes WebSocket client to messages published of new notifications.
     *
     */
    watch: function(req, res) {
        if(req.isSocket == true) {
            sails.sockets.join(req.socket, 'notifications');
            res.send('Connected');
        }
        else {
            res.badRequest('You must be using WebSockets for this request.');
        }
    }
};
