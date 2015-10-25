module.exports = {
    uniqueDeviceId: function(devices, deviceId) {
        if(devices) {
            for(var i = 0; i < devices.length; i++) {
                if(devices[i]) {
                    if(devices[i].deviceId === deviceId) {
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
    checkUniqueDeviceId: function(deviceId, cb) {
        if(deviceId) {
            Device.find().exec(function(err, devices) {
                if(DeviceService.uniqueDeviceId(devices, deviceId)) {
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
