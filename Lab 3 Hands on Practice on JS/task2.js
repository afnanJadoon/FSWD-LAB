var num = 67;
var next = num + 1;

while (true) {
    var prime = true;

    for (var i = 2; i < next; i++) {
        if (next % i == 0) {
            prime = false;
            break;
        }
    }

    if (prime && next > 1) {
        console.log("Next prime number is " + next);
        break;
    }

    next++;
}