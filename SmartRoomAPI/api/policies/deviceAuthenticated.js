module.exports = function(req, res, next) {
    DeviceSessionService.authenticated(req.body, function(err, response) {
        if (err || !response) {
            return res.forbidden();
        } else {
            next();
        }
    });
};
