module.exports = {
    tableName: 'deviceSessions',
    schema: true,
    attributes: {
        token: {
            type:'string'  
        },
        deviceId: {
            type:'string'
        }
    }
};
