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
     */
    /** @note - We can do a global style single object for each type of data, or create new objects for each new value to have record */
    create: function(req, res) {
        UtilityService.create('Value', req.body, function(err, result) {
            if (err || !result) {
                res.badRequest(err);
            } else {
                res.ok();
            }
        });
    },
    find: function(req, res) {
        UtilityService.find('Value', 'values', req.query, function(err, result) {
            if (err || !result) {
                res.badRequest(err);
            } else {
                res.ok(result);
            }
        });
        /*
        res.json({
            "data": [{
                "type": "value",
                "id": "1",
                "attributes": {
                    "deviceId": "1",
                    "name": "temperature",
                    "result": 70
                }
            }, {
                "type": "value",
                "id": "2",
                "attributes": {
                    "deviceId": "1",
                    "name": "humidity",
                    "result": 80
                }
            }, {
                "type": "value",
                "id": "3",
                "attributes": {
                    "deviceId": "1",
                    "name": "humidity",
                    "result": 80
                }
            }]
        })*/
    }
};
