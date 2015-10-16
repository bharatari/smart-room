module.exports = {
    tableName: 'devices',
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
}