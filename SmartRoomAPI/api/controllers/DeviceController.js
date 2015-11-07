module.exports = {
    registerDevice: function(req, res) {
        console.log("HELLO");
        if (req.body) {
            if (req.body.data) {
                if (req.body.data[0]) {
                    if (req.body.data[0].attributes) {
                        if (req.body.data[0].attributes.uniqueId) {
                            var uniqueId = req.body.data[0].attributes.uniqueId;
                            console.log("HELLO2");
                            DeviceService.checkUniqueDeviceId(uniqueId, function(result) {
                                if (result) {
                                    Device.create({ uniqueId: uniqueId, name: req.body.name }).exec(function(err, device) {
                                        if (err || !device) {
                                            res.badRequest();
                                        } else {
                                            res.ok();
                                        }
                                    });
                                } else {
                                    res.badRequest("DUPLICATE_DEVICE_ID");
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
