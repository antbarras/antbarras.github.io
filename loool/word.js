"use strict";
//elements to draw on
var w;
var h;
var foregrndColor;
var backgrndColor;

//elements of size
var baseUnit;
var barHeight;
var circleRadius;
var strokeWidth;
var littleBar;
var openingAngle;

//defined offsets to draw words
var firstRectangleOffset;
var secondRectangleOffset;
var firstCircleOffset;
var secondCircleOffset;
var thirdCircleOffset;

//current settings for all letters
var topLeftProportion;
var bottomLeftProportion;
var topRightProportion;
var bottomRightProportion;
var zeroDistance;
var distanceTopLeft;
var distanceTopRight;
var distanceBottomLeft;
var distanceBottomRight;


//current settings specific for round letters
var firstCircleCutDeparture;
var firstCircleCutArrival;
var secondCircleCutDeparture;
var secondCircleCutArrival;
var thirdCircleCutDeparture;
var thirdCircleCutArrival;
var firstCircleBarDeparture;
var firstCircleBarHeight;
var firstCircleBarArrival;
var secondCircleBarDeparture;
var secondCircleBarHeight;
var secondCircleBarArrival;
var thirdCircleBarDeparture;
var thirdCircleBarHeight;
var thirdCircleBarArrival;

//variables modified by the user, the interactions
var positionX;
var positionY;

var currentRotation;
var mirror; //the function to draw the invert of the word
var mirrorShown;//to make it flicker
var upsideDown; //if the word has been flipped

var rotateAnimation; //if the word is currently doing the little rotate animation
var infiniteRotating; //if the word is in the rotating mode


function initWord() {
    initSize();
    initOffsets();

    //give the default values
    positionX = 0;
    positionY = 0;
    currentRotation = 0;
    mirror = false;
    mirrorShown = false;
    upsideDown = false;
    rotateAnimation = false;
    infiniteRotating = false;
}

//sets all the units
function initSize() {
    barHeight = baseUnit;
    circleRadius = barHeight / 3.2;
    strokeWidth = barHeight / 14;
    littleBar = 2 * circleRadius - (2 * strokeWidth);
    openingAngle = (Math.PI * 2) - 5.711;
}

//the four appearing possibilities are composed of a matrix made of two rectangle and three circles
//its by offsetting these elements that it makes a word
function initOffsets() {
    firstRectangleOffset = [
        [circleRadius * 2 - strokeWidth, -(barHeight - (2 * circleRadius)) / 2],
        [0, (barHeight - (2 * circleRadius)) / 2],
        [strokeWidth, 0],
        [strokeWidth, 0]
    ];
    secondRectangleOffset = [
        [-strokeWidth, 0],
        [-(strokeWidth * 3) - (circleRadius * 2), 0],
        [-strokeWidth, -(barHeight - (2 * circleRadius)) / 2],
        [-(circleRadius * 2), (barHeight - (2 * circleRadius)) / 2]
    ];

    firstCircleOffset = [
        [-strokeWidth * 2, 0],
        [-(2 * strokeWidth), 0],
        [strokeWidth, 0],
        [strokeWidth, 0]
    ];

    secondCircleOffset = [
        [-strokeWidth * 2, 0],
        [-(2 * strokeWidth), 0],
        [strokeWidth, 0],
        [strokeWidth, 0]
    ];

    thirdCircleOffset = [
        [-strokeWidth * 2, 0],
        [0, 0],
        [strokeWidth, 0],
        [strokeWidth, 0]
    ];
}


//this function calculates the proximity to the angles to get the proportion of each word impacting on the word drawn
function setProportions() {
    zeroDistance = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / 2;//the distance between corners  and center

    distanceTopLeft = getDistance((circleRadius * 3 + strokeWidth) * 1.5, (barHeight - circleRadius) * 1.5, positionX, positionY); //the distance between the corner and the mouse
    distanceBottomLeft = getDistance((circleRadius * 3 + strokeWidth) * 1.5, h - (barHeight - circleRadius) * 1.5, positionX, positionY);
    distanceTopRight = getDistance(w - (circleRadius * 3 + strokeWidth) * 1.5, (barHeight - circleRadius) * 1.5, positionX, positionY);
    distanceBottomRight = getDistance(w - (circleRadius * 3 + strokeWidth) * 1.5, h - (barHeight - circleRadius) * 1.5, positionX, positionY);

    topLeftProportion = 1 - distanceTopLeft / zeroDistance; //1 when we are on it, decreasing to zero when we are on the center
    bottomLeftProportion = 1 - distanceBottomLeft / zeroDistance;
    topRightProportion = 1 - distanceTopRight / zeroDistance;
    bottomRightProportion = 1 - distanceBottomRight / zeroDistance;

    correctProportions();

}

//to get a perfect smooth transition, the proportion values need to be tweaked a bit
function correctProportions() {



    var correctedPosX = positionX;
    var correctedPosY = positionY;


    //something that I tried but didnt work so I let it here because I was on the right path! maybe one day...
    // if(positionX<w/2){
    //     var rapportToMidX=w/2-positionX;
    // }else{
    //     var rapportToMidX=positionX-w/2;
    // }
    //
    // if(positionY<h/2){
    //     var rapportToMidY=h/2-positionY;
    // }else{
    //     var rapportToMidY=positionY-h/2;
    // }
    //
    // rapportToMidX=map(rapportToMidX, 0, w/2, 0, 1);
    // rapportToMidY=map(rapportToMidY, 0, h/2, 0, 1);
    // console.log("rapportToMidX"+rapportToMidX);
    // console.log("rapportToMidY"+rapportToMidY);

    //if the mouse is in the topleft corner
    if (topLeftProportion >= topRightProportion && topLeftProportion >= bottomLeftProportion && topLeftProportion >= bottomRightProportion) {
        //to prevent deforming when you're out of the zone
        if (positionX < (circleRadius * 3 + strokeWidth) * 1.5) {
            correctedPosX = (circleRadius * 3 + strokeWidth) * 1.5;
        }
        if (positionY < (barHeight - circleRadius) * 1.5) {
            correctedPosY = (barHeight - circleRadius) * 1.5;
        }
        distanceTopLeft = getDistance((circleRadius * 3 + strokeWidth) * 1.5, (barHeight - circleRadius) * 1.5, correctedPosX, correctedPosY);
        topLeftProportion = 1 - distanceTopLeft / zeroDistance;
        //topLeftProportion=topLeftProportion*rapportToMidX*rapportToMidY;

        var zeroImpactFactor = map(topLeftProportion, 0, 1, 1, 1.1);
        var zeroImpactDistance = Math.sqrt(Math.pow(w / zeroImpactFactor, 2) + Math.pow(h / zeroImpactFactor, 2)) / 2;//the distance between corners endpoint if not on it and center
        bottomLeftProportion = 1 - distanceBottomLeft / zeroImpactDistance;
        topRightProportion = 1 - distanceTopRight / zeroImpactDistance;
        bottomRightProportion = 1 - distanceBottomRight / zeroImpactDistance;

        //correcting the neighbour values
        topRightProportion = map(lerp(0, 1, topLeftProportion * topLeftProportion * topLeftProportion), 0, 1, topRightProportion, 0);
        bottomLeftProportion = map(lerp(0, 1, topLeftProportion * topLeftProportion * topLeftProportion), 0, 1, bottomLeftProportion, 0);

        //if the mouse is in the topright corner
    } else if (topRightProportion >= topLeftProportion && topRightProportion >= bottomLeftProportion && topRightProportion >= bottomRightProportion) {
        //to prevent deforming when you're out of the zone
        if (positionX > w - (circleRadius * 3 + strokeWidth) * 1.5) {
            correctedPosX = w - (circleRadius * 3 + strokeWidth) * 1.5;
        }
        if (positionY < (barHeight - circleRadius) * 1.5) {
            correctedPosY = (barHeight - circleRadius) * 1.5;
        }
        distanceTopRight = getDistance(w - (circleRadius * 3 + strokeWidth) * 1.5, (barHeight - circleRadius) * 1.5, correctedPosX, correctedPosY);
        topRightProportion = 1 - distanceTopRight / zeroDistance;
        //topRightProportion=topRightProportion*rapportToMidX*rapportToMidY;

        var zeroImpactFactor = map(topRightProportion, 0, 1, 1, 1.1);
        var zeroImpactDistance = Math.sqrt(Math.pow(w / zeroImpactFactor, 2) + Math.pow(h / zeroImpactFactor, 2)) / 2;
        topLeftProportion = 1 - distanceTopLeft / zeroImpactDistance;
        bottomLeftProportion = 1 - distanceBottomLeft / zeroImpactDistance;
        bottomRightProportion = 1 - distanceBottomRight / zeroImpactDistance;

        //correcting the neighbour values
        topLeftProportion = map(lerp(0, 1, topRightProportion * topRightProportion * topRightProportion), 0, 1, topLeftProportion, 0);
        bottomRightProportion = map(lerp(0, 1, topRightProportion * topRightProportion * topRightProportion), 0, 1, bottomRightProportion, 0);

        //if the mouse is in the bottomleft corner
    } else if (bottomLeftProportion >= topRightProportion && bottomLeftProportion >= topLeftProportion && bottomLeftProportion >= bottomRightProportion) {
        //to prevent deforming when you're out of the zone
        if (positionX < (circleRadius * 3 + strokeWidth) * 1.5) {
            correctedPosX = (circleRadius * 3 + strokeWidth) * 1.5;
        }
        if (positionY > h - (barHeight - circleRadius) * 1.5) {
            correctedPosY = h - (barHeight - circleRadius) * 1.5;
        }
        distanceBottomLeft = getDistance((circleRadius * 3 + strokeWidth) * 1.5, h - (barHeight - circleRadius) * 1.5, correctedPosX, correctedPosY);
        bottomLeftProportion = 1 - distanceBottomLeft / zeroDistance;
        //bottomLeftProportion=bottomLeftProportion*rapportToMidX*rapportToMidY;

        var zeroImpactFactor = map(bottomLeftProportion, 0, 1, 1, 1.1);
        var zeroImpactDistance = Math.sqrt(Math.pow(w / zeroImpactFactor, 2) + Math.pow(h / zeroImpactFactor, 2)) / 2;
        topLeftProportion = 1 - distanceTopLeft / zeroImpactDistance;
        topRightProportion = 1 - distanceTopRight / zeroImpactDistance;
        bottomRightProportion = 1 - distanceBottomRight / zeroImpactDistance;

        //correcting the neighbour values
        topLeftProportion = map(lerp(0, 1, bottomLeftProportion * bottomLeftProportion * bottomLeftProportion), 0, 1, topLeftProportion, 0);
        bottomRightProportion = map(lerp(0, 1, bottomLeftProportion * bottomLeftProportion * bottomLeftProportion), 0, 1, bottomRightProportion, 0);


        //if the mouse is in the bottomright corner
    } else {
        if (positionX > w - (circleRadius * 3 + strokeWidth) * 1.5) {
            correctedPosX = w - (circleRadius * 3 + strokeWidth) * 1.5;
        }
        if (positionY > h - (barHeight - circleRadius) * 1.5) {
            correctedPosY = h - (barHeight - circleRadius) * 1.5;
        }
        distanceBottomRight = getDistance(w - (circleRadius * 3 + strokeWidth) * 1.5, h - (barHeight - circleRadius) * 1.5, correctedPosX, correctedPosY);
        bottomRightProportion = 1 - distanceBottomRight / zeroDistance;
        //topLeftProportion=topLeftProportion*rapportToMidX*rapportToMidY;

        var zeroImpactFactor = map(bottomRightProportion, 0, 1, 1, 1.1);
        var zeroImpactDistance = Math.sqrt(Math.pow(w / zeroImpactFactor, 2) + Math.pow(h / zeroImpactFactor, 2)) / 2;
        topLeftProportion = 1 - distanceTopLeft / zeroImpactDistance;
        bottomLeftProportion = 1 - distanceBottomLeft / zeroImpactDistance;
        topRightProportion = 1 - distanceTopRight / zeroImpactDistance;

        //correcting the neighbour values
        topRightProportion = map(lerp(0, 1, bottomRightProportion * bottomRightProportion * bottomRightProportion), 0, 1, topRightProportion, 0);
        bottomLeftProportion = map(lerp(0, 1, bottomRightProportion * bottomRightProportion * bottomRightProportion), 0, 1, bottomLeftProportion, 0);
    }

    // if the value is very small or less than zero, it has to be zero to have graphic coherence
    if (topLeftProportion < 0.00001) {
        topLeftProportion = 0;
    }

    if (bottomLeftProportion < 0.00001) {
        bottomLeftProportion = 0;
    }

    if (topRightProportion < 0.00001) {
        topRightProportion = 0;
    }

    if (bottomRightProportion < 0.00001) {
        bottomRightProportion = 0;
    }
}


//the round letters are drawn with:
//an cutting arc to make the cut on letters e and a
//a bar for the bar of letters e and a
//this function is to manipulate the cutting arc and bars,
//as they cannot be directly calculated proportionnaly because they starting point and angles are changing
function setArcParameters() {
    //if the mouse is in the topleft corner
    if (topLeftProportion >= topRightProportion && topLeftProportion >= bottomLeftProportion && topLeftProportion >= bottomRightProportion) {

        var distanceXNeighbour = (w - circleRadius * 3 + strokeWidth) - (circleRadius * 3 + strokeWidth);//we get the distance between him and his word neighbour
        var distanceYNeighbour = (h - barHeight - circleRadius) - (barHeight - circleRadius);
        var distanceXPosition = positionX - (circleRadius * 3 + strokeWidth) * 1.5;
        var distanceYPosition = positionY - (barHeight - circleRadius) * 1.5;

        var proportionTopLeftX = 1 - 2 * (distanceXPosition / distanceXNeighbour);//depending on the distance of the elements, we get the proportion it has to be changed on the x axis
        //0 happens when it's between two states; that means in the center
        var proportionTopLeftY = 1 - 2 * (distanceYPosition / distanceYNeighbour);


        //here we apply the drawing settings for a and b
        firstCircleCutDeparture = 0;
        firstCircleCutArrival = 0;

        secondCircleCutDeparture = 2 * Math.PI;
        secondCircleCutArrival = 2 * Math.PI + (proportionTopLeftX * proportionTopLeftY * openingAngle);
        if (secondCircleCutArrival > 2 * Math.PI + openingAngle) {
            secondCircleCutArrival = 2 * Math.PI + openingAngle;
        }

        thirdCircleCutDeparture = Math.PI;
        thirdCircleCutArrival = Math.PI + (proportionTopLeftX * proportionTopLeftY * openingAngle);
        if (thirdCircleCutArrival > Math.PI + openingAngle) {
            thirdCircleCutArrival = Math.PI + openingAngle;
        }


        firstCircleBarDeparture = 0;
        firstCircleBarHeight = 0;
        firstCircleBarArrival = 0;

        secondCircleBarDeparture = circleRadius - strokeWidth;
        secondCircleBarHeight = -strokeWidth;
        secondCircleBarArrival = proportionTopLeftX * proportionTopLeftY * (-littleBar);

        if (secondCircleBarArrival > 0) {
            secondCircleBarArrival = 0;
        } else if (secondCircleBarArrival < -littleBar) {
            secondCircleBarArrival = -littleBar;
        }

        thirdCircleBarDeparture = -(circleRadius - strokeWidth);
        thirdCircleBarHeight = 0;
        thirdCircleBarArrival = proportionTopLeftX * proportionTopLeftY * littleBar;

        if (thirdCircleBarArrival < 0) {
            thirdCircleBarArrival = 0;
        } else if (thirdCircleBarArrival > littleBar) {
            thirdCircleBarArrival = littleBar;
        }

        //if the mouse is in the topright corner
    } else if (topRightProportion >= topLeftProportion && topRightProportion >= bottomLeftProportion && topRightProportion >= bottomRightProportion) {
        var distanceXNeighbour = (w - circleRadius * 3 + strokeWidth) - (circleRadius * 3 + strokeWidth);
        var distanceYNeighbour = (h - barHeight - circleRadius) - (barHeight - circleRadius);
        var distanceXPosition = w - (circleRadius * 3 + strokeWidth) * 1.5 - positionX;
        var distanceYPosition = positionY - (barHeight - circleRadius) * 1.5;

        var proportionTopRightX = 1 - 2 * (distanceXPosition / distanceXNeighbour);
        var proportionTopRightY = 1 - 2 * (distanceYPosition / distanceYNeighbour);


        firstCircleCutDeparture = 2 * Math.PI;
        firstCircleCutArrival = 2 * Math.PI + (proportionTopRightX * proportionTopRightY * openingAngle);
        if (firstCircleCutArrival > 2 * Math.PI + openingAngle) {
            firstCircleCutArrival = 2 * Math.PI + openingAngle;
        }

        secondCircleCutDeparture = Math.PI;
        secondCircleCutArrival = Math.PI + proportionTopRightX * proportionTopRightY * openingAngle;
        if (secondCircleCutArrival > Math.PI + openingAngle) {
            secondCircleCutArrival = Math.PI + openingAngle;
        }

        thirdCircleCutDeparture = 0;
        thirdCircleCutArrival = 0;

        firstCircleBarDeparture = circleRadius - strokeWidth;
        firstCircleBarHeight = -strokeWidth;
        firstCircleBarArrival = proportionTopRightX * proportionTopRightY * (-littleBar);
        if (firstCircleBarArrival > 0) {
            firstCircleBarArrival = 0;
        } else if (firstCircleBarArrival < -littleBar) {
            firstCircleBarArrival = -littleBar;
        }


        secondCircleBarDeparture = -(circleRadius - strokeWidth);
        secondCircleBarHeight = 0;
        secondCircleBarArrival = proportionTopRightX * proportionTopRightY * littleBar;
        if (secondCircleBarArrival < 0) {
            secondCircleBarArrival = 0;
        } else if (secondCircleBarArrival > littleBar) {
            secondCircleBarArrival = littleBar;
        }


        thirdCircleBarDeparture = 0;
        thirdCircleBarHeight = 0;
        thirdCircleBarArrival = 0;

        //if the mouse is in the bottomleft corner
    } else if (bottomLeftProportion >= topRightProportion && bottomLeftProportion >= topLeftProportion && bottomLeftProportion >= bottomRightProportion) {
        var distanceXNeighbour = (w - circleRadius * 3 + strokeWidth) - (circleRadius * 3 + strokeWidth);
        var distanceYNeighbour = (h - barHeight - circleRadius) - (barHeight - circleRadius);
        var distanceXPosition = positionX - (circleRadius * 3 + strokeWidth) * 1.5;
        var distanceYPosition = h - (barHeight - circleRadius) * 1.5 - positionY;

        var proportionBottomLeftX = 1 - 2 * (distanceXPosition / distanceXNeighbour);
        var proportionBottomLeftY = 1 - 2 * (distanceYPosition / distanceYNeighbour);


        firstCircleCutDeparture = 0;
        firstCircleCutArrival = 0;

        secondCircleCutDeparture = 0;
        secondCircleCutArrival = 0;

        thirdCircleCutDeparture = 2 * Math.PI;
        thirdCircleCutArrival = 2 * Math.PI + (proportionBottomLeftX * proportionBottomLeftY * openingAngle);
        if (thirdCircleCutArrival > 2 * Math.PI + openingAngle) {
            thirdCircleCutArrival = 2 * Math.PI + openingAngle;
        }

        firstCircleBarDeparture = 0;
        firstCircleBarHeight = 0;
        firstCircleBarArrival = 0;

        secondCircleBarDeparture = 0;
        secondCircleBarHeight = 0;
        secondCircleBarArrival = 0;

        thirdCircleBarDeparture = circleRadius - strokeWidth;
        thirdCircleBarHeight = -strokeWidth;
        thirdCircleBarArrival = proportionBottomLeftX * proportionBottomLeftY * (-littleBar);
        if (thirdCircleBarArrival > 0) {
            thirdCircleBarArrival = 0;
        } else if (thirdCircleBarArrival < -littleBar) {
            thirdCircleBarArrival = -littleBar;
        }

        //if the mouse is in the bottomright corner
    } else {
        var distanceXNeighbour = (w - circleRadius * 3 + strokeWidth) - (circleRadius * 3 + strokeWidth);
        var distanceYNeighbour = (h - barHeight - circleRadius) - (barHeight - circleRadius);
        var distanceXPosition = w - (circleRadius * 3 + strokeWidth) * 1.5 - positionX;
        var distanceYPosition = h - (barHeight - circleRadius) * 1.5 - positionY;

        var proportionBottomRightX = 1 - 2 * (distanceXPosition / distanceXNeighbour);
        var proportionBottomRightY = 1 - 2 * (distanceYPosition / distanceYNeighbour);


        firstCircleCutDeparture = 0;
        firstCircleCutArrival = 0;

        secondCircleCutDeparture = 0;
        secondCircleCutArrival = 0;

        thirdCircleCutDeparture = 0;
        thirdCircleCutArrival = 0;

        firstCircleBarDeparture = 0;
        firstCircleBarHeight = 0;
        firstCircleBarArrival = 0;

        secondCircleBarDeparture = 0;
        secondCircleBarHeight = 0;
        secondCircleBarArrival = 0;

        thirdCircleBarDeparture = 0;
        thirdCircleBarHeight = 0;
        thirdCircleBarArrival = 0;

    }
    if (firstCircleCutArrival < firstCircleCutDeparture) {
        firstCircleCutArrival = firstCircleCutDeparture;
    }
    if (secondCircleCutArrival < secondCircleCutDeparture) {
        secondCircleCutArrival = secondCircleCutDeparture;
    }
    if (thirdCircleCutArrival < thirdCircleCutDeparture) {
        thirdCircleCutArrival = thirdCircleCutDeparture;
    }
}

function drawProcess() {
    //these values depend on the position so they are updated every frame
    adaptColor();
    setArcParameters();
    setProportions();


    //this is the normal process
    if (!infiniteRotating) {
        //draw the normal word

        if (mirror) {
            //draw the word in mirror
            if (!mirrorShown) {
                drawShapes(false);
                mirrorShown = true;
            } else {
                drawShapes(true);
                mirrorShown = false;
            }
        } else {
            drawShapes(false);
        }

        //to get the weird wonderful effect!
    } else {
        ctx.save();
        if (upsideDown) {
            rotate(Math.PI);
        } else {
            rotate(0);
        }
        infiniteRotate();

        drawShapes(false);
        if (mirror) {
            drawShapes(true);
        }
        ctx.restore();
    }
}


function drawShapes(invert) {
    //this is the normal process
    if (!infiniteRotating) {
        ctx.save();
        //depending on the current state, context has to be manipulated
        if (invert) {
            ctx.translate(w / 2, h / 2);
            ctx.scale(-1, -1);
            ctx.translate(-w / 2, -h / 2);
        }

        if (upsideDown) {
            rotate(Math.PI);
        } else {
            rotate(0);
        }

        infiniteRotate();

        //to get the weird wonderful effect!
    } else {
        ctx.save();
        if (invert) {
            ctx.translate(w / 2, h / 2);
            ctx.scale(-1, -1);
            ctx.translate(-w / 2, -h / 2);
        }
    }

    //l shapes
    ctx.beginPath();
    ctx.fillStyle = foregrndColor;
    ctx.rect(positionX - (circleRadius + strokeWidth + 2 * circleRadius + 2 * strokeWidth) + topLeftProportion * firstRectangleOffset[0][0] + bottomLeftProportion * firstRectangleOffset[1][0] + topRightProportion * firstRectangleOffset[2][0] + bottomRightProportion * firstRectangleOffset[3][0], positionY - barHeight / 2 + topLeftProportion * firstRectangleOffset[0][1] + bottomLeftProportion * firstRectangleOffset[1][1] + topRightProportion * firstRectangleOffset[2][1] + bottomRightProportion * firstRectangleOffset[3][1], strokeWidth, barHeight); //l
    ctx.rect(positionX + (circleRadius + 2 * circleRadius + 2 * strokeWidth) + topLeftProportion * secondRectangleOffset[0][0] + bottomLeftProportion * secondRectangleOffset[1][0] + topRightProportion * secondRectangleOffset[2][0] + bottomRightProportion * secondRectangleOffset[3][0], positionY - barHeight / 2 + topLeftProportion * secondRectangleOffset[0][1] + bottomLeftProportion * secondRectangleOffset[1][1] + topRightProportion * secondRectangleOffset[2][1] + bottomRightProportion * secondRectangleOffset[3][1], strokeWidth, barHeight);
    ctx.fill();
    ctx.closePath();

    //o shapes
    ctx.beginPath();
    ctx.fillStyle = foregrndColor;
    ctx.arc(positionX - (circleRadius + strokeWidth + circleRadius) + topLeftProportion * firstCircleOffset[0][0] + bottomLeftProportion * firstCircleOffset[1][0] + topRightProportion * firstCircleOffset[2][0] + bottomRightProportion * firstCircleOffset[3][0], positionY, circleRadius, 0, 2 * Math.PI);
    ctx.arc(positionX + topLeftProportion * secondCircleOffset[0][0] + bottomLeftProportion * secondCircleOffset[1][0] + topRightProportion * secondCircleOffset[2][0] + bottomRightProportion * secondCircleOffset[3][0], positionY, circleRadius, 0, 2 * Math.PI);
    ctx.arc(positionX + (circleRadius + strokeWidth + circleRadius) + topLeftProportion * thirdCircleOffset[0][0] + bottomLeftProportion * thirdCircleOffset[1][0] + topRightProportion * thirdCircleOffset[2][0] + bottomRightProportion * thirdCircleOffset[3][0], positionY, circleRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();


    //center of the o letter
    ctx.beginPath();
    ctx.fillStyle = backgrndColor;
    ctx.arc(positionX - (circleRadius + strokeWidth + circleRadius) + topLeftProportion * firstCircleOffset[0][0] + bottomLeftProportion * firstCircleOffset[1][0] + topRightProportion * firstCircleOffset[2][0] + bottomRightProportion * firstCircleOffset[3][0], positionY, circleRadius - strokeWidth, 0, 2 * Math.PI);
    ctx.arc(positionX + topLeftProportion * secondCircleOffset[0][0] + bottomLeftProportion * secondCircleOffset[1][0] + topRightProportion * secondCircleOffset[2][0] + bottomRightProportion * secondCircleOffset[3][0], positionY, circleRadius - strokeWidth, 0, 2 * Math.PI);
    ctx.arc(positionX + (circleRadius + strokeWidth + circleRadius) + topLeftProportion * thirdCircleOffset[0][0] + bottomLeftProportion * thirdCircleOffset[1][0] + topRightProportion * thirdCircleOffset[2][0] + bottomRightProportion * thirdCircleOffset[3][0], positionY, circleRadius - strokeWidth, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();


    //hiding arcs
    ctx.beginPath();
    ctx.fillStyle = backgrndColor;
    ctx.moveTo(positionX - (circleRadius + strokeWidth + circleRadius) + topLeftProportion * firstCircleOffset[0][0] + bottomLeftProportion * firstCircleOffset[1][0] + topRightProportion * firstCircleOffset[2][0] + bottomRightProportion * firstCircleOffset[3][0], positionY);
    ctx.arc(positionX - (circleRadius + strokeWidth + circleRadius) + topLeftProportion * firstCircleOffset[0][0] + bottomLeftProportion * firstCircleOffset[1][0] + topRightProportion * firstCircleOffset[2][0] + bottomRightProportion * firstCircleOffset[3][0], positionY, circleRadius * 1.05, firstCircleCutDeparture, firstCircleCutArrival);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = backgrndColor;
    ctx.moveTo(positionX + topLeftProportion * secondCircleOffset[0][0] + bottomLeftProportion * secondCircleOffset[1][0] + topRightProportion * secondCircleOffset[2][0] + bottomRightProportion * secondCircleOffset[3][0], positionY);
    ctx.arc(positionX + topLeftProportion * secondCircleOffset[0][0] + bottomLeftProportion * secondCircleOffset[1][0] + topRightProportion * secondCircleOffset[2][0] + bottomRightProportion * secondCircleOffset[3][0], positionY, circleRadius * 1.05, secondCircleCutDeparture, secondCircleCutArrival);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = backgrndColor;
    ctx.moveTo(positionX + (circleRadius + strokeWidth + circleRadius) + topLeftProportion * thirdCircleOffset[0][0] + bottomLeftProportion * thirdCircleOffset[1][0] + topRightProportion * thirdCircleOffset[2][0] + bottomRightProportion * thirdCircleOffset[3][0], positionY);
    ctx.arc(positionX + (circleRadius + strokeWidth + circleRadius) + topLeftProportion * thirdCircleOffset[0][0] + bottomLeftProportion * thirdCircleOffset[1][0] + topRightProportion * thirdCircleOffset[2][0] + bottomRightProportion * thirdCircleOffset[3][0], positionY, circleRadius * 1.05, thirdCircleCutDeparture, thirdCircleCutArrival);
    ctx.fill();
    ctx.closePath();

    //littleBar
    ctx.beginPath();
    ctx.fillStyle = foregrndColor;
    ctx.rect(positionX - (circleRadius + strokeWidth + circleRadius) + topLeftProportion * firstCircleOffset[0][0] + bottomLeftProportion * firstCircleOffset[1][0] + topRightProportion * firstCircleOffset[2][0] + bottomRightProportion * firstCircleOffset[3][0] + firstCircleBarDeparture, positionY + firstCircleBarHeight, firstCircleBarArrival, strokeWidth);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = foregrndColor;
    ctx.rect(positionX + topLeftProportion * secondCircleOffset[0][0] + bottomLeftProportion * secondCircleOffset[1][0] + topRightProportion * secondCircleOffset[2][0] + bottomRightProportion * secondCircleOffset[3][0] + secondCircleBarDeparture, positionY + secondCircleBarHeight, secondCircleBarArrival, strokeWidth);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = foregrndColor;
    ctx.rect(positionX + (circleRadius + strokeWidth + circleRadius) + topLeftProportion * thirdCircleOffset[0][0] + bottomLeftProportion * thirdCircleOffset[1][0] + topRightProportion * thirdCircleOffset[2][0] + bottomRightProportion * thirdCircleOffset[3][0] + thirdCircleBarDeparture, positionY + thirdCircleBarHeight, thirdCircleBarArrival, strokeWidth);
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

//makes the word simply rotate 180 so we can see the other side
function rotate(angle) {
    //if the word is currently moving
    if (rotateAnimation) {
        //the rotation has to be made on the center of the word
        ctx.translate(positionX, positionY);

        if (upsideDown) {
            currentRotation += 5;
            ctx.rotate(currentRotation * Math.PI / 180);
        } else {
            currentRotation -= 5;
            ctx.rotate(currentRotation * Math.PI / 180);
        }

        ctx.translate(-positionX, -positionY);

    } else {

        ctx.translate(positionX, positionY);

        ctx.rotate(angle);

        ctx.translate(-positionX, -positionY);

    }
    if (currentRotation == 180) {
        rotateAnimation = false;

    } else if (currentRotation == 0) {
        rotateAnimation = false;
    }
}

//rotates at a different screen depending on the position
function infiniteRotate() {
    if (infiniteRotating) {
        var zeroDistance = Math.sqrt(Math.pow(w - (w / 3), 2) + Math.pow(h - (h / 3), 2)) / 2;//the distance between corners and center
        var distanceToCenter = getDistance(positionX, positionY, w / 2, h / 2); //the distance between the mouse and center
        var angleProportion = 1 - distanceToCenter / zeroDistance;


        ctx.translate(positionX, positionY);

        if (upsideDown) {
            currentRotation += angleProportion * 45;
            ctx.rotate(currentRotation * Math.PI / 180);
        } else {
            currentRotation -= angleProportion * 45;
            ctx.rotate(currentRotation * Math.PI / 180);
        }
        if (currentRotation >= 360) {
            currentRotation = currentRotation % 360;
        } else if (currentRotation < 0) {
            currentRotation = currentRotation * -1;
            currentRotation = currentRotation % 360;
            currentRotation = 360 - currentRotation;
        }
        ctx.translate(-positionX, -positionY);
    }
}

function adaptColor() {
    if (rotateAnimation) {
        //not working because ctx background refresh is too slow :-(
        //var bgGrey=map(currentRotation, 0, 180, 0, 255);
        //var fgGrey=map(currentRotation, 0, 180, 255, 0);

        if (currentRotation > 85) {
                backgrndColor = 'rgba(255,255,255,1)';
                foregrndColor = 'rgba(0,0,0,1)';
            } else {
                foregrndColor = 'rgba(255,255,255,1)';
                backgrndColor = 'rgba(0,0,0,1)';
            }



        if (infiniteRotating) {
            if (currentRotation < 180) {
                foregrndColor = 'rgba(255,255,255,1)';
                backgrndColor = 'rgba(0,0,0,1)';
            } else {
                backgrndColor = 'rgba(255,255,255,1)';
                foregrndColor = 'rgba(0,0,0,1)';
            }
        }
    } else {
        if(!upsideDown){
            if (mirrorShown) {
                backgrndColor = 'rgba(255,255,255,1)';
                foregrndColor = 'rgba(0,0,0,1)';
            } else {
                foregrndColor = 'rgba(255,255,255,1)';
                backgrndColor = 'rgba(0,0,0,1)';
            }
        }else{
            if (mirrorShown) {
                foregrndColor = 'rgba(255,255,255,1)';
                backgrndColor = 'rgba(0,0,0,1)';
            } else {
                backgrndColor = 'rgba(255,255,255,1)';
                foregrndColor = 'rgba(0,0,0,1)';
            }
        }

    }
    ctx.fillStyle = backgrndColor;
    ctx.fillRect(0, 0, w, h);
}