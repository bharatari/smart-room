/**
 * Bharat Arimilli, Jack Clark, James Linton, Miguel De La Rocha, Danny Diep
 *
 * @author - Bharat Arimilli
 */
module.exports = {
    find: function(req, res) {
        UtilityService.find('setting', 'settings', req.query, function(err, result) {
            res.json(result);
        });
    },
    update: function(req, res) {
        UtilityService.upsertSetting(req.body, function(err, result) {
            if(err || !result) {
                res.badRequest(err);
            } else {
                res.json(result);
            }
        });
    }
};
