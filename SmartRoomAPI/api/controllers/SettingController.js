module.exports = {
    find: function(req, res) {
        UtilityService.find('Setting', 'settings', req.query, function(result) {
            res.json(result);
        });
    },
    update: function(req, res) {
        UtilityService.update('Setting', req.body, function(result) {
            res.json(result);
        });
    }
};
