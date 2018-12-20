var fs = require('fs');
var folder = "day13/"

function initMatrix(rows, cols) {
    var matrix = new Array(rows);
    for (i=0; i<matrix.length; i++) {
        matrix[i] = new Array(cols);
    }
    return matrix;
}

function getKartProps(char) {
    var kartProp = {nextX: 0, nextY: 0};

    switch (char) {
        case '^':
            kartProp.nextY = -1;
            break;
        case 'v':
        kartProp.nextY = 1;
            break;
        case '<':
            kartProp.nextX = -1;
            break;
        case '>':
            kartProp.nextX = 1;
            break;
    }
}

function isKart(char) { return char == '^' || char == 'v' || char == '<' || char == '>'; }

function Cell(char) {
    if (char == ' ') return;
    var cell = new Object();
    cell.srcChar = isKart(char) ? ((char == '^' || char == 'v') ? '|' : '-') : char ;
    cell.type = (cell.srcChar == ' ' ? "empty" : (cell.srcChar == '+' ? "intersect" : "track"));
    cell.hasKart = isKart(char);
    cell.kartDirection = getKartProps(char);
    cell.kartStatus = 0;
    return cell;
}

function day_13a() {
    var input = fs.readFileSync('./' + folder + 'input_day13.txt', 'utf8').split("\r\n");
    var rows = input.length;
    var cols = input[0].length;
    var matrix = initMatrix(rows, cols);

    for (i=0; i<rows; i++) {
        var cells = input[i].split('');
        for (j=0; j<cols; j++) {
            matrix[i][j] = Cell(cells[j]);
        }
    }
    console.info("Done");
    
}

day_13a();



