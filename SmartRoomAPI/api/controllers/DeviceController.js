module.exports = {
    registerDevice: function(req, res) {
        if(req.body) {
            if(req.body.deviceId) {
                DeviceService.checkUniqueDeviceId(req.body.deviceId, function(result) {
                    if(result) {
                        Device.create({ deviceId: req.body.deviceId, name: req.body.name }).exec(function(err, device) {
                            if(err || !device) {
                                res.badRequest();
                            }
                            else {
                                res.ok();
                            }
                        });
                    }
                    else {
                        res.badRequest("DUPLICATE_DEVICE_ID");
                    }
                });
            }
            else {
                res.badRequest("MISSING_PARAM");
            }
        }
        else {
            res.badRequest("MISSING_PARAM");
        }
    },
    getDevice: function(req, res) {
        if(req.body) {
            if(req.body.deviceId) {
                Device.findOne({ deviceId: req.body.deviceId }).exec(function(err, device) {
                    if(err || !device) {
                        res.badRequest();
                    }
                    else {
                        res.json(device);
                    }
                });
            }
            else {
                res.badRequest("MISSING_PARAM");
            }
        }
        else {
            res.badRequest("MISSING_PARAM");
        }
    },
    deleteDevice: function(req, res) {
        if(req.body) {
            if(req.body.deviceId) {
            
            }
        }
    }
};
