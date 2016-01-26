module.exports = {
    find: function(req, res) {
        UtilityService.find('setting', 'settings', req.query, function(err, result) {
            res.json(result);
        });
    },
    update: function(req, res) {
        UtilityService.updateSetting(req.params.id, req.body, function(err, result) {
            if (err || !result) {
                res.badRequest(err);
            } else {
                res.json(result);
            }
        });
    },
    create: function(req, res) {
        UtilityService.create('setting', 'settings', req.body, function(err, result) {
            if (err || !result) {
                res.badRequest(err);
            } else {
                res.json(result);
            }
        });
    }
};
