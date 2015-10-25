module.exports = {
    tableName: 'data',
    schema: true,
    attributes: {
        deviceId: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        value: {
            type: 'json'
        }
    }
};
