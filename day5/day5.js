var fs = require('fs');

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(1 + index + replacement.length);
}

function react(input) {
    var reacting = true;
    var index = 0;

    while (reacting) {
        var charA = input[index]; 
        var charB = input[index+1]; 
        if (charA.toLowerCase() == charB.toLowerCase() && charA != charB) {
            input.splice(index, 2);
            index = 0;
        } else {
            index++;
            if (!input[index + 1]) {
                reacting = false;
            }
        }
        if (index >= input.length) {
            reacting = false;
        }
    }
    return input;
}

function day_5a() {
    var input = fs.readFileSync('./input_day5.txt', 'utf8');
    var result = react(input.split(''));
    console.info("Resulting number of units in polymer is: " + result.join("").length);
}

function day_5b() {
    var input = fs.readFileSync('./input_day5.txt', 'utf8').split('');
    var result = new Array();

    input.filter(e => e == "a");

    var temp;
    for (i=65; i<=90; i++) {
        temp = input.filter(e => e != String.fromCharCode(i) && e != String.fromCharCode(i+32));
        result.push(react(temp).join("").length);
    }
    result.sort(function (a,b) { return a>b ? 1 : a<b ? -1 : 0; });
    console.info("Lowest polymer size is " + result[0]);
}

day_5a();
day_5b();