module.exports = {
    uniqueUsername: function(users, username) {
        if(users) {
            for(var i = 0; i < users.length; i++) {
                if(users[i]) {
                    if(users[i].username === username) {
                        return false;
                    }
                }
            }
            return true;
        }
        else {
            return true;
        }
    },
    checkUniqueUsername: function(username, cb) {
        if(username) {
            User.find().exec(function(err, users) {
                if(UserService.uniqueUsername(users, username)) {
                    cb(true);
                }
                else {
                    cb(false);
                }
            });
        }
        else {
            cb(true);
        }
    }
}