module.exports = {
    /**
     * Registers device using a 'sufficiently unique' unique ID.
     */
    registerDevice: function(req, res) {
        if (req.body) {
            if (req.body.data) {
                if (req.body.data[0]) {
                    if (req.body.data[0].attributes) {
                        if (req.body.data[0].attributes.uniqueId) {
                            var uniqueId = req.body.data[0].attributes.uniqueId;
                            DeviceService.checkUniqueId(uniqueId, function(result) {
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
    /**
     * Returns device object from database based on uniqueId
     */
    getDevice: function(req, res) {
        if (req.body) {
            if (req.body.deviceId) {
                Device.findOne({ uniqueId: req.body.uniqueId }).exec(function(err, device) {
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
    /**
     * Deletes device based on uniqueId
     */
    deleteDevice: function(req, res) {
        if (req.body) {
            if (req.body.uniqueId) {
                Device.destroy({ uniqueId: req.body.uniqueId }).exec(function(err) {
                    if (err) {
                        res.badRequest(err);
                    } else {
                        res.ok();
                    }
                
                });
            } else {
                res.badRequest("MISSING_PARAM");
            }
        } else {
            res.badRequest("MISSING_PARAM");
        }
    }
};
