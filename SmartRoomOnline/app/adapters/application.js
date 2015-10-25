import DS from 'ember-data';
import config from 'smart-room-online/config/environment';

export default DS.JSONAPIAdapter.extend({
    namespace: 'api',
    host: config.routeLocation 
});
