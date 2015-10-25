/* global io */
import Ember from 'ember';
import config from 'smart-room-online/config/environment';
import dataUtils from 'smart-room-online/utils/data-utils';

export default Ember.Controller.extend({
	init() {
		this._super();
		io.socket.get(
            config.routeLocation + "/api/data/subscribe"
        );
        io.socket.on('new data', function(message) {
            if(message) {
				console.log(message);
                //dataUtils.processIncoming(this.get('data'), message);
            }
        });   
        io.socket.on('connect', function() {
            io.socket.get(
				config.routeLocation + "/api/data/subscribe"
			);
        }); 
	},
	data: [
		{ name: "temperature", value: 0, suffix: "&deg;C", backgroundColor: "bg-dark-red" },
		{ name: "humidity", value: 0, suffix: "%", backgroundColor: "bg-red" },
		{ name: "motion", value: false, custom: true, backgroundColor: "bg-teal", large: true }	
	]
});
