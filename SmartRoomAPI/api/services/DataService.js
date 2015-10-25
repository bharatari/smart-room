module.exports = {
    /** 
     * Processes incoming data.
     *
     * @param {Array} data - Array of sensor data.
     * @param {string} data[].name - Name of the data (ex. temperature, humidity).
     * @param {boolean|string|number} data[].value - Value of the data.
     * @param {DataService~callback} cb - Called when function finishes.
     *
     * @throws {NO_DATA} Argument data must not be an empty array.
     * @throws {INVALID_DATA} Argument data must follow the proper structure for sensor data.
     *
     */
    /** @deprecated - Data model is not an array anymore */
    validateData: function(data, cb) {
        if(data) {
            if(!data.length) {
                cb(false, "NO_DATA");
            }
            else {
                
            }
        }
    },
    /**
     * @callback DataService~callback
     * @param {boolean} result - Success boolean value.
     * @param {string} [message] - Error message.
     */
    checkTrends: function() {
    
    }
};
