module.exports = {
    registerUser: function(req, res) {
        if(req.body) {
            if(req.body.username && req.body.password && req.body.firstName && req.body.lastName) {
                UserService.checkUniqueUsername(req.body.username, function(result) {
                    if(result) {
                        User.create({ 
                            username: req.body.username, 
                            password: req.body.password,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName
                        }).exec(function(err, user) {
                            if(err || !user) {
                                res.badRequest();
                            }
                            else {
                                res.ok();
                            }
                        });
                    }
                    else {
                        res.badRequest("DUPLICATE_USERNAME");
                    }
                });
            }
        }
    }
}