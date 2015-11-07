export default {
	configuration: [
		{ name: "temperature", result: 0, suffix: "&deg;C", backgroundColor: "bg-dark-red" },
		{ name: "humidity", result: 0, suffix: "%", backgroundColor: "bg-red" },
		{ name: "motion", result: false, custom: true, backgroundColor: "bg-teal", large: true }	
	],
	
	/** 
     * Formats data value.
     *
     * @param {string} name - Name of the data (e.g. temperature, humidity).
     * @param {string|number|boolean} result 
     * @param {boolean} custom - Whether this data has a special formating mechanism.
	 * @param {string} suffix - String to append to data value, ignored if custom is true.
     * @returns {string} - Formatted data value.
	 */
	processResult(name, result, custom, suffix) {
		if(result != null) {
			if(custom) {
				if(name === "motion") {
					return this.processMotion(result);
				}
				else {
					// If custom was passed as true and there's no 
					// defined formatting mechanism, just return the value and call toString()
					return result.toString();	
				}
			}
			else {
				if(suffix) {
					if(typeof suffix === "string") {
						return result.toString() + suffix;
					}
					else {
						return result.toString();
					}
				}
				else {
					return result.toString();
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
     * @param {boolean} result
     * @returns {string} 
	 */
	processMotion(result) {
		if(result != null) {
			if(result) {
				return "Motion Detected";
			}
			else {
				return "No Motion";
			}
		}
	},

	processIncoming(values, incoming) {
		if(values & incoming) {
			for(let i = 0; i < values.length; i++) {
				if(values[i]) {
					if(values[i].name === incoming.name) {
						values[i].result = incoming.result;
					}
				}
			}
		}
	},
	
	/** @todo - make this safer */
	processInitial(configuration, ...values) {
		for (let value of configuration) {
			for (let newValue of values) {
				if(value.name === newValue.name) {
					value.result = newValue.result;
				}
			}
		}
	}
}
