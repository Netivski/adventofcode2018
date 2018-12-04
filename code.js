var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(1 + index + replacement.length);
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function day_1a() {
    var values = fs.readFileSync('./input_day1.txt', 'utf8').split('\r\n');
    //var values = input_day1.split(';');
    var result = 0;
    for (str of values) {
        result += parseInt(str);
    }
    console.info(result);
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

function parseClaim( line) {
    //#1277 @ 31,500: 25x27

    id = line.substr(1, line.indexOf('@')-1).trim();
    temp = line.substr(line.indexOf('@') + 2).split(':');
    leftTop = temp[0].split(',');
    widthHeight = temp[1].split('x');
    return Claim(id, leftTop[0], leftTop[1], widthHeight[0], widthHeight[1]);
}

function Claim(id, left, top, width, height) {
    var claim = new Object();
    claim.id = parseInt(id);
    claim.left = parseInt(left);
    claim.top = parseInt(top);
    claim.width = parseInt(width);
    claim.height = parseInt(height);
    return claim;
}

function InitArray(rows, cols) {
    var arr = new Array(rows);
    for (i = 0; i < cols; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

function day_3a() {
    var claims = fs.readFileSync('./input_day3.txt', 'utf8').split('\r\n');
    var fabric = InitArray(1000, 1000);
    for (line of claims) {
        var claim = parseClaim(line);
        for (i=claim.left; i<claim.left + claim.width; i++) {
            for (j=claim.top; j<claim.top + claim.height; j++) {
                if (fabric[i][j] == undefined) { fabric[i][j] = new Array(); }
                fabric[i][j].push(claim.id);
            }
        }
    }
    var res = 0;
    for (i=0; i<1000; i++) {
        for (j=0; j<1000; j++) {
            res += (fabric[i][j] != undefined && fabric[i][j].length > 1) ? 1 : 0;
        }
    }
    console.info("Overlap is: " + res);
}

function day_3b() {
    var claims = fs.readFileSync('./input_day3.txt', 'utf8').split('\r\n');
    var fabric = InitArray(1000, 1000);
    for (line of claims) {
        var claim = parseClaim(line);
        for (i=claim.left; i<claim.left + claim.width; i++) {
            for (j=claim.top; j<claim.top + claim.height; j++) {
                if (fabric[i][j] == undefined) { fabric[i][j] = new Array(); }
                fabric[i][j].push(claim.id);
            }
        }
    }
    var res = new Set();
    for (i=0; i<1000; i++) {
        for (j=0; j<1000; j++) {
            if (fabric[i][j] != undefined && fabric[i][j].length == 1) {
                res.add(fabric[i][j][0]);
            }
        }
    }
    for (i=0; i<1000; i++) {
        for (j=0; j<1000; j++) {
            if (fabric[i][j] != undefined && fabric[i][j].length > 1) {
                for (k=0; k<fabric[i][j].length; k++) {
                    if (res.has(fabric[i][j][k])){
                        res.delete(fabric[i][j][k]);
                    }
                }
            }
        }
    }
    console.info("Id with no overlaps is: " + res.values().next().value);
}

day_3b();