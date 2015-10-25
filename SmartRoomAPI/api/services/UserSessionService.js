var jwt = require('jwt-simple');
var Q = require('q');
var jwtSecret = sails.config.jwtSecret;

module.exports = {
    authenticated: function(session, cb) {
        var self = this;
        
        if (session) {
            if (session.token) {
                UserSession.findOne({ token: session.token }).exec(function(err, userSession) {
                    if (err || !userSession) {
                        cb(null, false);
                    } else {
                        self.verifyToken(userSession, function(err, result) {
                            if(err || !result) {
                                cb(null, false);
                            }
                            else {
                                cb(null, userSession);
                            }
                        });
                    }
                });
            } else {
                cb(null, false);
            }
        } else {
            cb(null, false);
        }
    },
    // Verifies JWT and returns userId
    verify: function(userSession, cb) {
        var self = this;
        
        if (userSession) {
            var decoded;
            try {
                decoded = jwt.decode(userSession.token, sails.config.jwtSecret);
            } catch (err) {
                return cb(true);
            }
            if (decoded) {
                if (decoded.iss) {
                    if(decoded.iss !== userSession.userId) {
                        self.destroyUserSession(userSession, function(err, result) {
                            cb(true);
                        });
                    }
                    else {
                        if (decoded.exp) {
                            if (decoded.exp <= Date.now()) {
                                self.destroyUserSession(userSession, function(err, result) {
                                    cb(true);
                                });
                            } else {
                                cb(null, true);
                            }
                        } else {
                            cb(true);
                        }
                    }
                }
                else {
                    cb(true);
                }
            } else {
                cb(true);
            }
        } else {
            cb(true);
        }
    },
    destroyUserSession: function(userSession, cb) {
        Q.fcall(function() {
            if(userSession) {
                UserSession.destroy({ id: userSession.id }).exec(function(err) {
                    cb(null, true);
                });    
            }
            else {
                cb(ErrorService.missingParameter('destroyUserSession', 'userSession'));
            }
        }).catch(function(err) {
            cb(true);
        }).done();
    },
    /*** @section - Exeternal Authentication Services */
    

    /*** @section - Internal Authentication Services */

    /*** @section - External Authentication Helper Services */
    
    // Does not check for validity of token, just gets user relevant to the session
    getUser: function(userSession, cb) {
        if (userSession) {
            if (userSession.userId) {
                User.findOne({ id: userSession.userId }).exec(function(err, user) {
                    if(err || !user) {
                        cb(true);
                    }
                    else {
                        cb(null, user);
                    }
                });
            } else {
                cb(true);
            }
        } else {
            cb(true);
        }
    }
}
