/* global io */
import Ember from 'ember';
import config from 'smart-room-online/config/environment';
import valueUtils from 'smart-room-online/utils/value-utils';

export default Ember.Controller.extend({
	init() {
		this._super();
		io.socket.get(
            config.routeLocation + "/api/values/subscribe"
        );
        io.socket.on('new data', function(message) {
            if(message) {
				console.log(message);
                valueUtils.processIncoming(this.get('configuration'), message);
            }
        });   
        io.socket.on('connect', function() {
            io.socket.get(
				config.routeLocation + "/api/values/subscribe"
			);
        }); 
	},
    /* Need a default value in case WebSockets triggers before model resolves
	configuration: valueUtils.configuration
    */
});
