var fs = require('fs');
var folder = "day4/"

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(1 + index + replacement.length);
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
    var input = fs.readFileSync('./' + folder + 'input_day4.txt', 'utf8').split('\r\n');
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
    
    console.info("Guard Id that slept the most is " + acc[0].guards[0].id + " and slept " + acc[0].guards[0].sleep + " minutes on minute " + acc[0].minute);   
}

day_4a();
day_4b();