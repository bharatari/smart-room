export default {
	/** 
     * Formats data value.
     *
     * @param {string} name - Name of the data (e.g. temperature, humidity).
     * @param {string} value 
     * @param {boolean} custom - Whether this data has a special formating mechanism.
	 * @param {string} suffix - String to append to data value, ignored if custom is true.
     * @returns {string} - Formatted data value.
	 */
	processValue(name, value, custom, suffix) {
		if(value != null) {
			if(custom) {
				if(name === "motion") {
					return this.processMotion(value);
				}
				else {
					// If custom was passed as true and there's no 
					// defined formatting mechanism, just return the value and call toString()
					return value.toString();	
				}
			}
			else {
				if(suffix) {
					if(typeof suffix === "string") {
						return value.toString() + suffix;
					}
					else {
						return value.toString();
					}
				}
				else {
					return value.toString();
				}
			}
		}
		else {
			return "";
		}
	},
	
	/** 
     * Formats motion data.
     *
     * @param {boolean} value
     * @returns {string} 
	 */
	processMotion(value) {
		if(value != null) {
			if(value) {
				return "Motion Detected";
			}
			else {
				return "No Motion";
			}
		}
	},
	
	/** 
     * Processes incoming data.
     *
     * @param {Array} data - Existing data object.
	 * @param {Object} incoming - Incoming data from the server.
     * @returns {Object} 
	 */
	/*
	processIncoming(data, incoming) {
		if(data && incoming) {
			for(let i = 0; i < data.length; i++) {
				if(incoming.value) {
					for(let e = 0; e < incoming.value.length; e++) {
						if(data[i] && incoming.value[i]) {
							if(data[i].name === incoming.value[i].name) {
								data[i].value = incoming.value[i].value;
							}
						}
					}
				}
			}
			return data;	
		}
		else {
			return data;
		}
	} */
	processIncoming(data, incoming) {
		if(data & incoming) {
			for(let i = 0; i < data.length; i++) {
				if(data[i]) {
					if(data[i].name === incoming.name) {
						data[i].value = incoming.value;
					}
				}
			}
		}
	}
}
