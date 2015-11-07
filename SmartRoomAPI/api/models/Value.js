module.exports = {
    tableName: 'values',
    schema: true,
    attributes: {
        deviceId: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        result: {
            type: 'json'
        }
    }
};
