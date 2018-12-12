var fs = require('fs');

function parseLine(line) {
    //5, 36
    return {id: line.charAt(5), nextId: line.charAt(36) };
}

function Step(id) {
    var step = new Object();
    step.id = id;
    step.prev = new Array();
    return step;
}

function AddStep(listOfSteps, stepId, nextId) {
    var step;
    var stepIdx = listOfSteps.length == 0 ? -1 : listOfSteps.findIndex(e => e.id == stepId);
    if (stepIdx < 0) {
        step = Step(stepId);
        listOfSteps.push(step);

    } else {
        step = listOfSteps[stepIdx];
    }
    if (nextId != "-1") {
        var nextStep = AddStep(listOfSteps, nextId, "-1");
        nextStep.prev.push(step);
    }
    return step;
}

function day_7a() {
    var input = fs.readFileSync('./input_day7.txt', 'utf8').split("\r\n");
    var res = new Array();
    
    for (i = 0; i<input.length; i++) {
        var step = parseLine(input[i]);
        AddStep(res, step.id, step.nextId)
    }
    var out = "";
    while (res.length > 0) {
        var next = res.filter(e => e.prev.length == 0).sort(function (a,b) {
             return a.id.charCodeAt(0) > b.id.charCodeAt(0) ? 1 : a.id.charCodeAt(0) < b.id.charCodeAt(0) ? -1 : 0 
        })[0];
        res.splice(res.indexOf(next), 1);
        res.forEach(function (elem, idx, array) {
            var nextIdx = elem.prev.indexOf(next);
            if (nextIdx >= 0) {
                elem.prev.splice(nextIdx, 1);
            }
        });
        out += next.id;
    }
    console.info("Order of steps is: " + out);
}

day_7a();



