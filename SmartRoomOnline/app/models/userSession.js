import DS from 'ember-data';

export default DS.Model.extend({
    id: DS.attr('string'),
    token: DS.attr('string'),
    userId: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});
