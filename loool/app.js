'use strict';
var canvas;
var ctx;

window.onload = function () {
    setup();
};

function setup() {
    //parameters "word" needs to display
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;
    foregrndColor='rgba(255,255,255,1)';
    backgrndColor='rgba(0,0,0,1)';
    baseUnit=w/7;

    //initialisation of the necessary values to calculate
    initWord();
    initListeners();

    //app is running!
    draw();
}


function draw() {
    //refresh of the color is made in the adaptColor function

    drawProcess();
    requestAnimationFrame(draw);
}