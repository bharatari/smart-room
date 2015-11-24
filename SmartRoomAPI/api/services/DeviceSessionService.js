/**
 * We won't be using device registration & authentication
 * in our current project. I created these functions
 * so that the server can accomodate a more modular setup/system
 * in case I wanted to continue this project later.
 *
 * @author - Bharat Arimilli
 */
var jwt = require('jwt-simple');
var Q = require('q');
var jwtSecret = sails.config.jwtSecret;

module.exports = {
    // Delete existing sessions
    createSession: function(device, cb) {
        if (device) {
            var expires = moment().add(2, 'days').toDate();
            var deviceSesssion = jwt.encode({
                iss: device.id,
                exp: expires
            }, jwtSecret);
            
            DeviceSession.create({ token: deviceSesssion, deviceId: device.id }).exec(function(err, session) {
                if (err || !session) {
                    cb(true);
                } else {
                    cb(null, session.token);
                }
            });
        } else {
            cb(true);
        }
    },
    
    authenticated: function(body, cb) {
        var self = this;
        
        if(body) {
            if(body.meta) {
                if(body.meta.authenticationToken) {
                    DeviceSession.findOne({ token: body.meta.authenticationToken }).exec(function(err, deviceSession) {
                        if (err || !deviceSession) {
                            cb(null, false);
                        } else {
                            self.verifyToken(deviceSession, function(err, result) {
                                if(err || !result) {
                                    cb(null, false);
                                }
                                else {
                                    cb(null, deviceSession);
                                }
                            });
                        }
                    });
                }
            }
        }
    },
    
    verify: function(deviceSession, cb) {
        var self = this;
        
        if (deviceSession) {
            var decoded;
            try {
                decoded = jwt.decode(deviceSession.token, sails.config.jwtSecret);
            } catch (err) {
                return cb(true);
            }
            if (decoded) {
                if (decoded.iss) {
                    if(decoded.iss !== deviceSession.deviceId) {
                        self.destroyDeviceSession(deviceSession, function(err, result) {
                            cb(true);
                        });
                    }
                    else {
                        if (decoded.exp) {
                            if (decoded.exp <= Date.now()) {
                                self.destroyDeviceSession(deviceSession, function(err, result) {
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
    
    destroyDeviceSession: function(deviceSession, cb) {
        Q.fcall(function() {
            if(deviceSession) {
                DeviceSession.destroy({ id: deviceSession.id }).exec(function(err) {
                    cb(null, true);
                });    
            }
            else {
                cb(ErrorService.missingParameter('destroyDeviceSession', 'deviceSession'));
            }
        }).catch(function(err) {
            cb(true);
        }).done();
    },
}