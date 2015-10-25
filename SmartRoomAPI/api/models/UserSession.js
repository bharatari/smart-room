module.exports = {
    tableName: 'userSessions',
    schema: true,
    attributes: {
        token: {
            type:'string'  
        },
        userId: {
            type:'string'
        }
    }
};
