/* global io */
import Ember from 'ember';
import config from 'smart-room-online/config/environment';
import valueUtils from 'smart-room-online/utils/value-utils';

export default Ember.Controller.extend({
	init() {
        let self = this;
        
		this._super();
		io.socket.get(
            config.routeLocation + "/api/values/subscribe"
        );
        io.socket.on('value', function(message) {
            if(message) {
                self.set('configuration', valueUtils.processIncoming(self.get('configuration'), message.data));
            }
        });   
        io.socket.on('connect', function() {
            io.socket.get(
				config.routeLocation + "/api/values/subscribe"
			);
        }); 
	},
    // Need a default value in case WebSockets triggers before model resolves
	configuration: valueUtils.configuration,
    actions: {
        goToSettings() {
            this.transitionToRoute('settings');
        },
        goToIndex() {
            this.transitionToRoute('index');
        }
    }
});
