module.exports = {
    tableName: 'devices',
    schema: true,
    attributes: {
        uniqueId: {
            type: 'string',
            unique: true,
            required: true
        },
        name: {
            type: 'string'
        }
    }
};
