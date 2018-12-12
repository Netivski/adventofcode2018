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

function parseClaim(line) {
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

function InitClaims(rows, cols) {
    var arr = new Array(rows);
    for (i = 0; i < cols; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

function day_3a() {
    var claims = fs.readFileSync('./input_day3.txt', 'utf8').split('\r\n');
    var fabric = InitClaims(1000, 1000);
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
    var fabric = InitClaims(1000, 1000);
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


function parseShift(line, idLine) {
    //[1518-02-28 00:04] Guard #2731 begins shift

    var idxIdStart = idLine.indexOf('#') + 1;
    var command = GetShiftCommand(line);
    var id, start, isSleep, idSource;

    date = new Date(line.substr(1, 16));
    switch (command) {
        case "guard":
            idSource = line;
            start = true;
            isSleep = false;
            break;
        case "falls":
            idSource = idLine;
            start = false;
            isSleep = true;
            break;
        case "wakes":
            idSource = idLine;
            start = false;
            isSleep = false;
            break;
    }
    id = parseInt(idSource.substr(idxIdStart, idSource.indexOf("begins") - idxIdStart));
    return Shift(date, id, start, isSleep);

}

function GetShiftCommand(line) {
    return line.substr(19, 5).toLowerCase();
}
function Shift(date, id, start, isSleep) {
    var shift = new Object();
    shift.date = date;
    shift.id = id;
    shift.start = start;
    shift.isSleep = isSleep;
    return shift;
}

function InitShifts() {
    var input = fs.readFileSync('./input_day4.txt', 'utf8').split('\r\n');
    input.sort(function(a, b) {
        return a>b ? 1 : a<b ? -1 : 0;
    });
    //console.info(input);
    var arr = new Array(input.length);
    var idLine = input[0];
    for (i = 0; i < input.length; i++) {
        if (GetShiftCommand(input[i]) == "guard" && i > 0) {
            idLine = input[i];
        }
        arr[i] = parseShift(input[i], idLine);
    }
    return arr;
}

function day_4a() {
    var shifts = InitShifts();
    var acc = new Array();
    var currId = 0;
    var currMinute = -1;
    var currIdIdx;
    for (i=0; i< shifts.length; i++) {
        
        if (shifts[i].start) {
            var idxFound = acc.findIndex(elem => elem.id == shifts[i].id);
            if ( idxFound >= 0) {
                currIdIdx = idxFound;
            } else {
                acc.push({id: shifts[i].id, sleep: 0, minutes: new Array() });
                currIdIdx = acc.length - 1;
            }
            currId = shifts[i].id;
            currMinute = -1;
        }

        if (shifts[i].isSleep) {
            var thisMinute = shifts[i].date.getMinutes();
            while (thisMinute < shifts[i+1].date.getMinutes()) {
                acc[currIdIdx].sleep +=1;
                var idxMinFound  = acc[currIdIdx].minutes.findIndex(e  => e.minute == thisMinute);
                if (idxMinFound >= 0) {
                    acc[currIdIdx].minutes[idxMinFound].sleep += 1;
                } else {
                    acc[currIdIdx].minutes.push({minute: thisMinute, sleep: 1 });
                }
                thisMinute += 1;
            }
        }
    }
    acc.sort(function(a, b) {
        return a.sleep>b.sleep ? -1 : a.sleep<b.sleep ? 1 : 0;
    });
    acc[0].minutes.sort(function(a, b) { return a.sleep>b.sleep ? -1 : a.sleep<b.sleep ? 1 : 0; });
    console.info("Guard Id is " + acc[0].id + " and slept " + acc[0].minutes[0].sleep + " minutes on minute " + acc[0].minutes[0].minute);   
}

function day_4b() {
    var shifts = InitShifts();
    var acc = new Array(61);
    var currId = 0;
    var currIdIdx;
    for (i=0; i<acc.length; i++) { acc[i] = { minute: i, sleep: 0, guards: new Array() }; }
    for (i=0; i< shifts.length; i++) {
        if (shifts[i].start) { currId = shifts[i].id; }
        if (shifts[i].isSleep) {
            var thisMinute = shifts[i].date.getMinutes();
            while (thisMinute < shifts[i+1].date.getMinutes()) {
                acc[thisMinute].sleep += 1;
                var currIdIdx = acc[thisMinute].guards.findIndex(e => e.id == currId);
                if (currIdIdx >= 0) {
                    acc[thisMinute].guards[currIdIdx].sleep += 1;
                } else {
                    acc[thisMinute].guards.push({id: currId, sleep: 1});
                }
                thisMinute += 1;
            }
        }
    }
    for (i=0; i < acc.length; i++) {
        if (acc[i].guards[0] == undefined) {
            acc[i].guards.push({id: 0, sleep: 0});
        }
        acc[i].guards.sort(function (a,b) { return a.sleep > b.sleep ? -1 : a.sleep < b.sleep ? 1 : 0 });
    }

    acc.sort(function(a,b) { return a.guards[0].sleep > b.guards[0].sleep ? -1 : a.guards[0].sleep < b.guards[0].sleep ? 1 : 0  });
    
    console.info("Guard Id is " + acc[0].guards[0].id + " and slept " + acc[0].guards[0].sleep + " minutes on minute " + acc[0].minute);   
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

day_5b();