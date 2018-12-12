var fs = require('fs');

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(1 + index + replacement.length);
}

function day_1a() {
    var expression = fs.readFileSync('./input_day1.txt', 'utf8').replace('\r\n', "");
    console.info(eval(expression));
}

function day_1b() {
    var values = fs.readFileSync('./input_day1.txt', 'utf8').split('\r\n');
    //var values = input_day1.split(';');
    var frequencies = new Array(2048);
    var result = 0;
    var found = false;
    while (!found) {
        for (str of values) {
            result += parseInt(str);
            if (frequencies[result] == "X") {
                found = true;
                console.info("Frequency repeated twice is: " + result);
                return;
            } else {
                frequencies[result] = "X";
            }
        }
    }
}

day_1a();
day_1b();