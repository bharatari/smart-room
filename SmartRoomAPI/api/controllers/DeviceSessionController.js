module.exports = {
    /**
     * Creates and persists a device session, returns a JWT 
     * authentication token to the client.
     */
    create: function(req, res) {
        if (req.body) {
            if (req.body.data) {
                if (req.body.data[0]) {
                    if (req.body.data[0].uniqueId) {
                        var uniqueId = req.body.data[0].uniqueId;
                        Device.findOne({ uniqueId: uniqueId }).exec(function(err, device) {
                            if (err || !user) {
                                res.badRequest(err || "NOT_REGISTERED");
                            } else {
                                DeviceSessionService.createSession(device, function(err, session) {
                                    if (err || !session) {
                                        res.badRequest(err);
                                    } else {
                                        req.json(UtilityService.convertResponse(session, "deviceSessions"));
                                    }
                                });
                            }
                        });
                    } else {
                        res.badRequest("MISSING_PARAM");
                    }
                } else {
                    res.badRequest("MISSING_PARAM");
                }
            } else {
                res.badRequest("MISSING_PARAM");
            }
        } else {
            res.badRequest("MISSING_PARAM");
        }
    },
    /**
     * Deletes and invalidates a device session.
     *
     * @author - Bharat Arimilli
     */
    destroy: function(req, res) {
        if (req.body) {
            if (req.body.data) {
                if (req.body.data[0]) {
                    if (req.body.data[0].token) {
                        DeviceSession.findOne({ token: req.body.data[0].token }).exec(function(err, session) {
                            DeviceSessionService.destroyDeviceSession(session, function(err, result) {
                                if (err || !result) {
                                    res.badRequest();
                                } else {
                                    res.ok();
                                }
                            });
                        });
                    }
                }
            } else {
                res.badRequest();
            }
        } else {
            res.badRequest();
        }
    },
    
    findOne: function(req, res) {
    
    }
};
