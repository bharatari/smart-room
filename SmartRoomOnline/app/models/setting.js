import DS from 'ember-data';

export default DS.Model.extend({
    userId: DS.attr('string'),
    key: DS.attr('string'),
    value: DS.attr(),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});
