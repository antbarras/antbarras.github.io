"use strict";
//var log;
var touchScreen;
var touchScreenCustom;
var mirrorLock; //this prevents the conflicts due to the touch screen implementation

//assign all interactions
function initListeners() {
    //log = document.getElementById('log');
    touchScreen = new Hammer(canvas);
    touchScreen.get('pan').set({direction: Hammer.DIRECTION_ALL});
    touchScreen.get('pan').set({threshold: 0});
    var multipan = new Hammer.Pan({
        event: 'multipan',
        direction: Hammer.DIRECTION_ALL,
        threshold: 0,
        pointers: 2
    });


    //the multipan event is a special one so we need to manually
    //add it in the manager
    touchScreenCustom = new Hammer.Manager(canvas);
    touchScreenCustom.add(multipan);
    touchScreenCustom.add(new Hammer.Press());

    mirrorLock = false;

    //first interaction, the transformation
    transformInteraction();
    //second interaction, the mirror
    mirrorInteraction();
    //third interaction
    simpleRotateInteraction();
    //fourth interaction
    infiniteRotateInteraction();


    window.addEventListener('resize', function (evt) {
        resize();
    });
    window.addEventListener('orientationchange', function (evt) {
        resize();
    });

}

function transformInteraction() {
    //follows the pan if touch
    touchScreen.on('pan', function (evt) {
        var mousePos = getTouchPos(evt);
        positionX = mousePos.x;
        positionY = mousePos.y;
        //this is to prevent conflicts with the mirror mode
        if (!mirrorLock) {
            mirror = false;
            mirrorShown=false;
        }
    });
    //follow the mouse if computer
    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = getMousePos(evt);
        positionX = mousePos.x;
        positionY = mousePos.y;
        // console.log("topleftproportion"+topLeftProportion);
        // console.log("bottomleftproportion"+bottomLeftProportion);
        // console.log("toprightproportion"+topRightProportion);
        // console.log("bottomrightproportion"+bottomRightProportion);
        // console.log("curentRotation"+currentRotation);
        // console.log("----------------------------------------");
    });
}

function mirrorInteraction() {
    touchScreenCustom.on('multipan', function (evt) {
        var mousePos = getTouchPos(evt);
        positionX = mousePos.x;
        positionY = mousePos.y;

        //log.innerHTML = "eh wais";

        mirror = true;
    });

    touchScreenCustom.on('multipanend', function () {
        if (!mirrorLock) {
            mirror = false;
            mirrorShown=false;
        }
    });

    //mouse pressed or not
    canvas.addEventListener('mousedown', function (evt) {
        mirror = true;
        mirrorLock = true;
    });

    canvas.addEventListener('mouseup', function (evt) {
        mirror = false;
        mirrorShown=false;
        mirrorLock = false;
    });

}

function simpleRotateInteraction() {
    touchScreen.on('tap', function (evt) {
        rotateAnimation = true;
        upsideDown = !upsideDown;
    });
}

function infiniteRotateInteraction() {
    touchScreen.on('doubletap', function (evt) {
        infiniteRotating = !infiniteRotating;

        //if it's set to off
        if (infiniteRotating == false) {
            rotateAnimation = false;
            currentRotation = 0;
            upsideDown = false;
        } else {
            rotateAnimation = true;
        }
    });
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    w = canvas.width;
    h = canvas.height;
    baseUnit = w / 8;
    initSize();
    initOffsets();
}