var _ = require('lodash');

module.exports = {   
    
    /** 
     * Uses JavaScript split function to create a 
     *
     * @param {string} csv - Comma-separated list.
     * @param {boolean} space - Whether the function should split with the ', ' or ',' delimiter.
     * @returns {Array}
     */
    splitCSV: function(csv, space) {
        if (csv) {
            if (typeof csv === 'string') {
                if (space) {
                    return csv.split(', ');
                } else {
                    return csv.split(',');
                }
            }
            else {
                return [];
            }
        } else {
            return [];
        }
    },
    
    /** 
     * Custom sort function created because Waterline doesn't seem to support
     * multiple sort fields, which the JSON API spec requires.
     *
     * @param {Array} data 
     * @param {string} params
     * @returns {Array}
     */
    sort: function(data, params) {
        if (data && params) {
            var paramsArray = this.splitSortParameters(params);
            return _.sortByOrder(data, _.pluck(paramsArray, 'property'), _.map(paramsArray, this.convertToLodash));
        } else {
            throw new Error(ErrorService.missingParameter('sort'));
        }
    },
    
    splitSortParameters: function(params) {
        var array = this.splitCSV(params, false);
        var paramsArray = [];
        
        for (var i = 0; i < array.length; i++) {
            paramsArray.push(this.processSortParameters(array[i]));
        }
        
        return paramsArray;
    },
    
    /** 
     * Converts sort parameters to objects.
     *
     * @param {string} param 
     * @returns {Object}
     * @throws {TypeError}
     */
    processSortParameters: function(param) {
        if (param) {
            if (typeof param === 'string') {
                if (param.substring(0, 1) === '+') {
                    var paramObject = {
                        property: param.substring(1, param.length),
                        type: 'ASC'
                    };
                    return paramObject;
                } else if (param.substring(0, 1) === '-') {
                    var paramObject = {
                        property: param.substring(1, param.length),
                        type: 'DESC'
                    };
                    return paramObject;
                } else {
                    var paramObject = {
                        property: param,
                        type: 'ASC'
                    };
                    return paramObject;
                }
            }
            else {
                throw new TypeError(ErrorService.invalidParameterType('processSortParameters', 'param', param, 'string'));
            }
        }
        else {
            throw new Error(ErrorService.missingParameter('processSortParameters', 'param'));
        }
    },
    processSkip: function(page, size) {
        if(page && size) {
            if (typeof page !== 'number') {
                return 0;
            } else if (typeof size !== 'number') {
                return 0;
            } else {
                if ((page - 1) < 0) {
                    return 0;
                } else {
                    return (page - 1) * size;
                }
            }
        } else {
            return 0;
        }
    },
    
    /** 
     * Converts Waterline sort parameters to lodash sort parameters.
     * If parameters are invalid or missing, it defaults to 'asc'.
     *
     * @param {Object} n 
     * @returns {string} - Returns lodash compatible sort parameter.
     */
    convertToLodash: function(n) {
        if (n) {
            if (typeof n.type === 'string') {
                if (n.type === 'ASC') {
                    return 'asc';
                } else if (n.type === 'DESC') {
                    return 'desc'
                } else {
                    return 'asc';
                }
            } else {
                return 'asc';
            }
        } else {
            return 'asc';
        }
    },
    
    /** 
     * Modular find function to be used with any valid Sails model.
     *
     * @param {string} model - Name of the Sails model.
     * @param {Object} query - The req.query object from the original request.
     * @param {UtilityService~callback} cb - Called after the function finishes executing.
     */
    find: function(model, query, cb) {
        var Model = sails.models[model];
        
        if (model) {
            if (query) {
                var Query = User.find();

                if (query.filter) {
                    Query.where(query.filter);
                }

                if (query.page) {
                    if (query.page.number && query.page.size) {
                        Query
                            .skip(this.processSkip(query.page.number, query.page.size))
                            .limit(query.page.size);
                    } else if (query.page.number) {
                        Query
                            .skip(this.processSkip(query.page.number, ConstantsService.DEFAULT_PAGE_SIZE))
                            .limit(ConstantsService.DEFAULT_PAGE_SIZE);
                    } 
                }   

                Query.exec(function(err, data) {
                    if (err || !data) {
                        cb(ErrorService.databaseError(err));
                    } else {
                        if (query.sort) {
                            cb(null, this.sort(data, query.sort));
                        } else {
                            cb(null, data);
                        }
                    }
                });
            } else {
                Model.find().exec(function(err, data) {
                    cb(null, data);
                });
            }
        }
    },
    /**
     * @callback UtilityService~callback
     * @param {Object|string|boolean} err - Error message or object.
     * @param {Array|Object|string|boolean|number} result - Result of the function call.
     */
    
    findOne: function(model, param, cb) {
        var Model = sails.models[model];
    },
    
    
    create: function(model, body, cb) {
        var Model = sails.models[model];
        
        if (body) {
            if (body.data) {
                Model.create(body).exec(function(err, data) {
                    if (err || !data) {
                        cb(ErrorService.databaseError(err));
                    } else {
                        Model.publishCreate(data.toJSON());
                        cb(null, data);
                    }
                });
            } else {
                cb(ErrorService.missingParameter('create', 'body'));
            }
        } else {
            cb(ErrorService.missingParameter('create', 'body'));
        }
    },
    
    update: function(model, body, cb) {
        var Model = sails.models[model];
        
        if (body) {
            if (body.data) {
                Model.update(body).exec(function(err, data) {
                    if (err || !data) {
                        cb(ErrorService.databaseError(err));
                    } else {
                        Model.publishUpdate(data.toJSON());
                        cb(null, data);
                    }
                });
            } else {
                cb(ErrorService.missingParameter('create', 'body'));
            }
        } else {
            cb(ErrorService.missingParameter('create', 'body'));
        }
    },
    
    destroy: function(model, param, cb) {
    
    }
};
