/**
 * Bharat Arimilli, Jack Clark, James Linton, Miguel De La Rocha, Danny Diep
 *
 * @module ValueService
 */
var moment = require('moment');

module.exports = {
    /**
     * Checks if the client is eligible for a temperature min/max 
     * notification and sends the notification if it is.
     *
     * @author - Bharat Arimilli
     */
    // TODO Check lastTemperature
    temperature: function(cb) {
        var self = this;
        
        Value.findOne({ name: 'temperature' }).sort('createdAt DESC').exec(function(err, temperature) {
            if (err || !temperature) {
                // No records, so there's no notification to send
                cb(null, false);
            } else {
                // Find which record the last temperature notification was sent for
                Setting.findOne({ key: 'lastTemperature' }).exec(function(err, setting) {
                    if (setting) {
                        if (setting.value === temperature.id) {
                            // We've already sent this notification for this record
                            return cb(null, false);
                        }
                    }
                    self.temperatureHigh(temperature.result, function(err, result) {
                        if (err || !result) {
                            self.temperatureLow(temperature.result, function(err, result) {
                                if (err || !result) {
                                    cb(null, false);
                                } else {
                                    NotificationService.sendNotification("Temperature Low", "Your temperature seems to be lower than usual", function(err, result) {
                                        if (err || !result) {
                                            cb(null, false);
                                        } else {
                                            SettingService.updateSetting('lastTemperature', temperature.id, function(err, result) {
                                                // Allow updateSetting to fail silently
                                                cb(null, true);
                                            });
                                        } 
                                    });
                                }
                            });
                        } else {
                            NotificationService.sendNotification("Temperature High", "Your temperature seems to be higher than usual", function(err, result) {
                                if (err || !result) {
                                    cb(null, false);
                                } else {
                                    SettingService.updateSetting('lastTemperature', temperature.id, function(err, result) {
                                        // Allow updateSetting to fail silently
                                        cb(null, true);
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    },
    
    /**
     * Checks if the client is eligible for a humidity min/max 
     * notification and sends the notification if it is.
     *
     * @author - Bharat Arimilli
     */
    // Check lastHumidity
    humidity: function(cb) {
        var self = this;
        
        Value.findOne({ name: 'humidity' }).sort('createdAt DESC').exec(function(err, humidity) {
            if (err || !humidity) {
                // No records, so no notifications need to be sent
                cb(null, false);
            } else {
                // Find which record the last humidity notification was sent for
                Setting.findOne({ key: 'lastHumidity' }).exec(function(err, setting) {
                    if (setting) {
                        if (setting.value === humidity.id) {
                            // Already sent a notification for this record
                            return cb(null, false);
                        }
                    }
                    self.humidityHigh(humidity.result, function(err, result) {
                        if (err || !result) {
                            self.humidityLow(humidity.result, function(err, result) {
                                if (err || !result) {
                                    cb(null, false);
                                } else {
                                    NotificationService.sendNotification("Humidity Low", "Your humidity seems to be lower than usual", function(err, result) {
                                        if (err || !result) {
                                            cb(null, false);
                                        } else {
                                            SettingService.updateSetting('lastHumidity', humidity.id, function(err, result) {
                                                // Allow updateSetting to fail silently
                                                cb(null, true);
                                            });
                                        } 
                                    });
                                }
                            });
                        } else {
                            NotificationService.sendNotification("Humidity High", "Your humidity seems to be higher than usual", function(err, result) {
                                if (err || !result) {
                                    cb(null, false);
                                } else {
                                    SettingService.updateSetting('lastHumidity', humidity.id, function(err, result) {
                                        // Allow updateSetting to fail silently
                                        cb(null, true);
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    },
    
    /**
     * Checks if the client is eligible for a lights on 
     * notification and sends the notification if it is.
     *
     * @author - Bharat Arimilli
     */
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
                                // Now we need to see if we've already sent a notification for this specific instance of the scenario
                                self.eligibleForLightsOnNotification(motion, function(err, result) {
                                    if (err || !result) {
                                        cb(null, false);
                                    } else {
                                        NotificationService.sendNotification("Your lights are on", "You seemed to have left the room with the lights on", function(err, result) {
                                            if (err || !result) {
                                                cb(null, false);
                                            } else {
                                                SettingService.updateSetting('lastLightsOn', motion.id, function(err, result) {
                                                    // Allow updateSetting to fail silently
                                                    cb(null, true);
                                                });
                                                
                                            }
                                        });
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
     * Checks if the client is eligible for a lights on 
     * notification based on whether one was already sent for this
     * record.
     *
     * @author - Bharat Arimilli
     */
    eligibleForLightsOnNotification: function(lastMotion, cb) {
        Setting.findOne({ key: 'lastLightsOn' }).sort('createdAt DESC').exec(function(err, setting) {
            // No such setting exists, send the notification
            if (err || !setting) {
                cb(null, true);
            } else {
                if (setting.valueId === lastMotion.id) {
                    // we already sent a notification for this record
                    cb(null, false);
                } else {
                    // Checking the last motion record is the critical factor here
                    cb(null, true);
                }          
            }
        });
    },
    
    
    /**
     * Checks if the room has been unoccupied for over 1 minute.
     *
     * @author - James
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
     *
     * @author - Danny Diep
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
     *
     * @author - Danny Diep
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
     *
     * @author - Jack Clark
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
     *
     * @author - Jack Clark
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
