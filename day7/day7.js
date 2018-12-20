var fs = require('fs');
var folder = "day7/"

function Step(id) {
    var step = new Object();
    step.id = id;
    step.prev = new Array();
    step.time = 60 + id.charCodeAt() - 64;
    return step;
}

function AddStep(arrayOfSteps, stepId, nextId) {
    var step;
    var stepIdx = arrayOfSteps.length == 0 ? -1 : arrayOfSteps.findIndex(e => e.id == stepId);
    if (stepIdx < 0) {
        step = Step(stepId);
        arrayOfSteps.push(step);

    } else {
        step = arrayOfSteps[stepIdx];
    }
    if (nextId != "-1") {
        var nextStep = AddStep(arrayOfSteps, nextId, "-1");
        nextStep.prev.push(step);
    }
    return step;
}

function day_7a() {
    var input = fs.readFileSync('./' + folder + 'input_day7.txt', 'utf8').split("\r\n");
    var steps = new Array();
    
    for (i = 0; i<input.length; i++) {
        AddStep(steps, input[i].charAt(5), input[i].charAt(36))
    }
    var out = "";
    while (steps.length > 0) {
        var next = steps.filter(e => e.prev.length == 0).sort(function (a,b) {
             return a.id.charCodeAt(0) > b.id.charCodeAt(0) ? 1 : a.id.charCodeAt(0) < b.id.charCodeAt(0) ? -1 : 0 
        })[0];
        steps.splice(steps.indexOf(next), 1);
        steps.forEach(function (elem, idx, array) {
            var nextIdx = elem.prev.indexOf(next);
            if (nextIdx >= 0) {
                elem.prev.splice(nextIdx, 1);
            }
        });
        out += next.id;
    }
    console.info("Order of steps is: " + out);
}

function day_7b() {
    var input = fs.readFileSync('./' + folder + 'input_day7.txt', 'utf8').split("\r\n");
    var steps = new Array();
    
    for (i = 0; i<input.length; i++) {
        AddStep(steps, input[i].charAt(5), input[i].charAt(36))
    }
    var out = "";
    var count =  -1;
    var totalSteps = steps.length;
    var workItems = new Array();
    var elfs = 5;

    while (out.length != totalSteps) {
        count++;
        var nextWorkItems = new Array();
        workItems.forEach(function(e) {
            if (e.time > 1) {
                nextWorkItems.push(e);
                e.time -= 1;
            } else {
                out += e.id;
                console.info(out);
                // steps.splice(steps.indexOf(e), 1);
                steps.forEach(function (elem, idx, array) {
                    var nextIdx = elem.prev.indexOf(e);
                    if (nextIdx >= 0) {
                        elem.prev.splice(nextIdx, 1);
                    }
                });
            }
        });
        workItems = nextWorkItems;
        if (workItems.length < elfs) {
            var readyToGo = steps.filter(e => e.prev.length == 0).sort(function (a,b) {
                return a.id.charCodeAt(0) > b.id.charCodeAt(0) ? 1 : a.id.charCodeAt(0) < b.id.charCodeAt(0) ? -1 : 0 
           }).slice(0, elfs - workItems.length);
           readyToGo.forEach(function(e) {
               steps.splice(steps.indexOf(e), 1);
               workItems.push(e);
           });
        }
    }
    console.info("Time it takes is: " + count);
    console.info("Sequence is: " + out);
}

day_7b();



