//this file contains useful small functions for general purposes

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function lerp(start, stop, amt) {
    return start + (stop - start) * amt;
}

function getDistance(x1, y1, x2, y2) {
    return (Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2)));
}


function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function getTouchPos(evt){
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.center.x - rect.left,
        y: evt.center.y - rect.top
    };
}
