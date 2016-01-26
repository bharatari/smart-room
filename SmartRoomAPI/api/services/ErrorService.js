module.exports = {
    missingParameter: function(functionName, argumentName) {
        if(argumentName) {
            return functionName + ': argument ' + argumentName + ' must exist';
        }
        else {
            return functionName + ': missing argument';
        }
        
    },
    invalidParameterType: function(functionName, argumentName, argument, expectedType) {
        return 'Invalid argument, ' + 'expected type ' + expectedType + ' got ' + typeof argument;
    },
    databaseError: function(err) {
        return 'Database Error: ' + err;
    }
};
