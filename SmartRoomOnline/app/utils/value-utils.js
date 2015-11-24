/**
 *
 * Bharat Arimilli, Jack Clark, James Linton, Miguel De La Rocha, Danny Diep
 *
 */
import Ember from 'ember';

export default {
	configuration: [
		{ name: "temperature", result: 0, suffix: "&deg;C", backgroundColor: "bg-dark-red" },
		{ name: "humidity", result: 0, suffix: "%", backgroundColor: "bg-red" },
		{ name: "motion", result: false, custom: true, backgroundColor: "bg-teal", large: true },
		{ name: "light", result: false, custom: true, backgroundColor: "bg-dark", large: true }	
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
				else if (name === "light") {
					return this.processLight(result);
				}
				else {
					// If custom was passed as true and there's no 
					// defined formatting mechanism, just return the value and call toString()
					if(typeof result === 'number') {
						return result.toFixed(0);
					} else {
						return result.toString();	
					}
				}
			}
			else {
				if(suffix) {
					if(typeof suffix === "string") {
						if (typeof result === 'number') {
							return result.toFixed(0) + suffix;
						} else {
							return result.toString() + suffix;
						}
					}
					else {
						if (typeof result === 'number') {
							return result.toFixed(2);
						} else {
							return result.toString();
						}
					}
				}
				else {
					if (typeof result === 'number') {
						return result.toFixed(0);
					} else {
						return result.toString();
					}
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
	/*
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
	
	processLight(result) {
		if (result != null) {
			if (result) {
				return "Lights On";
			} else {
				return "Lights Off";
			}
		}	
	}, */
	
	processIncoming(values, incoming) {
		if(values && incoming) {
			for(let i = 0; i < values.length; i++) {
				if(values[i]) {
					if(values[i].name === incoming.name) {
						Ember.set(values[i], 'result', incoming.result);
					}
				}
			}
		}
		return values;
	},
	
	/** @todo - make this safer */
	processInitial(configuration, ...values) {
		for (let value of configuration) {
			for (let newValue of values) {
				if (value.name === newValue.name) {
					value.result = newValue.result;
				}
			}
		}
		return configuration;
	},
	
	/** @author - Miguel De La Rocha */
	processTemperatureUnits(value, fahrenheit) {
		if(value != null)
		{
				if(fahrenheit)
			{
				return value * (9 / 5) + 32;
			}
				else
			{
				return value; 
			}
		}
		else 
		{
			return 0;
		}
		
	},
	
	/** @author - Miguel De La Rocha */
	
	processMotion(result) {
		if (result != null)
		{
				if(result == true)
			{
				return "Motion Detected";
			}
			else
			{
				return "No Motion";
			}
		}
		else
		{
			return "No Input";
		}
		
	},
	
	/** @author - Miguel De La Rocha */
	
	processLight(result) {
		if (result != null)
		{
				if(result == true)
			{
				return "Lights On";
			}
			else
			{
				return "Lights Off";
			}
		}
		else 
		{
			return "No Input";
		}
	}
		
		
	
}
