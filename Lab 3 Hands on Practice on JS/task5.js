function abs() {
    var result = [];

    for (var i = 0; i < arguments.length; i++) {
        result.push(Math.abs(arguments[i]));
    }

    if (result.length == 1) return result[0];
    return result;
}

function ceil() {
    var result = [];

    for (var i = 0; i < arguments.length; i++) {
        result.push(Math.ceil(arguments[i]));
    }

    if (result.length == 1) return result[0];
    return result;
}

function floor() {
    var result = [];

    for (var i = 0; i < arguments.length; i++) {
        result.push(Math.floor(arguments[i]));
    }

    if (result.length == 1) return result[0];
    return result;
}

console.log(abs(-5));
console.log(abs(-5, 3, -8));

console.log(ceil(4.2));
console.log(ceil(4.2, 5.7));

console.log(floor(4.9));
console.log(floor(4.9, 5.7));