/**
 * Bharat Arimilli, Jack Clark, James Linton, Miguel De La Rocha, Danny Diep
 *
 * @module UtilityService
 */
var _ = require('lodash');
var serializer = require('jsonapi-serializer');
var string = require('underscore.string');

module.exports = {   
    /** 
     * Uses JavaScript split function to create an array from a comma-separated-list.
     *
     * @author - Bharat Arimilli
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
     * multiple sort fields.
     *
     * @author - Bharat Arimilli
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
    
    /**
     * Splits sort paramters into an array and processes them
     *
     * @author - Bharat Arimilli
     * @param {string} params - A comma-separated list of sort parameters.
     */
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
     * @author - Bharat Arimilli
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
    
    /**
     * Processes page and skip for data pagination.
     *
     * @author - Bharat Arimilli
     * @param {number} page 
     * @param {number} size
     * @returns {number}
     */
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
     * Converts Waterline ORM sort parameters to lodash sort parameters.
     * If parameters are invalid or missing, it defaults to 'asc'.
     *
     * @author - Bharat Arimilli
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
     * Modular find function to be used with any valid Waterline ORM model.
     *
     * @author - Bharat Arimilli
     * @param {string} model - Name of the model.
     * @param {string} pluralized - Pluralized name of model.
     * @param {Object} query - The req.query object from the original request.
     * @param {UtilityService~callback} cb - Called after the function finishes executing.
     */
    // TODO Sort needs to be done before filtering and pagination
    // TODO Check for pluralized
    find: function(model, pluralized, query, cb) {
        var self = this;
        var Model = sails.models[model];
        
        if (model) {
            if (query) {
                var Query = Model.find();

                if (query.filter) {
                    Query.where(query.filter);
                }

                // TODO - Make this dynamic
                if (query.sort) {
                    Query.sort('createdAt DESC');
                }
                
                if (query.page) {
                    if (query.page.number && query.page.size) {
                        Query
                            .skip(self.processSkip(query.page.number, query.page.size))
                            .limit(query.page.size);
                    } else if (query.page.number) {
                        Query
                            .skip(self.processSkip(query.page.number, ConstantsService.DEFAULT_PAGE_SIZE))
                            .limit(ConstantsService.DEFAULT_PAGE_SIZE);
                    } 
                }   

                Query.exec(function(err, data) {
                    if (err || !data) {
                        cb(ErrorService.databaseError(err));
                    } else {
                        cb(null, self.convertResponse(data, pluralized));
                        /*
                        if (query.sort) {
                            cb(null, self.convertResponse(self.sort(data, query.sort), pluralized));
                        } else {
                            ;
                        }*/
                    }
                });
            } else {
                Model.find().exec(function(err, data) {
                    cb(null, self.convertResponse(data, pluralized));
                });
            }
        } else {
            cb(true);
        }
    },
    /**
     * @callback UtilityService~callback
     * @param {Object|string|boolean} err - Error message or object.
     * @param {Array|Object|string|boolean|number} result - Result of the function call.
     */
    
    /**
     * Modular CRUD function that returns a single record
     * based on the record's id that can be used with any Waterline ORM Model.
     *
     * @author - Bharat Arimilli
     * @param {string} model - Name of model.
     * @param {string} pluralized - Pluralized form of model name.
     * @param {string} param - The request parameter (id).
     * @param {UtilityService~callback} cb - Called after function finishes executing.
     */
    findOne: function(model, pluralized, param, cb) {
        var Model = sails.models[model];
        
        if (model && pluralized && param) {
            Model.findOne({ id: param }).exec(function(err, result) {
                if (err || !result) {
                    cb(true);
                } else {
                    cb(null, result);
                }
            });    
        } else {
            cb(true);
        }
    },

    /**
     * Modular CRUD create function that can be used with any Waterline ORM Model.
     *
     * @author - Bharat Arimilli
     * @param {string} model - Name of model.
     * @param {object} body - The HTTP request body.
     * @param {UtilityService~callback} cb - Called after function finishes executing.
     */
    // TODO Ignore id 
    create: function(model, body, cb) {
        var Model = sails.models[model];
        
        if (body) {
            var deserialized = this.deserialize(body);
            if(!deserialized) {
                return cb(true);
            }
            var object = deserialized[0];
            if(!object) {
                return cb(true);
            }
            Model.create(object).exec(function(err, data) {
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
    },
    
    /**
     * Only adds a new record if there is a difference from the last new record.
     * This function ended up being too slow and created too much latency.
     * We ended up doing this checking on the client.
     *
     * @author - Bharat Arimilli
     * @param {Object} body - HTTP request body.
     * @param {UtilityService~callback} cb - Called after function finishes executing.
     */
    // TODO - Floating point math
    // TODO - Make safer by checking properties 
    createValue: function(body, cb) {
        if (body) {
            var self = this;
            
            var deserialized = this.deserialize(body);
            if(!deserialized) {
                return cb(true);
            }
            var object = deserialized[0];
            if(!object) {
                return cb(true);
            }
            var thresholdArray = ValueService.threshold;
            this.findRecentValue(object.name, function(err, recentValue) {
                if(err || !recentValue) {
                    // No recent value exists, go ahead and create value
                    self.create('value', body, function(err, value) {
                        if(err || !value) {
                            cb(err);
                        } else {
                            cb(null, value);
                        }
                    });
                } else {
                    var threshold = thresholdArray[object.name];
                    // Check if there is a defined
                    // threshold for the type of data
                    if (threshold) {
                        // Create new value only if the value is greater than the
                        // threshold
                        if (Math.abs(object.result - recentValue.result) > threshold) {
                            self.create('value', body, function(err, value) {
                                if(err || !value) {
                                    cb(err);
                                } else {
                                    cb(null, value);
                                }
                            });
                        } else {
                            // Don't create a new record, just
                            // resend the old one to connected clients
                            // through WebSockets
                            Model.publishCreate(recentValue.toJSON());
                            cb(null, true);
                        }
                    } else {
                        // No defined threshold, simply check
                        // for equality
                        if (object.result !== recentValue.result) {
                            self.create('value', body, function(err, value) {
                                if(err || !value) {
                                    cb(err);
                                } else {
                                    cb(null, value);
                                }
                            });
                        } else {
                            Model.publishCreate(recentValue.toJSON());
                            cb(null, true);
                        }
                    }
                }
            });
        } else {
            cb(ErrorService.missingParameter('createValue', 'body'));
        }
    },
    
    /**
     * Finds most recent Value record.
     *
     * @author - Bharat Arimilli
     * @param {string} name - Name of Value record type.
     * @param {UtilityService~callback} cb - Called after function finishes executing.
     */
    findRecentValue: function(name, cb) {
        Value.findOne({ name: name }).sort('createdAt DESC').exec(function(err, value) {
            if(err || !value) {
                cb(true);
            } else {
                cb(null, value);
            }
        });    
    },
    
    /**
     * Modular CRUD update function that can be used with any Waterline ORM Model.
     *
     * @author - Bharat Arimilli
     * @param {string} model - Name of model.
     * @param {Object} body - HTTP request body.
     * @param {UtilityService~callback} cb - Called after function finishes executing.
     */
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
    
    /**
     * Upsert functionality for the Setting model.
     *
     * @author - Bharat Arimilli
     * @param {Object} body - HTTP request body.
     * @param {UtilityService~callback} cb - Called after function finishes executing.
     */
    upsertSetting: function(body, cb) {
        var self = this;

        if (body) {
            var deserialized = this.deserialize(body);
            if(!deserialized) {
                return cb(true);
            }
            var object = deserialized[0];
            if(!object) {
                return cb(true);
            }
            object = this.camelize(object);
            // Validate here
            Setting.findOne({ key: object.key }).exec(function(err, setting) {
                if (err || !setting) {
                    Setting.create({ key: object.key, value: object.value }).exec(function(err, newSetting) {
                        if (err || !newSetting) {
                            cb(true);
                        } else {
                            // First time created objects get returned empty attributes objects
                            cb(null, self.convertResponse(newSetting, 'settings'));
                        }
                    });
                } else {
                    Setting.update({ id: setting.id }, { value: object.value }).exec(function(err, updatedSetting) {
                        if (err || !updatedSetting) {
                            cb(true);
                        } else {
                            cb(null, self.convertResponse(updatedSetting, 'settings'));
                        }
                    });
                }
            });
        } else {
            cb(ErrorService.missingParameter('upsertSetting', 'body'));
        }
    },
    
    /**
     * Modular CRUD delete/destroy function that can be used with any Waterline ORM Model.
     *
     * @author - Bharat Arimilli
     * @param {string} model - Name of model.
     * @param {string} param - Request parameter (id).
     * @param {UtilityService~callback} cb - Called after function finishes executing.
     */
    destroy: function(model, param, cb) {
        var Model = sails.models[model];
        
        if (model && param) {
            Model.destroy({ id: param }).exec(function(err) {
                if (err) {
                    cb(true);
                } else {
                    cb(null, true);
                }
            });
        } else {
            cb(true);
        }
    },
    
    /**
     * Camelizes property names in an object.
     * 
     * @author - Bharat Arimilli
     * @param {Object} object
     * @returns {Object}
     */
    camelize: function(object) {
        for (var property in object) {
            // Ignore inherited properties
            if (object.hasOwnProperty(property)) {
                property = string.camelize(property);
            }
        }
        return object;
    },
    
    /**
     * Deserializes a JSON API 1.0-compliant request/response into an object.
     *
     * @author - Bharat Arimilli
     * @param {Object} object - JSON API 1.0 response/request object.
     * @returns {Array}
     */
    deserialize: function(object) {
        var deserialized = [];
        if (object) {
            if (object.data) {
                for (var i = 0; i < object.data.length; i++) {
                    var dataObject = {};
                    if (object.data[i]) {
                        if (object.data[i].id) {
                            dataObject.id = object.data[i].id;
                        }
                        if (object.data[i].attributes) {
                            for (var property in object.data[i].attributes) {
                                if (object.data[i].attributes.hasOwnProperty(property)) {
                                    dataObject[property] = object.data[i].attributes[property];
                                }
                            }
                        }
                        deserialized.push(dataObject);
                    }
                }
                if (deserialized.length > 0) {
                    return deserialized;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            return null;
        }
    },

    /**
     * Iterates through properties in an object and adds and returns them 
     * in an array.
     *
     *
     * @author - Bharat Arimilli
     * @param {Object} data
     * @returns {Array}
     */
    getProperties: function(data) {
        var properties = [];
        if (data) {
            for(var property in data) {
                // Ignore inherited properties
                // id property is already assumed by the serializer,
                // don't need to add it
                if(data.hasOwnProperty(property) && (property !== "id")) {
                    properties.push(property);
                }
            }
        }
        return properties;
    },
    
    /**
     * Serializes data to be JSON API 1.0-compliant JSON that can be consumed
     * by our client's data persistence library.
     *
     * @author - Bharat Arimilli
     * @param {Object} data
     * @param {string} pluralized - Pluralized name of model.
     * @returns {Object}
     */
    convertResponse: function(data, pluralized) {
        if (data.length === 1) {
            if (data[0]) {
                var converted = new serializer(pluralized, data[0], {
                    attributes: this.getProperties(data[0])
                });
                return converted;
            } else {
                var converted = new serializer(pluralized, data[0], {
                    attributes: []
                });
                return converted;
            }
        } else {
            if (data[0]) {
                var converted = new serializer(pluralized, data, {
                    attributes: this.getProperties(data[0])
                });
                return converted;
            } else {
                var converted = new serializer(pluralized, data, {
                    attributes: []
                });
                return converted;
            }
        }
    },
    
    validateSetting: function(key, value, cb) {
        if (key === "humidityMin") {
            Setting.findOne({ key: "humidityMax" }).exec(function(err, humidityMax) {
                if (err || !humidityMax) {
                    // If humidityMax doesn't exist, there's nothing
                    // to validate
                    cb(null, true);
                } else {
                    cb(null, validateHumidityMin(value, humidityMax.value));
                }
            });
        } else if (key === "humidityMax") {
            Setting.findOne({ key: "humidityMin" }).exec(function(err, humidityMin) {
                if (err || !humidityMin) {
                    // If humidityMin doesn't exist, there's nothing
                    // to validate
                    cb(null, true);
                } else {
                    cb(null, validateHumidityMax(value, humidityMin.value));
                }
            });
        } else if (key === "temperatureMax") {
            Setting.findOne({ key: "temperatureMin" }).exec(function(err, temperatureMin) {
                if (err || !temperatureMin) {
                    // If temperatureMin doesn't exist, there's nothing
                    // to validate
                    cb(null, true);
                } else {
                    cb(null, validateTemperatureMax(value, temperatureMin.value));
                }
            });
        } else if (key === "temperatureMin") {
            Setting.findOne({ key: "temperatureMax" }).exec(function(err, temperatureMax) {
                if (err || !temperatureMax) {
                    // If temperatureMax doesn't exist, there's nothing
                    // to validate
                    cb(null, true);
                } else {
                    cb(null, validateTemperatureMin(value, temperatureMax.value));
                }
            });
        } else {
            // If the setting doesn't have a validation
            // scheme, assume it's valid.
            cb(null, true);
        }
    },
    
    /**
     * Validates minimum temperature value.
     *
     * @author - James Linton
     *
     */
    validateTemperatureMin: function(temperatureMin, temperatureMax) {
        if (temperatureMin > temperatureMax)
        {
            return false;
        }
        if (temperatureMax == temperatureMin)
        {
            return false;
        }
        return true;
    },
    
    /** @author - Danny Diep */
    validateTemperatureMax: function(temperatureMax, temperatureMin) {
        if(temperatureMax <= tempertureMin)
        {
            return true;
        }
        else
        {
            return false;
        }
    },
    
    /** @author- Jack Clark */
    validateHumidityMax: function(humidityMax, humidityMin) {
        if (humidityMax <= humidityMin) {
        return false;
        }
        else {
            return true;
        }
    },
    
    /** @author - Jack Clark */
    validateHumidityMin: function(humidityMin, humidityMax) {
       if (humidityMin >= humidityMin) {
        return false;
        }
        else {
            return true;
        } 
    }
};
