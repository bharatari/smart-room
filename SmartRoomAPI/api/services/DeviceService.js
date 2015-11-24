/**
 * We won't be using device registration & authentication
 * in our current project. I created these functions
 * so that the server can accomodate a more modular setup/system
 * in case I wanted to continue this project later.
 *
 * @author - Bharat Arimilli
 */
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
