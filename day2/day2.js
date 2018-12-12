var fs = require('fs');

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(1 + index + replacement.length);
}

function day_2a() {
    var values = fs.readFileSync('./input_day2.txt', 'utf8').split('\r\n');
    //var values = input_day2.split(';');
    var nrTwice = 0;
    var nrTrice = 0;

    for (str of values) {
        var occurrence = new Object();
        var chars = str.split('');
        var countTwice = false;
        var countTrice=false;
        for (ch of chars) {
            if (occurrence[ch] == undefined) { occurrence[ch] = 1; }
            else { occurrence[ch] += 1; }
        }
        for (prop in occurrence) {
            if (occurrence.hasOwnProperty(prop)) {
                if (occurrence[prop] == 2) { countTwice = true; }
                if (occurrence[prop] == 3) { countTrice = true; }
            }
        }
        nrTwice += (countTwice ? 1 : 0);
        nrTrice += (countTrice ? 1 : 0);
    }
    console.info("Nr Twice: " + nrTwice);
    console.info("Nr Trice: " + nrTrice);
}

function day_2b() {
    var values = fs.readFileSync('./input_day2.txt', 'utf8').split('\r\n');
    //var values = input_day2.split(';');
    for (i=0; i<values.length; i++) {
        for (j=i+1; j<values.length; j++) {
            var result = -1;
            for (k=0; k<values[i].length; k++) {
                if (values[i].charAt(k) != values[j].charAt(k)) {
                    if (result > -1) { 
                        result = -1;
                        break;
                    }
                    result = k;
                }
            }
            if (result != -1) {
                console.info("Position of different chars between " + values[i] + " and " + values[j] + " is " + result);
                console.info("Id is: " + values[i].replaceAt(result, ""));
                return;
            }
        }
    }
}

day_2a();
day_2b();