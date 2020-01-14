"use strict"

console.log("Hello inspector");

let newDigitTimerId = null;

function newDigit() {
    document.getElementById("demo").innerHTML += Math.floor(Math.random() * 10);
}

function toggleTimer() {
    if (newDigitTimerId) {
        clearInterval(newDigitTimerId);
        newDigitTimerId = null;

    } else {
        newDigitTimerId = setInterval(newDigit, 100);
    }
}

function resetDemo() {
    if (newDigitTimerId) {
        toggleTimer();
    }
    document.getElementById("demo").innerHTML = '&nbsp;';
}
