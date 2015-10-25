import DS from 'ember-data';

export default DS.Model.extend({
    id: DS.attr('string'),
    userId: DS.attr('string'),
    deviceId: DS.attr('string'),
    title: DS.attr('string'),
    body: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});
