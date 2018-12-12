var fs = require('fs');

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(1 + index + replacement.length);
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

day_3a();
day_3b();