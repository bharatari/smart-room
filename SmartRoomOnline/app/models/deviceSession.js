import DS from 'ember-data';

export default DS.Model.extend({
    token: DS.attr('string'),
    deviceId: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});
