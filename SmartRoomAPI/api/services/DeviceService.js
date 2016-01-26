module.exports = {
    uniqueId: function(devices, uniqueId) {
        if(devices) {
            for(var i = 0; i < devices.length; i++) {
                if(devices[i]) {
                    if(devices[i].uniqueId === uniqueId) {
                        return false;
                    }
                }
            }
            return true;
        }
        else {
            return true;
        }
    },
    checkUniqueId: function(uniqueId, cb) {
        if(uniqueId) {
            Device.find().exec(function(err, devices) {
                if(DeviceService.uniqueId(devices, uniqueId)) {
                    cb(true);
                }
                else {
                    cb(false);
                }
            });
        }
        else {
            cb(true);
        }
    }
};
