module.exports = {
    tableName: 'users',
    attributes: {
        username: {
            type: 'string',
            unique: true,
            required: true
        },
        password: {
            type: 'string'
        },
        firstName: {
            type: 'string'
        },
        lastName: {
            type: 'string'
        }        
    },
    toJSON: function() {
        var user = this.toObject();
        delete user.password;
        return user;
    },
    beforeCreate: function(user, cb) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) {
                    cb(err);
                }
                else {
                    user.password = hash;
                    cb(null, user);
                }
            });
        });
    }
}