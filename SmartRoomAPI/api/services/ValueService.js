var moment = require('moment');

module.exports = {
    /**
     * Checks if the client is eligible for a temperature min/max 
     * notification and sends the notification if it is.
     */
    // TODO Remove lastTemperature check
    temperature: function(cb) {
        var self = this;
        
        Value.findOne({ name: 'temperature' }).sort('createdAt DESC').exec(function(err, temperature) {
            if (err || !temperature) {
                // No records, so there's no notification to send
                cb(null, false);
            } else {
                self.temperatureHigh(temperature.result, function(err, result) {
                    if (err || !result) {
                        self.temperatureLow(temperature.result, function(err, result) {
                            if (err || !result) {
                                cb(null, false);
                            } else {
                                NotificationService.submitNotification("Temperature Low", "Your temperature seems to be lower than usual", function(err, result) {
                                    if (err || !result) {
                                        cb(null, false);
                                    } else {
                                        cb(null, result);
                                    } 
                                });
                            }
                        });
                    } else {
                        NotificationService.submitNotification("Temperature High", "Your temperature seems to be higher than usual", function(err, result) {
                            if (err || !result) {
                                cb(null, false);
                            } else {
                                cb(null, result);
                            }
                        });
                    }
                });
            }
        });
    },
    
    /**
     * Checks if the client is eligible for a humidity min/max 
     * notification and sends the notification if it is.
     */
    // Check lastHumidity
    humidity: function(cb) {
        var self = this;
        
        Value.findOne({ name: 'humidity' }).sort('createdAt DESC').exec(function(err, humidity) {
            if (err || !humidity) {
                // No records, so no notifications need to be sent
                cb(null, false);
            } else {
                self.humidityHigh(humidity.result, function(err, result) {
                    if (err || !result) {
                        self.humidityLow(humidity.result, function(err, result) {
                            if (err || !result) {
                                cb(null, false);
                            } else {
                                NotificationService.submitNotification("Humidity Low", "Your humidity seems to be lower than usual", function(err, result) {
                                    if (err || !result) {
                                        cb(null, false);
                                    } else {
                                        cb(null, result);
                                    } 
                                });
                            }
                        });
                    } else {
                        NotificationService.submitNotification("Humidity High", "Your humidity seems to be higher than usual", function(err, result) {
                            if (err || !result) {
                                cb(null, false);
                            } else {
                                cb(null, result);
                            }
                        });
                    }
                });
            }
        });
    },
    
    /**
     * Checks if the client is eligible for a lights on 
     * notification and sends the notification if it is.
     */
    // TODO Use roomNotOccupied
    lightsOnNotification: function(cb) {
        var self = this;
        
        Value.findOne({ name: 'motion' }).sort('createdAt DESC').exec(function(err, motion) {
            if (err || !motion) {
                // No records, no notifications to send
                cb(null, false);
            } else {
                if (!motion.result) {
                    Value.findOne({ name: 'light' }).sort('createdAt DESC').exec(function(err, light) {
                        if(err || !light) {
                            // No light data, so we can't tell
                            // if this notification should be sent
                            cb(null, false);
                        } else {
                            if (light.result) {
                                // No motion detected, lights are on
                                NotificationService.submitNotification("Your lights are on", "You seemed to have left the room with the lights on", function(err, result) {
                                    if (err || !result) {
                                        cb(null, false);
                                    } else {
                                        cb(null, result);
                                    }
                                });
                            } else {
                                cb(null, false);
                            }
                        }
                    });
                } else {
                    cb(null, false);
                }
            }
        });
    },    
    
    /**
     * Checks if the room has been unoccupied for over 1 minute.
     *
     * @param {ValueService~callback} cb 
     */
    roomNotOccupied: function(cb) {
        var current = new moment();

        Value.findOne({ name: 'motion' }).sort('createdAt DESC').exec(function(err, value) {
            if(err || !value) 
            {
                cb(true);   
            } else {
                if(!value.result) 
                {
                    if(moment(value.createdAt).subtract(current).minute() > 1) 
                    {
                        cb(null, true);
                    } 
                    else {
                        cb(null, false);
                    }
                } 
                else 
                {
                    cb(null, false);
                }
                
            }
        });
        
    },

    /**
     * Checks if temperature is over the user-specified
     * maximum and returns (through a callback) true or false.
     */
    temperatureHigh: function(currentTemperature, cb) {
        Setting.findOne({ key: "temperatureMax" }).exec(function(err, settings) {
            if(err || !settings || !currentTemperature) {
                cb(true);
            }
            else {
                var userMax = settings.value;
                if(currentTemperature > userMax)
                {
                    cb(null, true);
                }
                else
                {
                    cb(null, false);
                }
            }
        });
    },
    
    /**
     * Checks if temperature is under the user-specified
     * minimum and returns (through a callback) true or false.
     */
    temperatureLow: function(currentTemperature, cb) {
        Setting.findOne({ key: "temperatureMin" }).exec(function(err, settings) {
            if(err || !settings || !currentTemperature) {
                // we have a problem
            }
            else {
                var userMin = settings.value;
                if(currentTemperature > userMin)
                {
                    cb(null, false);
                }
                else
                {
                    cb(null, true);
                }
            }
        });
        
    },
    
    /**
     * Checks if humidity is over the user-specified maximum
     * and returns (through a callback) true or false.
     */
    humidityHigh: function(currentHumidity, cb) {
        Setting.findOne({ key: "humidityMax" }).exec(function(err, settings) {
            if(err || !settings || !currentHumidity) {
                cb(true);
            }
            else {
                var humidityMax = settings.value;
                if (currentHumidity>=humidityMax) {
                    cb(null, true); 
                }
                else {
                    cb(null, false);
                }
            }
        });
        
    },
    
    /**
     * Checks if humidity is under the user-specified minimum
     * and returns (through a callback) true or false.
     */
    humidityLow: function(currentHumidity, cb) {
        Setting.findOne({ key: "humidityMin" }).exec(function(err, settings) {
            if(err || !settings || !currentHumidity) {
                cb(true);
            }
            else {
                var humidityMin = settings.value;
                if (currentHumidity<=humidityMin) {
                    cb(null, true); 
                }
                else {
                    cb(null, false);
                }
            }
        });
    },
    
    threshold: function() {
        var dictionary = new Array();
        dictionary["temperature"] = 1;
        dictionary["humidity"] = 0.5;
        return dictionary;
    }
};
