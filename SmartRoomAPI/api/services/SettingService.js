/**
 *
 * Bharat Arimilli, Jack Clark, James Linton, Miguel De La Rocha, Danny Diep
 *
 * @author - Bharat Arimilli
 */
module.exports = {
    /**
     * Upsert functionality for updating settings.
     *
     * @param {string} key - Key of Setting record.
     * @param {boolean|number|string} value
     * @param {UtilityService~callback} cb - Called after the function finishes executing.
     */
    updateSetting: function(key, value, cb) {
        // Find setting from database
        Setting.findOne({ key: key }).exec(function(err, setting) {
            if (err || !setting) {
                // If the setting doesn't exist, create it
                Setting.create({ key: key, value: value }).exec(function(err, newSetting) {
                    if (err || !newSetting) {
                        cb(true);
                    } else {
                        cb(null, newSetting);
                    }
                });
            } else {
                // If the setting exists, update it
                Setting.update({ key: key }, { value: value }).exec(function(err, updatedSetting) {
                    if (err || !updatedSetting) {
                        cb(true);
                    } else {
                        cb(null, updatedSetting);
                    }
                });
            }
        });
    }
}