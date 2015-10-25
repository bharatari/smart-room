module.exports = {
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
