/**
 * We won't be using device registration & authentication
 * in our current project. I created these functions
 * so that the server can accomodate a more modular setup/system
 * in case I wanted to continue this project later.
 */
module.exports = function(req, res, next) {
    DeviceSessionService.authenticated(req.body, function(err, response) {
        if (err || !response) {
            return res.forbidden();
        } else {
            next();
        }
    });
};
