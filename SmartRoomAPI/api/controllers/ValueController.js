/**
 * Bharat Arimilli, Jack Clark, James Linton, Miguel De La Rocha, Danny Diep
 *
 * @author - Bharat Arimilli
 */
module.exports = {
    watch: function(req, res) {
        if(req.isSocket == true) {
            Value.watch(req);
            res.send('Connected');
        }
        else {
            res.badRequest('You must be using WebSockets for this request.');
        }
    },
    
    /** 
     * Processes incoming data.
     *
     * @param {Object} req.body.data - Data object sent as part of the POST request.
     * @param {string} req.body.data.name - Name of the data (e.g. temperature, humidity).
     * @param {boolean|string|number} req.body.data.value - Value of the data.
     *
     * @author - Bharat Arimilli
     */
    create: function(req, res) {
        // We originally used our createValue function that only created a record for new values,
        // but that ended up being too slow, so we switched to a normal CRUD version
        UtilityService.create('value', req.body, function(err, result) {
            if (err || !result) {
                res.badRequest(err);
            } else {
                res.ok();
            }
        });
    },
    find: function(req, res) {
        UtilityService.find('value', 'values', req.query, function(err, result) {
            if (err || !result) {
                res.badRequest(err);
            } else {
                res.ok(result);
            }
        });
    }
};
