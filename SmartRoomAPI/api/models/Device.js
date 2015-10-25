module.exports = {
    tableName: 'devices',
    schema: true,
    attributes: {
        deviceId: {
            type: 'string',
            unique: true,
            required: true
        },
        name: {
            type: 'string'
        }
    }
};
