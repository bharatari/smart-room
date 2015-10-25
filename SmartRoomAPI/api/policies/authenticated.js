module.exports = function(req, res, next){
    AuthService.authenticated(req.session, function(err, response) {
        if (err || !response) {
            return res.forbidden();
        } else {
            AuthService.getUser(response, function(err, user) {
                if (err || !user) {
                    return res.forbidden();
                } else {
                    req.user = user;
                    next();
                }
            }); 
        }
    });
};
