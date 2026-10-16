function roundMe() {
    var result = [];

    for (var i = 0; i < arguments.length; i++) {
        result.push(Math.round(arguments[i]));
    }

    if (result.length == 0) {
        return 0;
    }

    if (result.length == 1) {
        return result[0];
    }

    return result;
}

console.log(roundMe());
console.log(roundMe(4.7));
console.log(roundMe(4.7, 4.4));